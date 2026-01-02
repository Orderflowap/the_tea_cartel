

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import './ReceptionDashboard.css'

// const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'
// const API_BASE_URL = 'http://localhost:5000/api'

const API_BASE_URL = 'https://the-tea-cartel-1.onrender.com/api';
const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
}

const ReceptionDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [newOrder, setNewOrder] = useState(null)
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false)
  const notificationTimeoutRef = useRef(null)
  const audioRef = useRef(null)
  const [updatingOrders, setUpdatingOrders] = useState(new Set())
  const socketRef = useRef(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Dashboard State
  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Add reconnection state
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const maxReconnectAttempts = 5

  // Audio permission and notification sound
  useEffect(() => {
    if (isAuthenticated) {
      const handleUserInteraction = async () => {
        try {
          if (audioRef.current) {
            await audioRef.current.play()
            audioRef.current.pause()
            setAudioPermissionGranted(true)
            document.removeEventListener('click', handleUserInteraction)
          }
        } catch (error) {
          console.log('🔇 Audio permission not yet granted...')
        }
      }

      document.addEventListener('click', handleUserInteraction)
      
      return () => {
        document.removeEventListener('click', handleUserInteraction)
      }
    }
  }, [isAuthenticated])

  const playNotificationSound = async () => {
    if (!audioRef.current) return
    
    try {
      audioRef.current.currentTime = 0
      await audioRef.current.play()
    } catch (error) {
      console.log('🔇 Could not play sound:', error)
      // Fallback sound
      createFallbackSound()
    }
  }

  // Fallback sound function
  const createFallbackSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      return true;
    } catch (error) {
      console.log('🔇 Fallback sound failed:', error);
      return false;
    }
  };

  // Initialize default tables (1-10)
  const initializeTables = () => {
    const defaultTables = Array.from({ length: 10 }, (_, i) => ({
      tableNumber: i + 1,
      status: 'available',
      capacity: 4,
      currentOrder: null
    }))
    setTables(defaultTables)
    console.log('📋 Initialized default tables:', defaultTables.length)
  }

  const setupSocketConnection = () => {
    try {
      console.log('🔌 Setting up socket connection...');
      
      if (socketRef.current) {
        console.log('♻️ Closing existing socket connection...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Use wss:// for secure WebSocket on Render
      // const socketUrl = 'wss://orderflow-backend-v964.onrender.com';
      const socketUrl = 'https://the-tea-cartel-1.onrender.com';

      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true
      });
      
      socketRef.current = socket;
      

      // ===== ADD THESE DEBUG LISTENERS =====

// 1. Connection status
socket.on('connect', () => {
  console.log('✅ SOCKET.IO CONNECTED - ID:', socket.id);
  console.log('📡 Connected to:', socketUrl);
});

socket.on('connect_error', (error) => {
  console.error('❌ SOCKET.IO CONNECT ERROR:', error.message);
  console.error('Error type:', error.type);
  console.error('Error description:', error.description);
  console.error('Full error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 SOCKET.IO DISCONNECTED - Reason:', reason);
});

// 2. Check if you receive the initial 'connected' event from server
socket.on('connected', (data) => {
  console.log('🎯 Server connection confirmed:', data);
});

// 3. Listen for all events (debug)
socket.onAny((eventName, ...args) => {
  console.log(`📨 Received event: "${eventName}"`, args);
});

// 4. Emit a test event to verify two-way communication
socket.emit('test-connection', {
  message: 'Testing from frontend',
  timestamp: new Date().toISOString(),
  url: window.location.href
});

// 5. Join the reception room (if your app needs it)
socket.emit('join-reception');


      // Connection events
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
        setSocketConnected(true);
        setReconnectAttempts(0);
        
        // Join reception room immediately after connection
        socket.emit('join-reception');
        
        // Test connection
        socket.emit('test-connection', {
          clientTime: Date.now(),
          dashboard: 'reception'
        });
      });

      socket.on('connected', (data) => {
        console.log('✅ Server connection confirmed:', data);
      });

      socket.on('reception-joined', (data) => {
        console.log('✅ Joined reception room:', data);
      });

      // Real-time order events
      socket.on('new-order', (newOrder) => {
        console.log('🆕 New order via socket:', newOrder);
        handleNewOrder(newOrder);
      });

      socket.on('order-status-updated', (updatedOrder) => {
        console.log('🔄 Order status updated via socket:', updatedOrder);
        handleOrderUpdate(updatedOrder);
      });

      // Connection management events
      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setSocketConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
      });

    } catch (error) {
      console.error('❌ Socket initialization error:', error);
      setSocketConnected(false);
    }
  };

  // Helper functions for socket events
  const handleNewOrder = (newOrder) => {
    setOrders(prev => {
      const orderExists = prev.some(order => order._id === newOrder._id);
      if (orderExists) {
        console.log('📝 Order already exists, updating...');
        return prev.map(order => 
          order._id === newOrder._id ? { ...newOrder, updatedAt: new Date().toISOString() } : order
        );
      }
      
      console.log('📥 Adding new order to list');
      const updatedOrders = [newOrder, ...prev];
      calculateStatsFromOrders(updatedOrders);
      updateTableOrder(newOrder.tableNumber, newOrder);
      return updatedOrders;
    });
    
    setNewOrder(newOrder);
    setShowNotification(true);
    playNotificationSound();
    
    // Auto-hide notification
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      setNewOrder(null);
    }, 5000);
  };

 

  const handleOrderUpdate = (updatedOrder) => {
  console.log('🔄 Handling order update for stats:', updatedOrder.orderNumber, 'status:', updatedOrder.status);
  
  setOrders(prev => {
    const updatedOrders = prev.map(order => 
      order._id === updatedOrder._id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : order
    );
    
    // ALWAYS recalculate stats after order update
    calculateStatsFromOrders(updatedOrders);
    
    // Update table status based on order status
    if (updatedOrder.status === 'paid' || updatedOrder.status === 'cancelled') {
      updateTableOrder(updatedOrder.tableNumber, null);
    } else {
      updateTableOrder(updatedOrder.tableNumber, updatedOrder);
    }
    
    return updatedOrders;
  });
};
  const handleOrderDeletion = (deletionData) => {
    setOrders(prev => {
      const updatedOrders = prev.filter(order => order._id !== deletionData.orderId);
      calculateStatsFromOrders(updatedOrders);
      
      if (deletionData.tableNumber) {
        updateTableOrder(deletionData.tableNumber, null);
      }
      
      return updatedOrders;
    });
  };

// Debug function to check order data
const debugOrderData = (order) => {
  console.log('🔍 DEBUG Order Data:', order.orderNumber);
  console.log('   Items:', order.items);
  
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      console.log(`   Item ${index + 1}:`);
      console.log(`     Name: ${item.name}`);
      console.log(`     Price: ${item.price}`);
      console.log(`     Quantity: ${item.quantity}`);
      console.log(`     Extra Cheese: ${item.extraCheese}`);
      console.log(`     Extra Cheese Price: ${item.extraCheesePrice}`);
      console.log(`     Item Total: ${item.itemTotal}`);
      
      // Calculate expected total
      const baseTotal = (item.price || 0) * (item.quantity || 1);
      const extraCheese = item.extraCheesePrice || 0;
      const expectedTotal = baseTotal + extraCheese;
      console.log(`     Expected Total: ${expectedTotal}`);
    });
  }
  
  console.log('   Order Total Amount:', order.totalAmount);
  console.log('   Order Final Total:', order.finalTotal);
  console.log('   Order Extra Cheese Total:', order.extraCheeseTotal);
}

// Test function to check backend data structure
const testBackendDataStructure = async () => {
  try {
    const testOrder = {
      tableNumber: 99,
      customerName: "Test Customer",
      mobileNumber: "9999999999",
      items: [{
        menuItem: "test-pizza-1",
        name: "Test Pizza (Extra Cheese)",
        price: 100,
        quantity: 1,
        isVeg: true,
        extraCheese: true,
        extraCheesePrice: 45,
        itemTotal: 145
      }],
      extraCheeseTotal: 45,
      totalAmount: 145
    };
    
    console.log('🧪 Testing backend with extra cheese order:', testOrder);
    
    const response = await axios.post(`${API_BASE_URL}/orders`, testOrder);
    console.log('✅ Backend response:', response.data);
    
    // Check if the saved order has extra cheese data
    if (response.data._id) {
      const savedOrder = await axios.get(`${API_BASE_URL}/orders/${response.data._id}`);
      console.log('📋 Saved order data:', savedOrder.data);
      console.log('🔍 Extra cheese fields check:');
      console.log('   Has extraCheeseTotal:', savedOrder.data.extraCheeseTotal);
      console.log('   Item extraCheese:', savedOrder.data.items?.[0]?.extraCheese);
      console.log('   Item extraCheesePrice:', savedOrder.data.items?.[0]?.extraCheesePrice);
      console.log('   Item itemTotal:', savedOrder.data.items?.[0]?.itemTotal);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.response?.data) {
      console.error('Backend error:', error.response.data);
    }
  }
}

// Update fetchOrders to include debugging
const fetchOrders = async () => {
  try {
    console.log('🔄 FETCHING ORDERS...')
    setLoading(true)
    setError('')
    
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      timeout: 10000
    })
    
    let ordersData = []
    
    if (Array.isArray(response.data)) {
      ordersData = response.data
    } else if (response.data.orders && Array.isArray(response.data.orders)) {
      ordersData = response.data.orders
    } else if (response.data.data && Array.isArray(response.data.data)) {
      ordersData = response.data.data
    } else {
      const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val))
      if (possibleArrays.length > 0) {
        ordersData = possibleArrays[0]
      }
    }
    
    // Sort by latest first
    ordersData.sort((a, b) => new Date(b.createdAt || b.orderTime) - new Date(a.createdAt || a.orderTime))
    
    console.log(`🎯 Loaded ${ordersData.length} orders`)
    
    // Debug each order
    ordersData.forEach(debugOrderData);
    
    setOrders(ordersData)
    calculateStatsFromOrders(ordersData)
    initializeTableOrders(ordersData)
    
  } catch (error) {
    console.error('❌ ERROR FETCHING ORDERS:', error)
    setError(`Failed to load orders: ${error.message}`)
    
    // If socket is connected, we can still function with real-time updates
    if (!socketConnected) {
      setOrders([])
    }
  } finally {
    setLoading(false)
  }
}
  
  // Enhanced fetch orders with better error handling
  // const fetchOrders = async () => {
  //   try {
  //     console.log('🔄 FETCHING ORDERS...')
  //     setLoading(true)
  //     setError('')
      
  //     const response = await axios.get(`${API_BASE_URL}/orders`, {
  //       timeout: 10000
  //     })
      
  //     let ordersData = []
      
  //     if (Array.isArray(response.data)) {
  //       ordersData = response.data
  //     } else if (response.data.orders && Array.isArray(response.data.orders)) {
  //       ordersData = response.data.orders
  //     } else if (response.data.data && Array.isArray(response.data.data)) {
  //       ordersData = response.data.data
  //     } else {
  //       const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val))
  //       if (possibleArrays.length > 0) {
  //         ordersData = possibleArrays[0]
  //       }
  //     }
      
  //     // Sort by latest first
  //     ordersData.sort((a, b) => new Date(b.createdAt || b.orderTime) - new Date(a.createdAt || a.orderTime))
      
  //     console.log(`🎯 Loaded ${ordersData.length} orders`)
      
  //     setOrders(ordersData)
  //     calculateStatsFromOrders(ordersData)
  //     initializeTableOrders(ordersData)
      
  //   } catch (error) {
  //     console.error('❌ ERROR FETCHING ORDERS:', error)
  //     setError(`Failed to load orders: ${error.message}`)
      
  //     // If socket is connected, we can still function with real-time updates
  //     if (!socketConnected) {
  //       setOrders([])
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Initialize table orders from fetched data
  const initializeTableOrders = (ordersData) => {
    const activeTables = {}
    
    ordersData.forEach(order => {
      // FIXED: Only exclude cancelled orders, keep paid orders visible
      if (order.status !== 'cancelled') {
        // Only mark table as occupied for non-paid orders
        if (order.status !== 'paid') {
          activeTables[order.tableNumber] = order
        }
      }
    })
    
    // Initialize tables first if not already initialized
    if (tables.length === 0) {
      initializeTables()
    }
    
    setTables(prev => prev.map(table => ({
      ...table,
      currentOrder: activeTables[table.tableNumber] || null,
      status: activeTables[table.tableNumber] ? 'occupied' : 'available'
    })))
  }

  // Update table order status
  const updateTableOrder = (tableNumber, order) => {
    const newStatus = order ? 'occupied' : 'available'
    
    setTables(prev => prev.map(table => 
      table.tableNumber === tableNumber 
        ? { ...table, currentOrder: order, status: newStatus }
        : table
    ))
  }

  
  // FIXED: Enhanced stats calculation with proper revenue calculation
// const calculateStatsFromOrders = (ordersData) => {
//   try {
//     console.log('📊 Calculating stats from orders:', ordersData.length);
    
//     const totalOrders = ordersData.length;
    
//     // FIXED: Include served orders in pending count
//     const pendingOrders = ordersData.filter(order => 
//       ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
//     ).length;
    
//     // FIXED: Enhanced revenue calculation with better parsing
//     const totalRevenue = ordersData
//       .filter(order => order.status === 'paid')
//       .reduce((total, order) => {
//         console.log('💰 Processing paid order:', order.orderNumber, 'status:', order.status);
        
//         let orderAmount = 0;
        
//         // Try to get amount from multiple possible fields
//         if (order.finalTotal !== undefined && order.finalTotal !== null) {
//           orderAmount = parseFloat(order.finalTotal);
//         } else if (order.totalAmount !== undefined && order.totalAmount !== null) {
//           orderAmount = parseFloat(order.totalAmount);
//         } else if (order.total !== undefined && order.total !== null) {
//           orderAmount = parseFloat(order.total);
//         }
        
//         // If parsing failed, try to calculate from items
//         if (isNaN(orderAmount) || orderAmount === 0) {
//           if (order.items && Array.isArray(order.items)) {
//             const itemsTotal = order.items.reduce((sum, item) => {
//               const itemPrice = parseFloat(item.price) || 0;
//               const itemQuantity = parseInt(item.quantity) || 1;
//               return sum + (itemPrice * itemQuantity);
//             }, 0);
            
//             // Add tax if available
//             // const tax = parseFloat(order.taxAmount) || 0;
//             orderAmount = itemsTotal;
//           }
//         }
        
//         // Ensure orderAmount is a valid number
//         orderAmount = isNaN(orderAmount) ? 0 : orderAmount;
        
//         console.log(`💰 Order ${order.orderNumber}: Amount = ${orderAmount}`);
//         return total + orderAmount;
//       }, 0);

//     console.log(`📊 Stats Calculated - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`);
    
//     // Log paid orders for debugging
//     const paidOrders = ordersData.filter(order => order.status === 'paid');
//     console.log('💰 Paid orders count:', paidOrders.length);
//     paidOrders.forEach(order => {
//       console.log(`   - ${order.orderNumber}: ${order.finalTotal || order.totalAmount || order.total}`);
//     });
    
//     setStats({ totalOrders, pendingOrders, totalRevenue });
//   } catch (error) {
//     console.error('❌ Error calculating stats:', error);
//   }
// };

// FIXED: Enhanced stats calculation with proper revenue calculation including extra cheese
const calculateStatsFromOrders = (ordersData) => {
  try {
    console.log('📊 Calculating stats from orders:', ordersData.length);
    
    const totalOrders = ordersData.length;
    
    // FIXED: Include served orders in pending count
    const pendingOrders = ordersData.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
    ).length;
    
    // FIXED: Enhanced revenue calculation including extra cheese
    const totalRevenue = ordersData
      .filter(order => order.status === 'paid')
      .reduce((total, order) => {
        console.log('💰 Processing paid order:', order.orderNumber, 'status:', order.status);
        
        let orderAmount = 0;
        
        // Try to get amount from multiple possible fields, prioritizing finalTotal
        if (order.finalTotal !== undefined && order.finalTotal !== null) {
          orderAmount = parseFloat(order.finalTotal);
        } else if (order.totalAmount !== undefined && order.totalAmount !== null) {
          orderAmount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
          orderAmount = parseFloat(order.total);
        }
        
        // If parsing failed, try to calculate from items including extra cheese
        if (isNaN(orderAmount) || orderAmount === 0) {
          if (order.items && Array.isArray(order.items)) {
            const itemsTotal = order.items.reduce((sum, item) => {
              const itemPrice = parseFloat(item.price) || 0;
              const itemQuantity = parseInt(item.quantity) || 1;
              const itemExtraCheesePrice = parseFloat(item.extraCheesePrice) || 0;
              return sum + (itemPrice * itemQuantity) + itemExtraCheesePrice;
            }, 0);
            
            orderAmount = itemsTotal;
          }
        }
        
        // Also check for extraCheeseTotal field
        if (order.extraCheeseTotal && parseFloat(order.extraCheeseTotal) > 0) {
          console.log(`🧀 Order ${order.orderNumber} has extra cheese total: ${order.extraCheeseTotal}`);
        }
        
        // Ensure orderAmount is a valid number
        orderAmount = isNaN(orderAmount) ? 0 : orderAmount;
        
        console.log(`💰 Order ${order.orderNumber}: Amount = ${orderAmount}`);
        return total + orderAmount;
      }, 0);

    console.log(`📊 Stats Calculated - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`);
    
    // Log paid orders for debugging
    const paidOrders = ordersData.filter(order => order.status === 'paid');
    console.log('💰 Paid orders count:', paidOrders.length);
    paidOrders.forEach(order => {
      console.log(`   - ${order.orderNumber}: ${order.finalTotal || order.totalAmount || order.total || '0'} (Extra Cheese: ${order.extraCheeseTotal || '0'})`);
    });
    
    setStats({ totalOrders, pendingOrders, totalRevenue });
  } catch (error) {
    console.error('❌ Error calculating stats:', error);
  }
};


  const updateOrderStatus = async (orderNumber, newStatus) => {
  try {
    console.log('🔄 Updating order status:', { orderNumber, newStatus });
    
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
      alert('Order not found in local data.');
      return;
    }

    // Create updated order object
    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    // Update local state immediately
    setOrders(prev => {
      const updatedOrders = prev.map(o => 
        o.orderNumber === orderNumber ? updatedOrder : o
      );
      
      // Recalculate stats immediately
      calculateStatsFromOrders(updatedOrders);
      return updatedOrders;
    });

    // Send update to backend
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('update-order-status', {
        orderId: order._id,
        status: newStatus
      });
    }

    // Update backend
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${order._id}/status`, {
        status: newStatus
      }, { timeout: 5000 });
      console.log('✅ Backend update successful:', response.data);
      
      // Refresh orders from server to ensure consistency
      fetchOrders();
      
    } catch (error) {
      console.warn('⚠️ Backend update failed:', error.message);
    }

    // Update table status
    if (newStatus === 'paid' || newStatus === 'cancelled') {
      updateTableOrder(order.tableNumber, null);
    }

    console.log('✅ Order status updated successfully');

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    alert('Failed to update order status: ' + error.message);
  }
};

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // In your ReceptionDashboard.jsx - Update generateCombinedBill function
const generateCombinedBill = async (tableNumber) => {
  try {
    console.log('🧾 Generating combined bill for table:', tableNumber)
    
    // FIXED: Only include orders that are NOT paid for combined billing
    const tableOrders = orders.filter(order => 
      order.tableNumber === tableNumber && 
      order.status !== 'cancelled' && 
      order.status !== 'paid'
    )

    if (tableOrders.length === 0) {
      alert(`No active (unpaid) orders found for Table ${tableNumber}`)
      return
    }

    // Combine all items
    const combinedItems = []
    let totalAmount = 0
    let customerName = ''
    let mobileNumber = ''

    tableOrders.forEach(order => {
      if (!customerName && order.customerName) {
        customerName = order.customerName
        mobileNumber = order.mobileNumber
      }

      order.items?.forEach(item => {
        const itemName = item.name || item.menuItem?.name || 'Item'
        const itemPrice = item.price || 0
        const itemQuantity = item.quantity || 1
        
        const existingItem = combinedItems.find(combinedItem => 
          combinedItem.name === itemName && combinedItem.price === itemPrice
        )

        if (existingItem) {
          existingItem.quantity += itemQuantity
        } else {
          combinedItems.push({
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            isVeg: item.isVeg
          })
        }
      })

      totalAmount += order.totalAmount || order.finalTotal || 0
    })

    const taxAmount = totalAmount * 0.05
    const finalTotal = totalAmount
    const combinedBillNumber = `CB-${tableNumber}-${Date.now()}`

    // Create combined order object
    const combinedOrder = {
      orderNumber: combinedBillNumber,
      tableNumber: tableNumber,
      customerName: customerName || 'Walk-in Customer',
      mobileNumber: mobileNumber || 'N/A',
      items: combinedItems,
      totalAmount: totalAmount,
      taxAmount: taxAmount,
      finalTotal: finalTotal,
      createdAt: new Date().toISOString(),
      isCombinedBill: true,
      originalOrders: tableOrders.map(order => order.orderNumber)
    }

    console.log('📊 Combined bill details:', combinedOrder)

    // 1. Save combined bill to database
    try {
      const saveResponse = await axios.post(`${API_BASE_URL}/combined-bills`, {
        combinedBillNumber,
        tableNumber,
        customerName: customerName || 'Walk-in Customer',
        mobileNumber: mobileNumber || 'N/A',
        items: combinedItems,
        totalAmount,
        taxAmount,
        finalTotal,
        originalOrders: tableOrders.map(order => ({
          orderNumber: order.orderNumber,
          orderId: order._id
        })),
        generatedBy: 'Reception Dashboard',
        paymentMethod: 'combined'
      })
      
      console.log('✅ Combined bill saved:', saveResponse.data)
    } catch (error) {
      console.error('❌ Error saving combined bill:', error)
      // Continue even if saving fails
    }

    // 2. Print combined bill
    printThermalBill(combinedOrder)

    // 3. Mark all original orders as PAID after printing bill
    tableOrders.forEach(order => {
      updateOrderStatus(order.orderNumber, 'paid')
    })

    // 4. Show success message
    alert(`Combined bill generated for Table ${tableNumber}! All orders marked as paid. Bill saved for admin records.`)

  } catch (error) {
    console.error('❌ Error generating combined bill:', error)
    alert('Error generating combined bill: ' + error.message)
  }
}
  // FIXED: Print bill and mark as PAID
  const printBillAndClearTable = async (order) => {
    try {
      console.log('🧾 Printing bill and clearing table:', order.tableNumber)
      
      // Print the bill first
      await printThermalBill(order)
      
      // FIXED: Update order status to PAID (not served) to remove from list
      await updateOrderStatus(order.orderNumber, 'paid')
      
      // Show success message
      alert(`Bill printed for Table ${order.tableNumber}. Order marked as paid.`)
      
    } catch (error) {
      console.error('❌ Error in bill printing process:', error)
      alert('Error printing bill: ' + error.message)
    }
  }

  // Thermal bill printing function
  // const printThermalBill = (order) => {
  //   try {
  //     const printWindow = window.open('', '_blank', 'width=320,height=600,scrollbars=no,toolbar=no,location=no')
      
  //     printWindow.document.write(`
  //       <!DOCTYPE html>
  //       <html>
  //       <head>
  //         <title>Bill - ${order.orderNumber}</title>
  //         <style>
  //           @media print {
  //             body { 
  //               margin: 0; 
  //               padding: 0; 
  //               font-family: 'Courier New', monospace;
  //               font-size: 12px;
  //               width: 80mm;
  //               background: white;
  //             }
  //             .no-print { display: none !important; }
  //           }
  //           @media screen {
  //             body { 
  //               font-family: 'Courier New', monospace;
  //               font-size: 14px;
  //               padding: 20px;
  //               background: #f5f5f5;
  //             }
  //             .bill-container {
  //               background: white;
  //               padding: 20px;
  //               border-radius: 8px;
  //               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  //               max-width: 300px;
  //               margin: 0 auto;
  //             }
  //           }
  //           .bill-header {
  //             text-align: center;
  //             border-bottom: 2px dashed #000;
  //             padding-bottom: 10px;
  //             margin-bottom: 10px;
  //           }
  //           .restaurant-name {
  //             font-weight: bold;
  //             font-size: 18px;
  //             margin: 5px 0;
  //           }
  //           .bill-info {
  //             margin: 10px 0;
  //           }
  //           .bill-info div {
  //             margin: 3px 0;
  //           }
  //           .items-table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin: 10px 0;
  //           }
  //           .items-table th {
  //             text-align: left;
  //             border-bottom: 1px dashed #000;
  //             padding: 5px 0;
  //           }
  //           .items-table td {
  //             padding: 3px 0;
  //             border-bottom: 1px dotted #ccc;
  //           }
  //           .total-section {
  //             border-top: 2px dashed #000;
  //             margin-top: 10px;
  //             padding-top: 10px;
  //           }
  //           .total-row {
  //             display: flex;
  //             justify-content: space-between;
  //             margin: 5px 0;
  //           }
  //           .final-total {
  //             font-weight: bold;
  //             font-size: 16px;
  //           }
  //           .footer {
  //             text-align: center;
  //             margin-top: 20px;
  //             font-style: italic;
  //             border-top: 1px dashed #000;
  //             padding-top: 10px;
  //           }
  //           .print-btn {
  //             background: #007bff;
  //             color: white;
  //             border: none;
  //             padding: 10px 20px;
  //             border-radius: 5px;
  //             cursor: pointer;
  //             margin: 10px 5px;
  //           }
  //           .close-btn {
  //             background: #6c757d;
  //             color: white;
  //             border: none;
  //             padding: 10px 20px;
  //             border-radius: 5px;
  //             cursor: pointer;
  //             margin: 10px 5px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="bill-container">
  //           <div class="bill-header">
  //             <div class="restaurant-name">The Chai Cartel</div>
  //             <div>-----------</div>
  //           </div>
            
  //           <div class="bill-info">
  //             <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
  //             <div><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
  //             <div><strong>Table:</strong> ${order.tableNumber}</div>
  //             <div><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</div>
  //             ${order.mobileNumber ? `<div><strong>Mobile:</strong> ${order.mobileNumber}</div>` : ''}
  //           </div>
            
  //           <table class="items-table">
  //             <thead>
  //               <tr>
  //                 <th>Qty</th>
  //                 <th>Item</th>
  //                 <th>Amount</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${order.items?.map(item => {
  //                 const itemName = item.name || item.menuItem?.name || 'Item'
  //                 const quantity = item.quantity || 1
  //                 const price = item.price || 0
  //                 const total = price * quantity
  //                 return `
  //                   <tr>
  //                     <td>${quantity}</td>
  //                     <td>${itemName}</td>
  //                     <td>₹${total}</td>
  //                   </tr>
  //                   <tr>
  //                     <td></td>
  //                     <td colspan="2" style="font-size: 10px; color: #666;">₹${price} x ${quantity}</td>
  //                   </tr>
  //                 `
  //               }).join('')}
  //             </tbody>
  //           </table>
            
  //           <div class="total-section">
  //             <div class="total-row">
  //               <span>Subtotal:</span>
  //               <span>₹${(order.totalAmount || 0).toFixed(2)}</span>
  //             </div>
              
  //             <div class="total-row final-total">
  //               <span>TOTAL:</span>
  //               <span>₹${(order.finalTotal || order.totalAmount || 0).toFixed(2)}</span>
  //             </div>
  //           </div>
            
  //           <div class="footer">
  //             <div>Thank you for visiting!</div>
  //             <div>We hope to see you again soon</div>
  //           </div>
            
  //           <div class="no-print" style="text-align: center; margin-top: 20px;">
  //             <button class="print-btn" onclick="window.print()">🖨 Print Bill</button>
  //             <button class="close-btn" onclick="window.close()">Close</button>
  //           </div>
  //         </div>
  //       </body>
  //       </html>
  //     `)
      
  //     printWindow.document.close()
      
  //   } catch (error) {
  //     console.error('❌ Error printing bill:', error)
  //     alert('Error opening print window: ' + error.message)
  //   }
  // }

  // Thermal bill printing function
// const printThermalBill = (order) => {
//   try {
//     const printWindow = window.open('', '_blank', 'width=320,height=600,scrollbars=no,toolbar=no,location=no')
    
//     // Calculate totals including extra cheese
//     let subtotal = 0;
//     let extraCheeseTotal = 0;
    
//     // Calculate item totals including extra cheese
//     const itemsWithTotals = order.items?.map(item => {
//       const itemName = item.name || item.menuItem?.name || 'Item'
//       const quantity = item.quantity || 1
//       const price = item.price || 0
//       const extraCheesePrice = item.extraCheesePrice || 0
//       const itemTotal = (price * quantity) + extraCheesePrice
      
//       subtotal += price * quantity;
//       extraCheeseTotal += extraCheesePrice;
      
//       return {
//         name: itemName,
//         quantity,
//         price,
//         extraCheesePrice,
//         itemTotal,
//         hasExtraCheese: item.extraCheese || false
//       }
//     }) || [];
    
//     const totalAmount = subtotal + extraCheeseTotal;
//     const finalTotal = totalAmount;
    
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Bill - ${order.orderNumber}</title>
//         <style>
//           @media print {
//             body { 
//               margin: 0; 
//               padding: 0; 
//               font-family: 'Courier New', monospace;
//               font-size: 12px;
//               width: 80mm;
//               background: white;
//             }
//             .no-print { display: none !important; }
//           }
//           @media screen {
//             body { 
//               font-family: 'Courier New', monospace;
//               font-size: 14px;
//               padding: 20px;
//               background: #f5f5f5;
//             }
//             .bill-container {
//               background: white;
//               padding: 20px;
//               border-radius: 8px;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//               max-width: 300px;
//               margin: 0 auto;
//             }
//           }
//           .bill-header {
//             text-align: center;
//             border-bottom: 2px dashed #000;
//             padding-bottom: 10px;
//             margin-bottom: 10px;
//           }
//           .restaurant-name {
//             font-weight: bold;
//             font-size: 18px;
//             margin: 5px 0;
//           }
//           .bill-info {
//             margin: 10px 0;
//           }
//           .bill-info div {
//             margin: 3px 0;
//           }
//           .items-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//           }
//           .items-table th {
//             text-align: left;
//             border-bottom: 1px dashed #000;
//             padding: 5px 0;
//           }
//           .items-table td {
//             padding: 3px 0;
//             border-bottom: 1px dotted #ccc;
//           }
//           .extra-cheese-row {
//             color: #27ae60;
//             font-size: 11px;
//           }
//           .total-section {
//             border-top: 2px dashed #000;
//             margin-top: 10px;
//             padding-top: 10px;
//           }
//           .total-row {
//             display: flex;
//             justify-content: space-between;
//             margin: 5px 0;
//           }
//           .final-total {
//             font-weight: bold;
//             font-size: 16px;
//           }
//           .footer {
//             text-align: center;
//             margin-top: 20px;
//             font-style: italic;
//             border-top: 1px dashed #000;
//             padding-top: 10px;
//           }
//           .print-btn {
//             background: #007bff;
//             color: white;
//             border: none;
//             padding: 10px 20px;
//             border-radius: 5px;
//             cursor: pointer;
//             margin: 10px 5px;
//           }
//           .close-btn {
//             background: #6c757d;
//             color: white;
//             border: none;
//             padding: 10px 20px;
//             border-radius: 5px;
//             cursor: pointer;
//             margin: 10px 5px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="bill-container">
//           <div class="bill-header">
//             <div class="restaurant-name">The Chai Cartel</div>
//             <div>-----------</div>
//           </div>
          
//           <div class="bill-info">
//             <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
//             <div><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
//             <div><strong>Table:</strong> ${order.tableNumber}</div>
//             <div><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</div>
//             ${order.mobileNumber ? `<div><strong>Mobile:</strong> ${order.mobileNumber}</div>` : ''}
//           </div>
          
//           <table class="items-table">
//             <thead>
//               <tr>
//                 <th>Qty</th>
//                 <th>Item</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${itemsWithTotals.map(item => {
//                 return `
//                   <tr>
//                     <td>${item.quantity}</td>
//                     <td>${item.name}${item.hasExtraCheese ? '<br><small style="color:#27ae60;">+ Extra Cheese</small>' : ''}</td>
//                     <td>₹${item.itemTotal.toFixed(2)}</td>
//                   </tr>
//                   <tr class="extra-cheese-row">
//                     <td></td>
//                     <td colspan="2">
//                       ₹${item.price} x ${item.quantity}
//                       ${item.hasExtraCheese ? `<br>+ ₹${item.extraCheesePrice} (Extra Cheese)` : ''}
//                     </td>
//                   </tr>
//                 `
//               }).join('')}
//             </tbody>
//           </table>
          
//           <div class="total-section">
//             <div class="total-row">
//               <span>Subtotal:</span>
//               <span>₹${subtotal.toFixed(2)}</span>
//             </div>
            
//             ${extraCheeseTotal > 0 ? `
//               <div class="total-row" style="color: #27ae60;">
//                 <span>Extra Cheese:</span>
//                 <span>+ ₹${extraCheeseTotal.toFixed(2)}</span>
//               </div>
//             ` : ''}
            
//             <div class="total-row final-total">
//               <span>TOTAL:</span>
//               <span>₹${finalTotal.toFixed(2)}</span>
//             </div>
//           </div>
          
//           <div class="footer">
//             <div>Thank you for visiting!</div>
//             <div>We hope to see you again soon</div>
//           </div>
          
//           <div class="no-print" style="text-align: center; margin-top: 20px;">
//             <button class="print-btn" onclick="window.print()">🖨 Print Bill</button>
//             <button class="close-btn" onclick="window.close()">Close</button>
//           </div>
//         </div>
//       </body>
//       </html>
//     `)
    
//     printWindow.document.close()
    
//   } catch (error) {
//     console.error('❌ Error printing bill:', error)
//     alert('Error opening print window: ' + error.message)
//   }
// }

// Thermal bill printing function
const printThermalBill = (order) => {
  try {
    const printWindow = window.open('', '_blank', 'width=320,height=600,scrollbars=no,toolbar=no,location=no')
    
    // Calculate totals including extra cheese
    let subtotal = 0;
    let extraCheeseTotal = 0;
    
    // Calculate item totals including extra cheese
    const itemsWithTotals = order.items?.map(item => {
      const itemName = item.name || item.menuItem?.name || 'Item'
      const quantity = item.quantity || 1
      const price = parseFloat(item.price) || 0
      const extraCheesePrice = parseFloat(item.extraCheesePrice) || 0
      const itemTotal = (price * quantity) + extraCheesePrice
      
      console.log(`🧮 Item calculation: ${itemName}`);
      console.log(`   Price: ${price}, Quantity: ${quantity}, Extra Cheese: ${extraCheesePrice}`);
      console.log(`   Item Total: ${itemTotal}`);
      
      subtotal += price * quantity;
      extraCheeseTotal += extraCheesePrice;
      
      return {
        name: itemName,
        quantity,
        price,
        extraCheesePrice,
        itemTotal,
        hasExtraCheese: item.extraCheese || false
      }
    }) || [];
    
    const totalAmount = subtotal + extraCheeseTotal;
    const finalTotal = totalAmount;
    
    console.log('🧾 Bill Calculation Summary:');
    console.log(`   Subtotal: ${subtotal}`);
    console.log(`   Extra Cheese Total: ${extraCheeseTotal}`);
    console.log(`   Final Total: ${finalTotal}`);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${order.orderNumber}</title>
        <style>
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 80mm;
              background: white;
            }
            .no-print { display: none !important; }
          }
          @media screen {
            body { 
              font-family: 'Courier New', monospace;
              font-size: 14px;
              padding: 20px;
              background: #f5f5f5;
            }
            .bill-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 300px;
              margin: 0 auto;
            }
          }
          .bill-header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .restaurant-name {
            font-weight: bold;
            font-size: 18px;
            margin: 5px 0;
          }
          .bill-info {
            margin: 10px 0;
          }
          .bill-info div {
            margin: 3px 0;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .items-table th {
            text-align: left;
            border-bottom: 1px dashed #000;
            padding: 5px 0;
          }
          .items-table td {
            padding: 3px 0;
            vertical-align: top;
          }
          .item-details {
            font-size: 11px;
            color: #666;
          }
          .extra-cheese-detail {
            color: #27ae60;
            font-weight: bold;
          }
          .total-section {
            border-top: 2px dashed #000;
            margin-top: 10px;
            padding-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .extra-cheese-row {
            color: #27ae60;
            font-weight: bold;
          }
          .final-total {
            font-weight: bold;
            font-size: 16px;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-style: italic;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          .print-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
          }
          .close-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="bill-header">
            <div class="restaurant-name">The Chai Cartel</div>
            <div>-----------</div>
          </div>
          
          <div class="bill-info">
            <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
            <div><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Table:</strong> ${order.tableNumber}</div>
            <div><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</div>
            ${order.mobileNumber ? `<div><strong>Mobile:</strong> ${order.mobileNumber}</div>` : ''}
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsWithTotals.map(item => {
                const hasExtraCheese = item.extraCheesePrice > 0;
                return `
                  <tr>
                    <td>${item.quantity}</td>
                    <td>
                      ${item.name}
                      ${hasExtraCheese ? '<div class="extra-cheese-detail">+ Extra Cheese</div>' : ''}
                    </td>
                    <td>₹${item.itemTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td colspan="2" class="item-details">
                      ₹${item.price.toFixed(2)} × ${item.quantity}
                      ${hasExtraCheese ? `<br><span class="extra-cheese-detail">+ ₹${item.extraCheesePrice.toFixed(2)} (Extra Cheese)</span>` : ''}
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            
            ${extraCheeseTotal > 0 ? `
              <div class="total-row extra-cheese-row">
                <span>Extra Cheese:</span>
                <span>+ ₹${extraCheeseTotal.toFixed(2)}</span>
              </div>
            ` : ''}
            
            <div class="total-row final-total">
              <span>TOTAL:</span>
              <span>₹${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Thank you for visiting!</div>
            <div>We hope to see you again soon</div>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button class="print-btn" onclick="window.print()">🖨 Print Bill</button>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </div>
      </body>
      </html>
    `)
    
    printWindow.document.close()
    
  } catch (error) {
    console.error('❌ Error printing bill:', error)
    alert('Error opening print window: ' + error.message)
  }
}

  // Preview bill
  const previewBill = (order) => {
    printThermalBill(order)
  }

  // FIXED: Get orders grouped by table - only include tables with active (unpaid) orders
  const getOrdersByTable = () => {
    const tableGroups = {}
    
    // Initialize all tables 1-10
    for (let i = 1; i <= 10; i++) {
      tableGroups[i] = []
    }
    
    // FIXED: Only include orders that are NOT paid and NOT cancelled
    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.status !== 'paid') {
        if (!tableGroups[order.tableNumber]) {
          tableGroups[order.tableNumber] = []
        }
        tableGroups[order.tableNumber].push(order)
      }
    })

    return tableGroups
  }

  // Add manual refresh function
  const manualRefresh = async () => {
    await fetchOrders()
    if (!socketConnected) {
      setupSocketConnection()
    }
  }

  // Add periodic refresh as fallback
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      // Only refresh if socket is not connected
      if (!socketConnected && reconnectAttempts >= maxReconnectAttempts) {
        console.log('🔄 Periodic refresh due to socket disconnect')
        fetchOrders()
      }
    }, 30000) // Refresh every 30 seconds if socket is down

    return () => clearInterval(interval)
  }, [isAuthenticated, socketConnected, reconnectAttempts])

  // Status helpers
  const getStatusColor = (status) => {
    const colors = {
      'pending': '#fd7e14',
      'confirmed': '#17a2b8',
      'preparing': '#ffc107',
      'ready': '#20c997',
      'served': '#59a6e9ff',
      'paid': '#28a745',
      'cancelled': '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'served': 'Served',
      'paid': 'Paid',
      'cancelled': 'Cancelled'
    }
    return texts[status] || status
  }

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault()
    if (loginForm.username === ADMIN_CREDENTIALS.username && 
        loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('receptionAuth', 'authenticated')
      setLoginForm({ username: '', password: '' })
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setOrders([])
    setTables([])
    localStorage.removeItem('receptionAuth')
    navigate('/')
  }

  // Enhanced authentication and data initialization
  useEffect(() => {
    const authStatus = localStorage.getItem('receptionAuth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    console.log('🚀 INITIALIZING DASHBOARD...')
    
    const initializeDashboard = async () => {
      initializeTables()
      await fetchOrders()
      setupSocketConnection()
    }

    initializeDashboard()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🔐 Reception Dashboard</h1>
          <form onSubmit={handleLogin}>
            {loginError && <div className="error-message">{loginError}</div>}
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="Password"
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="reception-dashboard">
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
      </audio>

      {showNotification && newOrder && (
        <div className="new-order-popup">
          <button onClick={() => setShowNotification(false)}>×</button>
          <h4>🎉 New Order #{newOrder.orderNumber}</h4>
          <p>Table {newOrder.tableNumber} • {newOrder.customerName}</p>
        </div>
      )}

      {/* Hamburger Sidebar Menu */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Restaurant Management</h3>
          <button className="close-menu" onClick={toggleMenu}>×</button>
        </div>
        
        <div className="sidebar-items">
          <div className="sidebar-section">
            <Link to="/admin/tables" className="sidebar-item" onClick={toggleMenu}>
              🪑 Manage Tables
            </Link>
            {/* <Link to="/admin/menu" className="sidebar-item" onClick={toggleMenu}>
              🍽️ Manage Menu
            </Link> */}
            <Link to="/inventory" className="sidebar-item" onClick={toggleMenu}>
              📦 Manage Inventory
            </Link>
            <Link to="/analysis" className="sidebar-item" onClick={toggleMenu}>
              📈 Sales Analysis
            </Link>
            <Link to="/staff" className="sidebar-item" onClick={toggleMenu}>
              👨‍💼 Staff Management
            </Link>
            
            <Link to="/combined-bills" className="sidebar-item" onClick={toggleMenu}>
              📋 Combined Bills
            </Link>
            {/* <Link to="/support" className="sidebar-item" onClick={toggleMenu}>
              🆘 Contact Support
            </Link> */}
          </div>
          
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn-sidebar">
              Logout
            </button>
          </div>
        </div>
      </div>

      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-left">
            <button className="hamburger-btn" onClick={toggleMenu}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
            <h1>Reception Dashboard</h1>
            <span className={`connection-status ${socketConnected ? 'connected' : 'disconnected'}`}>
              {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
        
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Today's Orders </h3>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-number">{stats.pendingOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Main Content */}
      <main className="main-content">
        {/* Tables display */}
        <div className="tables-section">
          <h3>Table Status ({tables.length} tables)</h3>
          <div className="tables-grid">
            {tables.map(table => (
              <div key={table.tableNumber} className={`table-card ${table.status === 'occupied' ? 'occupied' : 'available'}`}>
                <div className="table-header">
                  <h4>Table {table.tableNumber}</h4>
                  <span className="table-status">
                    {table.status === 'occupied' ? '🟡 Occupied' : '🟢 Available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="orders-section">
          <div className="section-header">
            <h2>Recent Orders ({orders.length})</h2>
          </div>

          {/* Table Groups for Combined Billing */}
          {Object.entries(getOrdersByTable()).filter(([tableNumber, tableOrders]) => tableOrders.length > 0).length > 0 && (
            <div className="table-groups-section">
              <h3>Table Groups for Combined Billing</h3>
              <div className="table-groups">
                {Object.entries(getOrdersByTable())
                  .filter(([tableNumber, tableOrders]) => tableOrders.length > 0)
                  .map(([tableNumber, tableOrders]) => (
                  <div key={tableNumber} className="table-group-card">
                    <div className="table-group-header">
                      <h4>Table {tableNumber}</h4>
                      <span className="order-count">{tableOrders.length} order{tableOrders.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="table-group-details">
                      <p>Customer: {tableOrders[0].customerName || 'Walk-in'}</p>
                      <p>Total Amount: ₹{tableOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}</p>
                      <p>Orders: {tableOrders.map(order => `#${order.orderNumber}`).join(', ')}</p>
                    </div>
                    <button 
                      className="combine-bill-btn"
                      onClick={() => generateCombinedBill(parseInt(tableNumber))}
                    >
                      🧾 Generate Combined Bill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchOrders}>Retry</button>
            </div>
          )}

          {loading && <div className="loading-message">Loading orders...</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="no-orders">
              <p>No orders found</p>
              <button onClick={fetchOrders}>Check Again</button>
            </div>
          )}

          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-title">
                  {/* <h3>Order #{order.orderNumber}</h3> */}
                  <div className="order-time-info">
                    <span className="order-date">
                      {new Date(order.createdAt || order.orderTime).toLocaleDateString('en-IN')}
                    </span>
                    <span className="order-time">
                      {new Date(order.createdAt || order.orderTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
                
                <span 
                  className="status-badge"
                  style={{backgroundColor: getStatusColor(order.status)}}
                >
                  {getStatusText(order.status)}
                </span>
                
                <div className="order-details">
                  <div className="detail-row">
                    <span>Table:</span>
                    <span>Table {order.tableNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span>Customer:</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span>Mobile:</span>
                    <span>{order.mobileNumber}</span>
                  </div>
                </div>

                {/* <div className="order-items">
                  <h4>Items:</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.quantity}x {item.name || item.menuItem?.name}</span>
                      <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div> */}

                <div className="order-items">
  <h4>Items:</h4>
  {order.items?.map((item, index) => (
    <div key={index} className="order-item">
      <div className="item-details">
        <span className="item-name-quantity">
          {item.quantity}x {item.name || item.menuItem?.name}
          {item.extraCheese && <span className="extra-cheese-badge">🧀 Extra Cheese</span>}
        </span>
        <div className="item-price-breakdown">
          <span className="item-price">₹{item.price || 0} × {item.quantity}</span>
          {item.extraCheese && item.extraCheesePrice > 0 && (
            <span className="extra-cheese-price">+ ₹{item.extraCheesePrice} (Extra Cheese)</span>
          )}
        </div>
      </div>
      <span className="item-total">
        ₹{(item.itemTotal || (item.price || 0) * (item.quantity || 1))}
      </span>
    </div>
  ))}
  
  {/* Show extra cheese total if exists */}
  {order.extraCheeseTotal > 0 && (
    <div className="extra-cheese-total-row">
      <span>Extra Cheese Total:</span>
      <span>+ ₹{order.extraCheeseTotal}</span>
    </div>
  )}
</div>
                <div className="order-total">
                  <strong>Total: ₹{order.totalAmount || order.finalTotal}</strong>
                </div>

                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                    disabled={updatingOrders.has(order.orderNumber)}
                    className='status-select'
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button 
                    className="preview-btn"
                    onClick={() => previewBill(order)}
                    title="Preview Bill"
                  >
                    👁 Preview
                  </button>
                  
                  {/* FIXED: Show print button for served orders too */}
                  {(order.status === 'served' || order.status === 'ready') && (
                    <button 
                      className="print-btn"
                      onClick={() => printBillAndClearTable(order)}
                      title="Print Bill & Clear Table"
                    >
                      🖨 Print Bill
                    </button>
                  )}
                  
                  {updatingOrders.has(order.orderNumber) && (
                    <span className="updating-indicator">Updating...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReceptionDashboard