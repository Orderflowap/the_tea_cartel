// const express = require('express');
// const router = express.Router();
// const Table = require('../models/Table');
// const QRCode = require('qrcode');

// // Generate QR code for table
// router.post('/generate', async (req, res) => {
//   try {
//     const { tableNumber } = req.body;
    
//     const qrData = JSON.stringify({
//       tableNumber: tableNumber,
//       restaurant: "Your Restaurant",
//       url: `${process.env.FRONTEND_URL}/order/${tableNumber}`
//     });
    
//     const qrCode = await QRCode.toDataURL(qrData);
    
//     const table = new Table({
//       tableNumber,
//       qrCode
//     });
    
//     await table.save();
//     res.json(table);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all tables
// router.get('/', async (req, res) => {
//   try {
//     const tables = await Table.find();
//     res.json(tables);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get table by number
// router.get('/:tableNumber', async (req, res) => {
//   try {
//     const table = await Table.findOne({ tableNumber: req.params.tableNumber });
//     if (!table) {
//       return res.status(404).json({ message: 'Table not found' });
//     }
//     res.json(table);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



// module.exports = router;


// routes/tables.js
const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update table status
router.put('/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { status, currentOrder } = req.body;
    
    let table = await Table.findOne({ tableNumber });
    
    if (!table) {
      // Create table if it doesn't exist
      table = new Table({ tableNumber, status, currentOrder });
    } else {
      // Update existing table
      table.status = status;
      table.currentOrder = currentOrder;
      table.updatedAt = new Date();
    }
    
    await table.save();
    
    // Emit socket event
    req.app.get('io').emit('table-updated', table);
    
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
