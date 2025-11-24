


// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');

// // // If using Express, add CSP headers for development
// // app.use((req, res, next) => {
// //   res.setHeader('Content-Security-Policy', "default-src 'self'");
// //   next();
// // });

// // Get all tables with unpaid orders
// router.get('/unpaid-tables', async (req, res) => {
//   try {
//     const unpaidTables = await Order.aggregate([
//       { 
//         $match: { 
//           status: { $ne: 'paid' },
//           isPaid: { $ne: true }
//         } 
//       },
//       {
//         $group: {
//           _id: '$tableNumber',
//           unpaidCount: { $sum: 1 },
//           totalAmount: { $sum: '$totalAmount' },
//           latestOrder: { $max: '$createdAt' }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     const tables = unpaidTables.map(table => ({
//       tableNumber: table._id,
//       unpaidCount: table.unpaidCount,
//       totalAmount: table.totalAmount,
//       latestOrder: table.latestOrder
//     }));

//     res.json({
//       success: true,
//       data: tables,
//       message: `Found ${tables.length} tables with unpaid orders`
//     });
//   } catch (error) {
//     console.error('Error fetching unpaid tables:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching tables with unpaid orders',
//       error: error.message
//     });
//   }
// });

// // Get unpaid orders for specific table
// router.get('/table/:tableNumber/unpaid', async (req, res) => {
//   try {
//     const { tableNumber } = req.params;

//     const unpaidOrders = await Order.find({
//       tableNumber: parseInt(tableNumber),
//       $or: [
//         { status: { $ne: 'paid' } },
//         { isPaid: { $ne: true } }
//       ]
//     }).sort({ createdAt: 1 });

//     res.json({
//       success: true,
//       data: unpaidOrders,
//       message: `Found ${unpaidOrders.length} unpaid orders for table ${tableNumber}`
//     });
//   } catch (error) {
//     console.error('Error fetching unpaid orders for table:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching unpaid orders',
//       error: error.message
//     });
//   }
// });

// // Mark multiple orders as paid
// router.post('/mark-paid', async (req, res) => {
//   try {
//     const { orderIds, tableNumber } = req.body;

//     const result = await Order.updateMany(
//       { 
//         _id: { $in: orderIds },
//         tableNumber: parseInt(tableNumber)
//       },
//       { 
//         $set: { 
//           status: 'paid',
//           isPaid: true,
//           paidAt: new Date()
//         } 
//       }
//     );

//     res.json({
//       success: true,
//       message: `Marked ${result.modifiedCount} orders as paid for table ${tableNumber}`,
//       modifiedCount: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Error marking orders as paid:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error marking orders as paid',
//       error: error.message
//     });
//   }
// });

// // Utility function for date range
// const getTodayDateRange = () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
  
//   return { today, tomorrow };
// };

// // Status validation
// const validateStatus = (status) => {
//   const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];
//   return validStatuses.includes(status);
// };

// // Get all orders
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .limit(100);
    
//     res.json({
//       success: true,
//       data: orders,
//       count: orders.length
//     });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching orders',
//       error: error.message 
//     });
//   }
// });

// // Get order by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: order
//     });
//   } catch (error) {
//     console.error('Error fetching order:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching order',
//       error: error.message
//     });
//   }
// });

// // Create new order
// router.post('/', async (req, res) => {
//   try {
//     // Generate order number if not provided
//     if (!req.body.orderNumber) {
//       const timestamp = Date.now().toString().slice(-6);
//       req.body.orderNumber = `ORD-${timestamp}`;
//     }

//     const order = new Order(req.body);
//     await order.save();
    
//     // Emit socket event for new order
//     req.app.get('io').emit('new-order', order);
    
//     res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: order
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
    
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }
    
//     res.status(400).json({
//       success: false,
//       message: 'Error creating order',
//       error: error.message
//     });
//   }
// });

// // Update order status (PATCH)
// router.patch('/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     console.log(`🔄 Updating order ${id} status to:`, status);

//     // Validate status
//     if (!validateStatus(status)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid status',
//         validStatuses: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled']
//       });
//     }

//     // Find and update the order
//     const order = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!order) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Order not found' 
//       });
//     }

//     console.log(`✅ Order ${id} status updated to: ${status}`);

//     // Emit socket event for real-time updates
//     req.app.get('io').emit('order-status-updated', order);

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order
//     });

//   } catch (error) {
//     console.error('❌ Error updating order status:', error);
    
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Validation error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }

//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid order ID' 
//       });
//     }

//     res.status(500).json({ 
//       success: false,
//       message: 'Error updating order status',
//       error: error.message 
//     });
//   }
// });

// // Update order status (PUT - alternative)
// router.put('/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     console.log(`🔄 PUT: Updating order ${id} status to:`, status);

//     if (!validateStatus(status)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid status',
//         validStatuses: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled']
//       });
//     }

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Order not found' 
//       });
//     }

//     // Update status
//     order.status = status;
//     await order.save();

//     console.log(`✅ Order ${id} status updated to: ${status}`);

//     // Emit socket event
//     req.app.get('io').emit('order-status-updated', order);

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order
//     });

//   } catch (error) {
//     console.error('❌ Error in PUT status update:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error updating order status',
//       error: error.message 
//     });
//   }
// });

// // NEW: Update order status by order number
// router.patch('/order-number/:orderNumber/status', async (req, res) => {
//   try {
//     const { orderNumber } = req.params;
//     const { status } = req.body;

//     console.log(`🔄 Updating order ${orderNumber} status to:`, status);

//     if (!validateStatus(status)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid status',
//         validStatuses: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled']
//       });
//     }

//     // Find order by orderNumber instead of _id
//     const order = await Order.findOneAndUpdate(
//       { orderNumber },
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!order) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Order not found' 
//       });
//     }

//     console.log(`✅ Order ${orderNumber} status updated to: ${status}`);

//     // Emit socket event
//     req.app.get('io').emit('order-status-updated', order);

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order
//     });

//   } catch (error) {
//     console.error('❌ Error updating order status by order number:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error updating order status',
//       error: error.message 
//     });
//   }
// });

// // Update entire order
// router.put('/:id', async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!order) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Order not found' 
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Order updated successfully',
//       data: order
//     });
//   } catch (error) {
//     console.error('Error updating order:', error);
    
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }
    
//     res.status(400).json({
//       success: false,
//       message: 'Error updating order',
//       error: error.message
//     });
//   }
// });

// // Delete order
// router.delete('/:id', async (req, res) => {
//   try {
//     const order = await Order.findByIdAndDelete(req.params.id);
    
//     if (!order) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Order not found' 
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Order deleted successfully',
//       data: { id: req.params.id }
//     });
//   } catch (error) {
//     console.error('Error deleting order:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting order',
//       error: error.message
//     });
//   }
// });

// // Get today's order statistics
// router.get('/stats/today', async (req, res) => {
//   try {
//     const { today, tomorrow } = getTodayDateRange();

//     const todayOrders = await Order.find({
//       createdAt: { $gte: today, $lt: tomorrow }
//     });

//     const totalOrders = todayOrders.length;
//     const pendingOrders = todayOrders.filter(order => 
//       ['pending', 'confirmed', 'preparing'].includes(order.status)
//     ).length;
    
//     const totalRevenue = todayOrders
//       .filter(order => order.status !== 'cancelled')
//       .reduce((total, order) => total + (order.finalTotal || 0), 0);

//     res.json({
//       success: true,
//       data: {
//         totalOrders,
//         pendingOrders,
//         totalRevenue,
//         date: today.toISOString().split('T')[0]
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching today stats:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message 
//     });
//   }
// });

// // Get comprehensive statistics
// router.get('/stats/overview', async (req, res) => {
//   try {
//     const { today, tomorrow } = getTodayDateRange();

//     // Today's stats
//     const todayOrders = await Order.find({
//       createdAt: { $gte: today, $lt: tomorrow }
//     });

//     // All time stats
//     const allOrders = await Order.find();
    
//     // Status counts
//     const statusCounts = {
//       pending: allOrders.filter(order => order.status === 'pending').length,
//       confirmed: allOrders.filter(order => order.status === 'confirmed').length,
//       preparing: allOrders.filter(order => order.status === 'preparing').length,
//       ready: allOrders.filter(order => order.status === 'ready').length,
//       served: allOrders.filter(order => order.status === 'served').length,
//       cancelled: allOrders.filter(order => order.status === 'cancelled').length
//     };

//     const stats = {
//       today: {
//         totalOrders: todayOrders.length,
//         pendingOrders: todayOrders.filter(order => 
//           ['pending', 'confirmed', 'preparing'].includes(order.status)
//         ).length,
//         revenue: todayOrders
//           .filter(order => order.status !== 'cancelled')
//           .reduce((total, order) => total + (order.finalTotal || 0), 0)
//       },
//       allTime: {
//         totalOrders: allOrders.length,
//         totalRevenue: allOrders
//           .filter(order => order.status !== 'cancelled')
//           .reduce((total, order) => total + (order.finalTotal || 0), 0),
//         averageOrderValue: allOrders.length > 0 ? 
//           allOrders
//             .filter(order => order.status !== 'cancelled')
//             .reduce((total, order) => total + (order.finalTotal || 0), 0) / 
//           allOrders.filter(order => order.status !== 'cancelled').length : 0
//       },
//       statusCounts
//     };

//     res.json({
//       success: true,
//       data: stats
//     });

//   } catch (error) {
//     console.error('Error fetching overview stats:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message 
//     });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const { generateSessionId, parseSessionId, isSessionActive } = require('../utils/sessionHelper');

// // POST /api/orders - Create or update order session
// router.post('/', async (req, res) => {
//   try {
//     const { tableNumber, customerName, mobileNumber, items } = req.body;

//     // Generate session ID
//     const sessionId = generateSessionId(tableNumber, mobileNumber);

//     // Find existing active session
//     let orderSession = await Order.findOne({
//       sessionId: { $regex: `^SESSION-${tableNumber}-${mobileNumber}` },
//       status: 'active'
//     });

//     if (orderSession) {
//       // Check if session is still active
//       if (!isSessionActive(orderSession.sessionStartTime)) {
//         // Session expired, create new one
//         orderSession.status = 'billed';
//         await orderSession.save();
//         orderSession = null;
//       }
//     }

//     if (orderSession) {
//       // Update existing session - merge items
//       items.forEach(newItem => {
//         const existingItemIndex = orderSession.items.findIndex(
//           item => item.menuItem.toString() === newItem.menuItem
//         );

//         if (existingItemIndex > -1) {
//           // Update quantity of existing item
//           orderSession.items[existingItemIndex].quantity += newItem.quantity;
//         } else {
//           // Add new item
//           orderSession.items.push(newItem);
//         }
//       });

//       await orderSession.save();
      
//       res.json({
//         success: true,
//         data: orderSession,
//         message: 'Order added to existing session',
//         sessionType: 'existing'
//       });

//     } else {
//       // Create new session
//       const newOrder = new Order({
//         sessionId,
//         tableNumber,
//         customerName,
//         mobileNumber,
//         items
//       });

//       const savedOrder = await newOrder.save();
      
//       // Emit real-time update
//       const io = req.app.get('io');
//       io.to('reception').to('kitchen').emit('orderUpdated', savedOrder);

//       res.status(201).json({
//         success: true,
//         data: savedOrder,
//         message: 'New order session created',
//         sessionType: 'new'
//       });
//     }

//   } catch (error) {
//     console.error('Error creating/updating order:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error processing order',
//       error: error.message
//     });
//   }
// });

// // GET /api/orders/active/:tableNumber - Get active session for table
// router.get('/active/:tableNumber', async (req, res) => {
//   try {
//     const { tableNumber } = req.params;

//     const activeSessions = await Order.find({
//       tableNumber: parseInt(tableNumber),
//       status: 'active'
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: activeSessions,
//       message: `Found ${activeSessions.length} active sessions`
//     });

//   } catch (error) {
//     console.error('Error fetching active sessions:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching active sessions',
//       error: error.message
//     });
//   }
// });

// // GET /api/orders/session/:sessionId - Get specific session
// router.get('/session/:sessionId', async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const orderSession = await Order.findOne({ sessionId });

//     if (!orderSession) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order session not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: orderSession
//     });

//   } catch (error) {
//     console.error('Error fetching order session:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching order session',
//       error: error.message
//     });
//   }
// });

// // PUT /api/orders/session/:sessionId/add-item - Add item to existing session
// router.put('/session/:sessionId/add-item', async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { menuItem, name, price, quantity, isVeg } = req.body;

//     const orderSession = await Order.findOne({ sessionId, status: 'active' });

//     if (!orderSession) {
//       return res.status(404).json({
//         success: false,
//         message: 'Active order session not found'
//       });
//     }

//     // Check if item already exists
//     const existingItemIndex = orderSession.items.findIndex(
//       item => item.menuItem.toString() === menuItem
//     );

//     if (existingItemIndex > -1) {
//       // Update quantity
//       orderSession.items[existingItemIndex].quantity += quantity;
//     } else {
//       // Add new item
//       orderSession.items.push({
//         menuItem,
//         name,
//         price,
//         quantity,
//         isVeg
//       });
//     }

//     await orderSession.save();

//     // Emit real-time update
//     const io = req.app.get('io');
//     io.to('reception').to('kitchen').emit('orderUpdated', orderSession);

//     res.json({
//       success: true,
//       data: orderSession,
//       message: 'Item added to session'
//     });

//   } catch (error) {
//     console.error('Error adding item to session:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error adding item to session',
//       error: error.message
//     });
//   }
// });

// // POST /api/orders/session/:sessionId/generate-bill - Generate final bill
// router.post('/session/:sessionId/generate-bill', async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const orderSession = await Order.findOne({ sessionId, status: 'active' });

//     if (!orderSession) {
//       return res.status(404).json({
//         success: false,
//         message: 'Active order session not found'
//       });
//     }

//     if (orderSession.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot generate bill for empty order'
//       });
//     }

//     // Update status to billed
//     orderSession.status = 'billed';
//     await orderSession.save();

//     res.json({
//       success: true,
//       data: orderSession,
//       message: 'Bill generated successfully'
//     });

//   } catch (error) {
//     console.error('Error generating bill:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error generating bill',
//       error: error.message
//     });
//   }
// });

// // PUT /api/orders/session/:sessionId/update-status - Update order status
// router.put('/session/:sessionId/update-status', async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { status, kitchenStatus } = req.body;

//     const orderSession = await Order.findOne({ sessionId });

//     if (!orderSession) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order session not found'
//       });
//     }

//     const updates = {};
//     if (status) updates.status = status;
//     if (kitchenStatus) updates.kitchenStatus = kitchenStatus;

//     if (status === 'paid') {
//       updates.paymentTime = new Date();
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderSession._id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     // Emit real-time update
//     const io = req.app.get('io');
//     io.to('reception').to('kitchen').emit('orderUpdated', updatedOrder);

//     res.json({
//       success: true,
//       data: updatedOrder,
//       message: 'Order status updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error updating order status',
//       error: error.message
//     });
//   }
// });

// // GET /api/orders/table/:tableNumber - Get all orders for table (including history)
// router.get('/table/:tableNumber', async (req, res) => {
//   try {
//     const { tableNumber } = req.params;

//     const orders = await Order.find({
//       tableNumber: parseInt(tableNumber)
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: orders,
//       message: `Found ${orders.length} orders for table ${tableNumber}`
//     });

//   } catch (error) {
//     console.error('Error fetching table orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching table orders',
//       error: error.message
//     });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');

// // POST /api/orders - Create new order
// router.post('/', async (req, res) => {
//   try {
//     console.log('📦 Received order request:', req.body);

//     const { tableNumber, customerName, mobileNumber, items } = req.body;

//     // Basic validation
//     if (!tableNumber || !customerName || !mobileNumber || !items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: tableNumber, customerName, mobileNumber, items'
//       });
//     }

//     // Create new order
//     const order = new Order({
//       tableNumber: parseInt(tableNumber),
//       customerName: customerName.trim(),
//       mobileNumber: mobileNumber.trim(),
//       items: items.map(item => ({
//         menuItem: item.menuItem || `item-${Date.now()}`,
//         name: item.name,
//         price: parseFloat(item.price),
//         quantity: parseInt(item.quantity),
//         isVeg: Boolean(item.isVeg)
//       }))
//     });

//     const savedOrder = await order.save();
    
//     console.log('✅ Order created successfully:', savedOrder);

//     res.status(201).json({
//       success: true,
//       data: savedOrder,
//       message: 'Order created successfully'
//     });

//   } catch (error) {
//     console.error('❌ Error creating order:', error);
    
//     // More detailed error response
//     let errorMessage = 'Error creating order';
//     let errors = [];

//     if (error.name === 'ValidationError') {
//       errorMessage = 'Validation error';
//       errors = Object.values(error.errors).map(err => ({
//         path: err.path,
//         message: err.message
//       }));
//     }

//     res.status(400).json({
//       success: false,
//       message: errorMessage,
//       error: error.message,
//       errors: errors
//     });
//   }
// });

// // GET /api/orders - Get all orders
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: orders,
//       message: `Found ${orders.length} orders`
//     });
    
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching orders',
//       error: error.message
//     });
//   }
// });

// // GET /api/orders/active - Get active orders
// router.get('/active', async (req, res) => {
//   try {
//     const activeOrders = await Order.find({
//       status: 'active'
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: activeOrders,
//       message: `Found ${activeOrders.length} active orders`
//     });

//   } catch (error) {
//     console.error('Error fetching active orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching active orders',
//       error: error.message
//     });
//   }
// });

// // GET /api/orders/active/:tableNumber - Get active orders for table
// router.get('/active/:tableNumber', async (req, res) => {
//   try {
//     const { tableNumber } = req.params;

//     const activeOrders = await Order.find({
//       tableNumber: parseInt(tableNumber),
//       status: 'active'
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: activeOrders,
//       message: `Found ${activeOrders.length} active orders for table ${tableNumber}`
//     });

//   } catch (error) {
//     console.error('Error fetching active orders for table:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching active orders',
//       error: error.message
//     });
//   }
// });

// // PATCH /api/orders/:id/status - Update order status
// router.patch('/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const validStatuses = ['active', 'billed', 'paid', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status',
//         validStatuses: validStatuses
//       });
//     }

//     const order = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: order,
//       message: `Order status updated to ${status}`
//     });

//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating order status',
//       error: error.message
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received order request:', req.body);

    const { tableNumber, customerName, mobileNumber, items } = req.body;

    // Basic validation
    if (!tableNumber || !customerName || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tableNumber, customerName, mobileNumber'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have name, price, and quantity'
        });
      }
    }

    // Create new order
    const order = new Order({
      tableNumber: parseInt(tableNumber),
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      items: items.map(item => ({
        menuItem: item.menuItem || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        isVeg: item.isVeg !== undefined ? Boolean(item.isVeg) : true
      }))
    });

    const savedOrder = await order.save();
    
    console.log('✅ Order created successfully:', savedOrder);

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders,
      message: `Found ${orders.length} orders`
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// routes/orders.js
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const newOrder = await Order.create(orderData);
    // Emit socket event for real-time updates
    req.app.get('io').emit('order-status-updated', order);
    
// In your backend order status update endpoint  
const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
// Emit socket event
req.app.get('io').emit('order-status-updated', updatedOrder);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});




// GET /api/orders/active - Get active orders
router.get('/active', async (req, res) => {
  try {
    const activeOrders = await Order.find({
      status: 'active'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activeOrders,
      message: `Found ${activeOrders.length} active orders`
    });

  } catch (error) {
    console.error('Error fetching active orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active orders',
      error: error.message
    });
  }
});

module.exports = router;