


const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  isVeg: {
    type: Boolean,
    default: true
  }
}, {
  _id: true // ✅ FIXED: Ensure subdocuments have _id
});

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'] // ✅ FIXED: Added validation
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // ✅ FIXED: Include virtuals in JSON
  toObject: { virtuals: true } // ✅ FIXED: Include virtuals in objects
});

// ✅ FIXED: Enhanced pre-save middleware with better error handling
orderSchema.pre('save', function(next) {
  try {
    // Calculate subtotal from items
    if (this.items && this.items.length > 0) {
      this.subtotal = this.items.reduce((total, item) => {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
        return total + (isNaN(itemTotal) ? 0 : itemTotal);
      }, 0);
    } else {
      this.subtotal = 0;
    }
    
    // Calculate tax (5%) and total
    this.taxAmount = parseFloat((this.subtotal * 0.05).toFixed(2));
    this.totalAmount = parseFloat((this.subtotal + this.taxAmount).toFixed(2));
    this.finalTotal = this.totalAmount;
    
    // ✅ FIXED: Better order number generation with collision handling
    if (!this.orderNumber) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
      this.orderNumber = `ORD-${timestamp}-${random}`;
      
      // Add a fallback in case of collision
      this.orderNumber = this.orderNumber + '-' + Math.random().toString(36).substr(2, 2).toUpperCase();
    }
    
    // Update isPaid based on status
    this.isPaid = this.status === 'paid';
    
    next();
  } catch (error) {
    console.error('❌ Error in order pre-save middleware:', error);
    next(error);
  }
});

// ✅ FIXED: Pre-validate middleware to ensure data integrity
orderSchema.pre('validate', function(next) {
  // Ensure items array exists and has valid data
  if (!this.items || !Array.isArray(this.items)) {
    this.items = [];
  }
  
  // Validate each item
  this.items.forEach((item, index) => {
    if (!item.menuItem || item.menuItem.trim() === '') {
      item.menuItem = `temp-item-${Date.now()}-${index}`;
    }
    
    // Ensure numeric fields are properly converted
    if (item.price) item.price = parseFloat(item.price);
    if (item.quantity) item.quantity = parseInt(item.quantity);
  });
  
  next();
});

// Index for better performance
orderSchema.index({ status: 1 });
orderSchema.index({ tableNumber: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'items.menuItem': 1 }); // ✅ FIXED: Added index for menuItem queries

// Virtual for formatted date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString('en-IN') : 'N/A';
});

// Virtual for formatted time
orderSchema.virtual('formattedTime').get(function() {
  return this.createdAt ? this.createdAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';
});

// ✅ FIXED: Virtual for order duration
orderSchema.virtual('duration').get(function() {
  if (!this.createdAt) return 'N/A';
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
});

// ✅ FIXED: Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items ? this.items.reduce((total, item) => total + item.quantity, 0) : 0;
});

// Method to check if order is active
orderSchema.methods.isActive = function() {
  return ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(this.status);
};

// ✅ FIXED: Method to mark as paid
orderSchema.methods.markAsPaid = function() {
  this.status = 'paid';
  this.isPaid = true;
  return this.save();
};

// ✅ FIXED: Method to update status with validation
orderSchema.methods.updateStatus = function(newStatus) {
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  this.status = newStatus;
  if (newStatus === 'paid') {
    this.isPaid = true;
  }
  return this.save();
};

// Static method to get active orders
orderSchema.statics.getActiveOrders = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
  }).sort({ createdAt: -1 });
};

// Static method to get orders by table
orderSchema.statics.getTableOrders = function(tableNumber) {
  const tableNum = parseInt(tableNumber);
  if (isNaN(tableNum)) {
    throw new Error('Invalid table number');
  }
  
  return this.find({
    tableNumber: tableNum,
    status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
  }).sort({ createdAt: -1 });
};

// ✅ FIXED: Static method to get today's orders
orderSchema.statics.getTodaysOrders = function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ createdAt: -1 });
};

// ✅ FIXED: Static method to get revenue statistics
orderSchema.statics.getRevenueStats = async function(startDate, endDate) {
  const matchStage = { status: 'paid' };
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  };
};

// ✅ FIXED: Instance method to add item to order
orderSchema.methods.addItem = function(itemData) {
  const newItem = {
    menuItem: itemData._id || itemData.menuItem,
    name: itemData.name,
    price: parseFloat(itemData.price),
    quantity: parseInt(itemData.quantity),
    isVeg: Boolean(itemData.isVeg)
  };
  
  this.items.push(newItem);
  return this.save();
};

// ✅ FIXED: Instance method to remove item from order
orderSchema.methods.removeItem = function(itemIndex) {
  if (itemIndex >= 0 && itemIndex < this.items.length) {
    this.items.splice(itemIndex, 1);
    return this.save();
  }
  throw new Error('Invalid item index');
};

module.exports = mongoose.model('Order', orderSchema);