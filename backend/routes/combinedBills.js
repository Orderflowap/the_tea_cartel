// routes/combinedBills.js
const express = require('express');
const router = express.Router();
const CombinedBill = require('../models/CombinedBill');

// Save combined bill
router.post('/', async (req, res) => {
  try {
    const combinedBill = new CombinedBill(req.body);
    await combinedBill.save();
    res.status(201).json({
      success: true,
      message: 'Combined bill saved successfully',
      combinedBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving combined bill',
      error: error.message
    });
  }
});

// Get all combined bills
router.get('/', async (req, res) => {
  try {
    const combinedBills = await CombinedBill.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: combinedBills.length,
      combinedBills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching combined bills',
      error: error.message
    });
  }
});

// In your backend routes/combinedBills.js - Add a test endpoint
router.get('/test', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Combined Bills API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test endpoint failed',
      error: error.message
    });
  }
});

// Get combined bills by date range
router.get('/by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const combinedBills = await CombinedBill.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: combinedBills.length,
      combinedBills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching combined bills by date',
      error: error.message
    });
  }
});

// Get combined bill by ID
router.get('/:id', async (req, res) => {
  try {
    const combinedBill = await CombinedBill.findById(req.params.id);
    
    if (!combinedBill) {
      return res.status(404).json({
        success: false,
        message: 'Combined bill not found'
      });
    }
    
    res.json({
      success: true,
      combinedBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching combined bill',
      error: error.message
    });
  }
});

module.exports = router;