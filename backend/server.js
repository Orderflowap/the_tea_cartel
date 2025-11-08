const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Add this with your other routes in server.js
// app.use('/api/init', require('./routes/init'));
// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_ordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Ordering API is running!' });
});

// Routes
app.use('/api/menu', require('./routes/menu'));

app.use('/api/init', require('./routes/init')); // ADD THIS LINE


app.use('/api/tables', require('./routes/tables'));
// app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

// Socket.io for real-time notifications
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-reception', () => {
    socket.join('reception');
    console.log('Reception joined real-time updates');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});