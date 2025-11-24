// const mongoose = require('mongoose');

// const tableSchema = new mongoose.Schema({
//   tableNumber: {
//     type: Number,
//     required: true,
//     unique: true
//   },
//   qrCode: {
//     type: String,
//     required: true
//   },
//   isOccupied: {
//     type: Boolean,
//     default: false
//   },
//   currentSession: {
//     customerName: String,
//     mobileNumber: String,
//     sessionStart: Date
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Table', tableSchema);

// models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  capacity: {
    type: Number,
    default: 4
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);