const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Make sure this import exists

// Create new order
router.post('/', async (req, res) => {
  try {
    const { tableNumber, customerName, mobileNumber, items, specialInstructions } = req.body;
    
    if (!tableNumber || !customerName || !mobileNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      return item;
    });
    
    const order = new Order({
      tableNumber,
      customerName,
      mobileNumber,
      items: orderItems,
      totalAmount,
      specialInstructions
    });
    
    await order.save();
    
    // Send real-time notification to reception
    const io = req.app.get('io');
    io.to('reception').emit('new-order', order);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by table number
router.get('/table/:tableNumber', async (req, res) => {
  try {
    const orders = await Order.find({ tableNumber: req.params.tableNumber })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem');
    
    res.json({
      message: 'Order status updated successfully',
      order: order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order statistics - ADD THIS TO ORDERS.JS
router.get('/stats/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all orders for today
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Calculate stats manually
    const totalOrders = todayOrders.length;
    
    const pendingOrders = todayOrders.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    ).length;

    const totalRevenue = todayOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + (order.totalAmount || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
});

module.exports = router;