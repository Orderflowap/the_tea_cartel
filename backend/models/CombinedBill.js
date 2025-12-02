// models/CombinedBill.js
const mongoose = require('mongoose');

const combinedBillSchema = new mongoose.Schema({
  combinedBillNumber: {
    type: String,
    required: true,
    unique: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  mobileNumber: String,
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    isVeg: Boolean
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  taxAmount: Number,
  finalTotal: {
    type: Number,
    required: true
  },
  originalOrders: [{
    orderNumber: String,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  generatedBy: {
    type: String,
    default: 'Reception'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'combined'],
    default: 'combined'
  },
  notes: String
});

const CombinedBill = mongoose.model('CombinedBill', combinedBillSchema);
module.exports = CombinedBill;