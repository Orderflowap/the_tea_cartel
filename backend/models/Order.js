

// const mongoose = require('mongoose');

// // const orderSchema = new mongoose.Schema({
// //   orderNumber: {
// //     type: String,
// //     unique: true,
// //     sparse: true // Allows null values but ensures uniqueness for non-null values
// //   },
// //   tableNumber: {
// //     type: Number,
// //     required: true
// //   },
// //   customerName: {
// //     type: String,
// //     default: 'Walk-in Customer'
// //   },
// //   mobileNumber:{
// //     type:String,
// //     required:true,
// //   },
// //   items: [{
// //     name: {
// //       type: String,
// //       required: true
// //     },
// //     quantity: {
// //       type: Number,
// //       required: true,
// //       min: 1
// //     },
// //     price: {
// //       type: Number,
// //       required: true,
// //       min: 0
// //     },
// //     notes: {
// //       type: String,
// //       default: ''
// //     }
// //   }],
// //   total: {
// //     type: Number,
// //     min: 0
// //   },
// //   tax: {
// //     type: Number,
// //     min: 0
// //   },
// //   finalTotal: {
// //     type: Number,
// //     required: true,
// //     min: 0,
// //     default: 0
// //   },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'served', 'completed', 'cancelled', 'paid'],
// //     default: 'pending'
// //   },
// //   paymentMethod: {
// //     type: String,
// //     enum: ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'Not Specified'],
// //     default: 'Not Specified'
// //   },
// //   notes: {
// //     type: String,
// //     default: ''
// //   }
// // }, {
// //   timestamps: true
// // });

// // Calculate totals before saving
// const orderSchema = new mongoose.Schema({
//   tableNumber: { type: Number, required: true },
//   customerName: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   items: [{
//     menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
//   }],
//   totalAmount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'preparing', 'ready', 'served', 'paid'],
//     default: 'pending' 
//   },
//   isPaid: { type: Boolean, default: false },
//   paidAt: { type: Date },
//   orderNumber: { type: String, unique: true }
// }, {
//   timestamps: true
// });

// orderSchema.pre('save', function(next) {
//   if (this.items && this.items.length > 0) {
//     this.total = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//     this.tax = this.total * 0.085; // 8.5% tax
//     this.finalTotal = this.total + this.tax;
//   }
//   next();
// });

// // Auto-generate order number if not provided
// orderSchema.pre('save', function(next) {
//   if (!this.orderNumber) {
//     const timestamp = Date.now().toString().slice(-6);
//     this.orderNumber = `ORD-${timestamp}`;
//   }
//   next();
// });

// module.exports = mongoose.model('Order', orderSchema);

// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   menuItem: {
//     type: String, // CHANGE FROM ObjectId to String
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   isVeg: {
//     type: Boolean,
//     default: true
//   }
// });

// const orderSchema = new mongoose.Schema({
//   // Session information
//   sessionId: {
//     type: String,
//     required: true
//     // REMOVE unique: true - it causes conflicts
//   },
//   tableNumber: {
//     type: Number,
//     required: true
//   },
//   customerName: {
//     type: String,
//     required: true
//   },
//   mobileNumber: {
//     type: String,
//     required: true
//   },
  
//   // Order items grouped by session
//   items: [orderItemSchema],
  
//   // Order status and timing
//   status: {
//     type: String,
//     enum: ['active', 'billed', 'paid', 'cancelled'],
//     default: 'active'
//   },
  
//   // Financial information
//   subtotal: {
//     type: Number,
//     default: 0
//   },
//   taxAmount: {
//     type: Number,
//     default: 0
//   },
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
  
//   // Timestamps
//   sessionStartTime: {
//     type: Date,
//     default: Date.now
//   },
//   billGeneratedTime: {
//     type: Date
//   },
//   paymentTime: {
//     type: Date
//   },
  
//   // Additional fields
//   orderNumber: {
//     type: String
//     // REMOVE unique: true - can cause conflicts
//   },
//   billNumber: {
//     type: String
//     // REMOVE unique: true - can cause conflicts
//   },
  
//   // Kitchen status
//   kitchenStatus: {
//     type: String,
//     enum: ['pending', 'preparing', 'ready', 'served'],
//     default: 'pending'
//   }
// }, {
//   timestamps: true
// });

// // Calculate totals before saving
// orderSchema.pre('save', function(next) {
//   this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   this.taxAmount = this.subtotal * 0.05; // 5% tax
//   this.totalAmount = this.subtotal + this.taxAmount;
  
//   // Generate sessionId if not present
//   if (!this.sessionId) {
//     this.sessionId = `SESSION-${this.tableNumber}-${this.mobileNumber}-${Date.now()}`;
//   }
  
//   // Generate order number if not present
//   if (!this.orderNumber) {
//     this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
//   }
  
//   next();
// });

// module.exports = mongoose.model('Order', orderSchema);



// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   menuItem: {
//     type: String, // CHANGED: String instead of ObjectId
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   isVeg: {
//     type: Boolean,
//     default: true
//   }
// });

// const orderSchema = new mongoose.Schema({
//   tableNumber: {
//     type: Number,
//     required: true
//   },
//   customerName: {
//     type: String,
//     required: true
//   },
//   mobileNumber: {
//     type: String,
//     required: true
//   },
//   items: [orderItemSchema],
//   status: {
//     type: String,
//     default: 'active'
//   },
//   subtotal: {
//     type: Number,
//     default: 0
//   },
//   taxAmount: {
//     type: Number,
//     default: 0
//   },
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
//   orderNumber: {
//     type: String
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// // Calculate totals before saving
// orderSchema.pre('save', function(next) {
//   // Calculate subtotal from items
//   this.subtotal = this.items.reduce((total, item) => {
//     return total + (item.price * item.quantity);
//   }, 0);
  
//   // Calculate tax and total
//   this.taxAmount = this.subtotal * 0.05;
//   this.totalAmount = this.subtotal + this.taxAmount;
  
//   // Generate order number if not exists
//   if (!this.orderNumber) {
//     this.orderNumber = `ORD-${Date.now()}`;
//   }
  
//   next();
// });

// module.exports = mongoose.model('Order', orderSchema);


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
    required: true
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
    trim: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    default: 0
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
    maxlength: 500
  }
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate tax and total
  this.taxAmount = parseFloat((this.subtotal * 0.05).toFixed(2));
  this.totalAmount = parseFloat((this.subtotal + this.taxAmount).toFixed(2));
  this.finalTotal = this.totalAmount;
  
  // Generate order number if not exists
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  
  // Update isPaid based on status
  if (this.status === 'paid') {
    this.isPaid = true;
  } else {
    this.isPaid = false;
  }
  
  next();
});

// Index for better performance
orderSchema.index({ status: 1 });
orderSchema.index({ tableNumber: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

// Virtual for formatted date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN');
});

// Virtual for formatted time
orderSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to check if order is active
orderSchema.methods.isActive = function() {
  return ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(this.status);
};

// Static method to get active orders
orderSchema.statics.getActiveOrders = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
  }).sort({ createdAt: -1 });
};

// Static method to get orders by table
orderSchema.statics.getTableOrders = function(tableNumber) {
  return this.find({
    tableNumber: parseInt(tableNumber),
    status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);