



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const combinedBillsRouter = require('./routes/combinedBills');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ FIXED: Simplified CORS configuration
app.use(cors({
  origin: [
    'https://dapper-muffin-326944.netlify.app',
    // 'https://orderflow-frontend.onrender.com',
    'https://the-tea-cartel-1.onrender.com',
    'http://localhost:3000', 
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ FIXED: Handle preflight requests
app.options('*', cors());

// ✅ FIXED: Body parsing middleware - SIMPLIFIED VERSION
app.use(express.json({ 
  limit: '10mb'
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// ✅ FIXED: Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  if (req.method === 'POST' && req.path === '/api/orders') {
    console.log('📦 Order request headers:', req.headers);
    console.log('📦 Order request body:', req.body);
    console.log('📦 Content-Type:', req.headers['content-type']);
    console.log('📦 Raw body available:', !!req.body);
  }
  
  next();
});

// Enhanced Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: [
      "https://dapper-muffin-326944.netlify.app",
      // "https://orderflow-frontend.onrender.com",
      'https://the-tea-cartel-1.onrender.com',
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io accessible to routes
app.set('io', io);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_ordering';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});
db.on('connected', () => {
  console.log('📊 MongoDB connection established');
});
db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/api/combined-bills', combinedBillsRouter);

// Routes
app.use('/api/upload', require('./routes/upload'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/init', require('./routes/init'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Ordering API is running!',
    version: '1.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      orders: '/api/orders',
      menu: '/api/menu',
      tables: '/api/tables',
      inventory: '/api/inventory'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ FIXED: Test endpoint to check body parsing
app.post('/api/test-body', (req, res) => {
  console.log('🧪 Test endpoint called');
  console.log('📨 Headers:', req.headers);
  console.log('📨 Body:', req.body);
  console.log('📨 Body type:', typeof req.body);
  console.log('📨 Body keys:', Object.keys(req.body));
  
  res.json({
    success: true,
    message: 'Body received successfully',
    receivedBody: req.body,
    bodyType: typeof req.body,
    bodyKeys: Object.keys(req.body),
    headers: req.headers
  });
});

// ✅ FIXED: Add a simple test order endpoint
app.post('/api/test-order', (req, res) => {
  try {
    console.log('🧪 Test order endpoint called');
    console.log('📦 Request body:', req.body);
    
    const { tableNumber, customerName, mobileNumber, items } = req.body;
    
    // Basic validation
    if (!tableNumber || !customerName || !mobileNumber || !items) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['tableNumber', 'customerName', 'mobileNumber', 'items'],
        received: Object.keys(req.body)
      });
    }
    
    res.json({
      success: true,
      message: 'Test order received successfully',
      orderData: req.body,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in test endpoint',
      error: error.message
    });
  }
});

// Enhanced Socket.io for real-time notifications
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.emit('connected', { 
    message: 'Connected to server successfully',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // Reception dashboard joins
  socket.on('join-reception', () => {
    socket.join('reception');
    console.log('📋 Reception dashboard joined:', socket.id);
    
    socket.emit('reception-joined', { 
      message: 'Connected to real-time updates',
      room: 'reception',
      socketId: socket.id
    });
  });

  // Kitchen display joins
  socket.on('join-kitchen', () => {
    socket.join('kitchen');
    console.log('👨‍🍳 Kitchen display joined:', socket.id);
    
    socket.emit('kitchen-joined', {
      message: 'Connected to kitchen updates',
      room: 'kitchen',
      socketId: socket.id
    });
  });

  // Handle order status updates
  socket.on('update-order-status', async (data) => {
    try {
      console.log('🔄 Order status update via socket:', data);
      
      const { orderId, status } = data;
      
      if (!orderId || !status) {
        socket.emit('update-error', { 
          message: 'Missing orderId or status',
          data 
        });
        return;
      }

      const Order = require('./models/Order');
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          status, 
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      );
      
      if (!order) {
        socket.emit('update-error', { 
          message: `Order not found with ID: ${orderId}`,
          orderId 
        });
        return;
      }

      console.log(`✅ Order status updated via socket: ${order.orderNumber} -> ${status}`);

      const updateData = {
        ...order.toObject(),
        socketId: socket.id,
        updateType: 'status',
        timestamp: new Date().toISOString()
      };

      io.emit('order-status-updated', updateData);
      io.emit('order-updated', updateData);
      io.emit('order-change', updateData);
      
      io.to('reception').emit('order-status-updated', updateData);
      io.to('kitchen').emit('order-status-updated', updateData);

      socket.emit('order-update-success', { 
        orderId, 
        status,
        orderNumber: order.orderNumber,
        message: 'Order status updated successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error updating order status via socket:', error);
      socket.emit('update-error', { 
        message: 'Error updating order status',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Server running on port ${PORT}
📍 Host: 0.0.0.0
📊 API URL: http://localhost:${PORT}
🔌 Socket.io: ws://localhost:${PORT}
📈 Health check: http://localhost:${PORT}/health
🧪 Test endpoints:
   - POST http://localhost:${PORT}/api/test-body
   - POST http://localhost:${PORT}/api/test-order
🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  
  io.close(() => {
    console.log('✅ Socket.io server closed.');
  });
  
  server.close(() => {
    console.log('✅ HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };