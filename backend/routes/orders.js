


const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    console.log('🔍 === ORDER CREATION STARTED ===');
    console.log('📦 Full request body:', req.body);
    console.log('📦 Body type:', typeof req.body);
    console.log('📦 Body keys:', Object.keys(req.body || {}));
    console.log('🧀 EXTRA CHEESE DATA FROM FRONTEND:');
    console.log('   Order extraCheeseTotal:', req.body.extraCheeseTotal);
    console.log('   Order totalAmount:', req.body.totalAmount);
    // If body is empty, send specific error
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ EMPTY BODY DETECTED');
      return res.status(400).json({
        success: false,
        message: 'Empty request body received',
        error: 'No data was sent in the request body',
        troubleshooting: 'Check if Content-Type: application/json header is set'
      });
    }

    // Direct property access (no destructuring)
    const tableNumber = req.body.tableNumber;
    const customerName = req.body.customerName;
    const mobileNumber = req.body.mobileNumber;
    const items = req.body.items || [];
    const notes = req.body.notes || '';

    console.log('📋 Extracted values:', {
      tableNumber,
      customerName,
      mobileNumber,
      itemsCount: items.length,
      items: items
    });

    // ✅ FIXED: Enhanced validation
    if (tableNumber === undefined || tableNumber === null || tableNumber === '') {
      return res.status(400).json({
        success: false,
        message: 'Table number is required',
        receivedData: { tableNumber, customerName, mobileNumber }
      });
    }

    if (!customerName || customerName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    if (!mobileNumber || mobileNumber.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // ✅ FIXED: Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Item ${i + 1} is missing required fields: name, price, or quantity`
        });
      }
      if (item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Item ${i + 1} quantity must be at least 1`
        });
      }
    }

    // ✅ FIXED: Create order data with proper field mapping
    // const orderData = {
    //   tableNumber: parseInt(tableNumber),
    //   customerName: customerName.toString().trim(),
    //   mobileNumber: mobileNumber.toString().trim(),
    //   items: items.map(item => ({
    //     menuItem: item._id || item.menuItem || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    //     name: item.name.toString().trim(),
    //     price: parseFloat(item.price),
    //     quantity: parseInt(item.quantity),
    //     isVeg: Boolean(item.isVeg)
    //   })),
    //   notes: notes.toString().trim()
    // };

    // ✅ FIXED: Create order data with proper field mapping INCLUDING EXTRA CHEESE
const orderData = {
  tableNumber: parseInt(tableNumber),
  customerName: customerName.toString().trim(),
  mobileNumber: mobileNumber.toString().trim(),
  items: items.map(item => ({
    menuItem: item._id || item.menuItem || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: item.name.toString().trim(),
    price: parseFloat(item.price),
    quantity: parseInt(item.quantity),
    isVeg: Boolean(item.isVeg),
    // ✅ ADD THESE EXTRA CHEESE FIELDS FROM FRONTEND
    extraCheese: Boolean(item.extraCheese) || false,
    extraCheesePrice: parseFloat(item.extraCheesePrice) || 0,
    itemTotal: parseFloat(item.itemTotal) || 0
  })),
  notes: notes.toString().trim(),
  // ✅ ALSO INCLUDE ORDER-LEVEL EXTRA CHEESE TOTAL
  extraCheeseTotal: parseFloat(req.body.extraCheeseTotal) || 0,
  totalAmount: parseFloat(req.body.totalAmount) || 0
};

console.log('✅ Processed order data with extra cheese:', orderData);
console.log('🔍 Checking extra cheese data in items:');
orderData.items.forEach((item, index) => {
  console.log(`   Item ${index + 1}: ${item.name}`);
  console.log(`     extraCheese: ${item.extraCheese}`);
  console.log(`     extraCheesePrice: ${item.extraCheesePrice}`);
  console.log(`     itemTotal: ${item.itemTotal}`);
});
console.log(`   Order extraCheeseTotal: ${orderData.extraCheeseTotal}`);
console.log(`   Order totalAmount: ${orderData.totalAmount}`);
    console.log('✅ Processed order data:', orderData);

    const order = new Order(orderData);
    const savedOrder = await order.save();
    
    console.log('✅ Order created successfully:', savedOrder.orderNumber);

    // ✅ FIXED: Enhanced socket event emission
    try {
      const io = req.app.get('io');
      if (io) {
        const socketData = {
          ...savedOrder.toObject(),
          eventType: 'new-order',
          timestamp: new Date().toISOString(),
          source: 'api'
        };

        // Emit to all clients and specific rooms
        io.emit('new-order', socketData);
        io.emit('order-created', socketData);
        
        io.to('reception').emit('new-order', socketData);
        io.to('kitchen').emit('new-order', socketData);

        console.log('📢 Emitted new-order event to all rooms');
      }
    } catch (socketError) {
      console.warn('⚠️ Socket error:', socketError.message);
      // Don't fail the request if socket fails
    }

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // ✅ FIXED: Handle duplicate order number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists, please try again'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/orders - Get all orders with filtering
router.get('/', async (req, res) => {
  try {
    const { status, table, limit, page } = req.query;
    let query = {};
    
    // Filter by status
    if (status) {
      if (status === 'active') {
        query.status = { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] };
      } else {
        query.status = status;
      }
    }
    
    // Filter by table
    if (table && !isNaN(table)) {
      query.tableNumber = parseInt(table);
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      message: `Found ${orders.length} orders`
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// UPDATE ORDER STATUS
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Updating order ${id} status to: ${status}`);
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status, 
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    console.log(`✅ Order status updated: ${order.orderNumber} -> ${status}`);

    // Emit socket event for status update
    try {
      const io = req.app.get('io');
      if (io) {
        const socketData = {
          ...order.toObject(),
          eventType: 'status-updated',
          timestamp: new Date().toISOString()
        };

        io.emit('order-status-updated', socketData);
        io.emit('order-updated', socketData);
        
        io.to('reception').emit('order-status-updated', socketData);
        io.to('kitchen').emit('order-status-updated', socketData);

        console.log('📢 Emitted order status update events');
      }
    } catch (socketError) {
      console.warn('⚠️ Could not emit socket event:', socketError.message);
    }

    res.json({ 
      success: true, 
      data: order,
      message: `Order status updated to ${status}`
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order status',
      error: error.message 
    });
  }
});

// UPDATE ORDER - COMPREHENSIVE ENDPOINT
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Don't allow direct status updates through this endpoint
    if (updateData.status) {
      delete updateData.status;
    }
    
    console.log(`🔄 Updating order ${id}:`, updateData);

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event for general updates
    try {
      const io = req.app.get('io');
      if (io) {
        const socketData = {
          ...order.toObject(),
          eventType: 'order-updated',
          timestamp: new Date().toISOString()
        };

        io.emit('order-updated', socketData);
        io.to('reception').emit('order-updated', socketData);
      }
    } catch (socketError) {
      console.warn('⚠️ Could not emit socket event:', socketError.message);
    }

    res.json({ 
      success: true, 
      data: order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order',
      error: error.message 
    });
  }
});

// GET /api/orders/active - Get active orders
router.get('/active', async (req, res) => {
  try {
    const activeOrders = await Order.find({
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activeOrders,
      count: activeOrders.length,
      message: `Found ${activeOrders.length} active orders`
    });

  } catch (error) {
    console.error('❌ Error fetching active orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active orders',
      error: error.message
    });
  }
});

// GET /api/orders/table/:tableNumber - Get orders by table
router.get('/table/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    
    if (!tableNumber || isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Valid table number is required'
      });
    }

    const tableOrders = await Order.find({ 
      tableNumber: parseInt(tableNumber) 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tableOrders,
      count: tableOrders.length,
      message: `Found ${tableOrders.length} orders for table ${tableNumber}`
    });

  } catch (error) {
    console.error('❌ Error fetching table orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching table orders',
      error: error.message
    });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event for deletion
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('order-deleted', {
          orderId: id,
          orderNumber: order.orderNumber,
          tableNumber: order.tableNumber,
          timestamp: new Date().toISOString()
        });
      }
    } catch (socketError) {
      console.warn('⚠️ Could not emit socket event:', socketError.message);
    }

    res.json({ 
      success: true, 
      message: 'Order deleted successfully',
      data: { orderNumber: order.orderNumber, tableNumber: order.tableNumber }
    });

  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting order',
      error: error.message 
    });
  }
});

// GET /api/orders/stats - Get order statistics
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
    });
    const completedOrders = await Order.countDocuments({ status: 'paid' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Revenue calculation
    const revenueResult = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      },
      message: 'Order statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
});

module.exports = router;