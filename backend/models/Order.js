const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway'],
    default: 'dine-in'
  },
  specialInstructions: String,
  orderTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// FIXED: Generate order number before saving
orderSchema.pre('save', async function(next) {
  // Only generate orderNumber if it doesn't exist
  if (!this.orderNumber) {
    try {
      // Find the highest order number
      const lastOrder = await mongoose.model('Order')
        .findOne()
        .sort({ orderNumber: -1 });
      
      let nextNumber = 1;
      if (lastOrder && lastOrder.orderNumber) {
        // Extract number from "ORD0001" format
        const lastNumber = parseInt(lastOrder.orderNumber.replace('ORD', ''));
        nextNumber = lastNumber + 1;
      }
      
      this.orderNumber = `ORD${nextNumber.toString().padStart(4, '0')}`;
      next();
    } catch (error) {
      console.error('Error generating order number:', error);
      // If there's an error, generate a fallback order number
      this.orderNumber = `ORD${Date.now().toString().slice(-4)}`;
      next();
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema);