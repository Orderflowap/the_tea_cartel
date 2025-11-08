const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  currentSession: {
    customerName: String,
    mobileNumber: String,
    sessionStart: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);