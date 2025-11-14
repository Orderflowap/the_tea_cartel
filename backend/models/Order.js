// // const mongoose = require('mongoose');

// // const orderItemSchema = new mongoose.Schema({
// //   menuItem: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'MenuItem',
// //     required: true
// //   },
// //   quantity: {
// //     type: Number,
// //     required: true,
// //     min: 1
// //   },
// //   price: {
// //     type: Number,
// //     required: true
// //   },
// //   specialInstructions: String
// // });

// // // const orderSchema = new mongoose.Schema({
// // //   orderNumber: {
// // //     type: String,
// // //     unique: true
// // //   },
// // //   tableNumber: {
// // //     type: Number,
// // //     required: true
// // //   },
// // //   customerName: {
// // //     type: String,
// // //     required: true
// // //   },
// // //   mobileNumber: {
// // //     type: String,
// // //     required: true
// // //   },
// // //   items: [orderItemSchema],
// // //   totalAmount: {
// // //     type: Number,
// // //     required: true
// // //   },
// // //   status: {
// // //     type: String,
// // //     enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
// // //     default: 'pending'
// // //   },
// // //   orderType: {
// // //     type: String,
// // //     enum: ['dine-in', 'takeaway'],
// // //     default: 'dine-in'
// // //   },
// // //   specialInstructions: String,
// // //   orderTime: {
// // //     type: Date,
// // //     default: Date.now
// // //   }
// // // }, {
// // //   timestamps: true
// // // });

// // const orderSchema = new mongoose.Schema({
// //   orderNumber: {
// //     type: String,
// //     required: true,
// //     unique: true
// //   },
// //   tableNumber: {
// //     type: Number,
// //     required: true
// //   },
// //   customerName: {
// //     type: String,
// //     default: 'Walk-in Customer'
// //   },
// //   items: [{
// //     name: String,
// //     quantity: Number,
// //     price: Number
// //   }],
// //   total: {
// //     type: Number,
// //     required: true
// //   },
// //   tax: {
// //     type: Number,
// //     required: true
// //   },
// //   finalTotal: {
// //     type: Number,
// //     required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'preparing', 'completed', 'cancelled'],
// //     default: 'pending'
// //   },
// //   paymentMethod: {
// //     type: String,
// //     enum: ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet'],
// //     default: 'Cash'
// //   }
// // }, {
// //   timestamps: true
// // });



// // // FIXED: Generate order number before saving
// // orderSchema.pre('save', async function(next) {
// //   // Only generate orderNumber if it doesn't exist
// //   if (!this.orderNumber) {
// //     try {
// //       // Find the highest order number
// //       const lastOrder = await mongoose.model('Order')
// //         .findOne()
// //         .sort({ orderNumber: -1 });
      
// //       let nextNumber = 1;
// //       if (lastOrder && lastOrder.orderNumber) {
// //         // Extract number from "ORD0001" format
// //         const lastNumber = parseInt(lastOrder.orderNumber.replace('ORD', ''));
// //         nextNumber = lastNumber + 1;
// //       }
      
// //       this.orderNumber = `ORD${nextNumber.toString().padStart(4, '0')}`;
// //       next();
// //     } catch (error) {
// //       console.error('Error generating order number:', error);
// //       // If there's an error, generate a fallback order number
// //       this.orderNumber = `ORD${Date.now().toString().slice(-4)}`;
// //       next();
// //     }
// //   } else {
// //     next();
// //   }
// // });

// // module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null values but ensures uniqueness for non-null values
  },
  tableNumber: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  mobileNumber:{
    type:String,
    required:true,
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  total: {
    type: Number,
    min: 0
  },
  tax: {
    type: Number,
    min: 0
  },
  finalTotal: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'Not Specified'],
    default: 'Not Specified'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    this.tax = this.total * 0.085; // 8.5% tax
    this.finalTotal = this.total + this.tax;
  }
  next();
});

// Auto-generate order number if not provided
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
