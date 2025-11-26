



import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import './ReceptionDashboard.css'

const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
}

const ReceptionDashboard = () => {
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
    const socketUrl = 'wss://orderflow-backend-v964.onrender.com';
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

    socket.on('connection-status', (data) => {
      console.log('📊 Connection status:', data);
    });

    // Real-time order events - LISTEN TO ALL POSSIBLE EVENTS
    socket.on('new-order', (newOrder) => {
      console.log('🆕 New order via socket:', newOrder);
      handleNewOrder(newOrder);
    });

    socket.on('order-created', (newOrder) => {
      console.log('📝 Order created via socket:', newOrder);
      handleNewOrder(newOrder);
    });

    socket.on('order-status-updated', (updatedOrder) => {
      console.log('🔄 Order status updated via socket:', updatedOrder);
      handleOrderUpdate(updatedOrder);
    });

    socket.on('order-updated', (updatedOrder) => {
      console.log('📝 Order updated via socket:', updatedOrder);
      handleOrderUpdate(updatedOrder);
    });

    socket.on('order-change', (changedOrder) => {
      console.log('📊 Order change via socket:', changedOrder);
      if (changedOrder.eventType === 'new-order') {
        handleNewOrder(changedOrder);
      } else {
        handleOrderUpdate(changedOrder);
      }
    });

    socket.on('status-changed', (updatedOrder) => {
      console.log('🔄 Status changed via socket:', updatedOrder);
      handleOrderUpdate(updatedOrder);
    });

    socket.on('order-deleted', (deletionData) => {
      console.log('🗑️ Order deleted via socket:', deletionData);
      handleOrderDeletion(deletionData);
    });

    // Success/error events
    socket.on('order-update-success', (data) => {
      console.log('✅ Order update successful:', data);
    });

    socket.on('update-error', (error) => {
      console.error('❌ Order update error:', error);
      alert(`Order update failed: ${error.message}`);
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

    socket.on('connection-error', (error) => {
      console.error('❌ Connection error:', error);
      setSocketConnected(false);
    });

    socket.on('socket-error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Test and health events
    socket.on('test-response', (data) => {
      console.log('🧪 Connection test response:', data);
    });

    socket.on('health-check', (data) => {
      console.log('❤️ Health check:', data);
      // Respond to health check
      socket.emit('health-ack', { clientTime: Date.now() });
    });

    socket.on('orders-refreshed', (data) => {
      console.log('🔄 Orders refreshed via socket:', data);
      fetchOrders(); // Refresh data
    });

    socket.on('pong', (data) => {
      console.log('🏓 Pong received:', data);
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
  setOrders(prev => {
    const updatedOrders = prev.map(order => 
      order._id === updatedOrder._id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : order
    );
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


  // Enhanced fetch orders with better error handling
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

  // Initialize table orders from fetched data
  // const initializeTableOrders = (ordersData) => {
  //   const activeTables = {}
    
  //   ordersData.forEach(order => {
  //     // FIXED: Only exclude paid and cancelled orders, keep served orders visible
  //     if (order.status !== 'paid' && order.status !== 'cancelled') {
  //       activeTables[order.tableNumber] = order
  //     }
  //   })
    
  //   // Initialize tables first if not already initialized
  //   if (tables.length === 0) {
  //     initializeTables()
  //   }
    
  //   setTables(prev => prev.map(table => ({
  //     ...table,
  //     currentOrder: activeTables[table.tableNumber] || null,
  //     status: activeTables[table.tableNumber] ? 'occupied' : 'available'
  //   })))
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

  // FIXED: Enhanced stats calculation
  // const calculateStatsFromOrders = (ordersData) => {
  //   try {
  //     const totalOrders = ordersData.length
      
  //     // FIXED: Include served orders in pending count (they're still visible for billing)
  //     const pendingOrders = ordersData.filter(order => 
  //       ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
  //     ).length
      
  //     // FIXED: Calculate revenue from paid orders with proper amount
  //     const totalRevenue = ordersData
  //       .filter(order => order.status === 'paid')
  //       .reduce((total, order) => {
  //         const orderAmount = order.finalTotal || order.totalAmount || 0
  //         console.log(`💰 Order ${order.orderNumber}: ${orderAmount}`)
  //         return total + orderAmount
  //       }, 0)

  //     console.log(`📊 Stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`)
      
  //     setStats({ totalOrders, pendingOrders, totalRevenue })
  //   } catch (error) {
  //     console.error('Error calculating stats:', error)
  //   }
  // }

  // FIXED: Enhanced stats calculation with proper revenue calculation
const calculateStatsFromOrders = (ordersData) => {
  try {
    const totalOrders = ordersData.length
    
    // FIXED: Include served orders in pending count (they're still visible for billing)
    const pendingOrders = ordersData.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
    ).length
    
    // FIXED: Calculate revenue from paid orders with proper amount parsing
    const totalRevenue = ordersData
      .filter(order => order.status === 'paid')
      .reduce((total, order) => {
        // Try multiple possible amount fields and ensure it's a number
        let orderAmount = 0;
        
        if (order.finalTotal !== undefined && order.finalTotal !== null) {
          orderAmount = parseFloat(order.finalTotal) || 0;
        } else if (order.totalAmount !== undefined && order.totalAmount !== null) {
          orderAmount = parseFloat(order.totalAmount) || 0;
        } else if (order.total !== undefined && order.total !== null) {
          orderAmount = parseFloat(order.total) || 0;
        }
        
        // Also check if items exist and calculate from items if amount is 0
        if (orderAmount === 0 && order.items && Array.isArray(order.items)) {
          orderAmount = order.items.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity) || 1;
            return sum + (itemPrice * itemQuantity);
          }, 0);
          
          // Add tax if applicable
          if (order.taxAmount) {
            orderAmount += parseFloat(order.taxAmount) || 0;
          }
        }
        
        console.log(`💰 Order ${order.orderNumber}: ${orderAmount} (from finalTotal: ${order.finalTotal}, totalAmount: ${order.totalAmount})`);
        return total + orderAmount;
      }, 0);

    console.log(`📊 Stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`);
    console.log('💰 Paid orders:', ordersData.filter(order => order.status === 'paid').map(order => ({
      orderNumber: order.orderNumber,
      finalTotal: order.finalTotal,
      totalAmount: order.totalAmount,
      items: order.items
    })));
    
    setStats({ totalOrders, pendingOrders, totalRevenue });
  } catch (error) {
    console.error('Error calculating stats:', error);
  }
};

  // Enhanced order status update with socket emission
  // const updateOrderStatus = async (orderNumber, newStatus) => {
  //   try {
  //     console.log('🔄 Updating order status:', { orderNumber, newStatus })
  //     setUpdatingOrders(prev => new Set(prev).add(orderNumber))

  //     const order = orders.find(o => o.orderNumber === orderNumber)
      
  //     if (!order) {
  //       alert('Order not found in local data.')
  //       return
  //     }

  //     console.log('📡 Sending to backend:', { orderId: order._id, status: newStatus })

  //     // Update local state immediately for better UX
  //     setOrders(prev => {
  //       const updatedOrders = prev.map(o => 
  //         o.orderNumber === orderNumber 
  //           ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
  //           : o
  //       )
  //       calculateStatsFromOrders(updatedOrders)
  //       return updatedOrders
  //     })

  //     // Emit socket event for real-time update
  //     if (socketRef.current && socketConnected) {
  //       socketRef.current.emit('update-order-status', {
  //         orderId: order._id,
  //         status: newStatus
  //       })
  //     }

  //     // Try to update backend but don't block on failure
  //     try {
  //       // Try multiple endpoints
  //       try {
  //         await axios.put(`${API_BASE_URL}/orders/${order._id}/status`, { 
  //           status: newStatus 
  //         }, { timeout: 5000 })
  //       } catch (error) {
  //         await axios.put(`${API_BASE_URL}/orders/${order._id}`, { 
  //           status: newStatus 
  //         }, { timeout: 5000 })
  //       }
  //       console.log('✅ Backend update successful')
  //     } catch (error) {
  //       console.warn('⚠️ Backend update failed, but local state updated:', error.message)
  //     }

  //     // Update table status
  //     if (newStatus === 'paid' || newStatus === 'cancelled') {
  //       updateTableOrder(order.tableNumber, null)
        
  //       // Remove from orders list after a delay when PAID or CANCELLED
  //       setTimeout(() => {
  //         setOrders(prev => prev.filter(o => o.orderNumber !== orderNumber))
  //       }, 2000)
  //     } else {
  //       updateTableOrder(order.tableNumber, { ...order, status: newStatus })
  //     }

  //     console.log('✅ Order status updated successfully')

  //   } catch (error) {
  //     console.error('❌ Error updating order status:', error)
  //     alert('Failed to update order status: ' + error.message)
      
  //     // Revert local state on error
  //     fetchOrders() // Refresh data
  //   } finally {
  //     setUpdatingOrders(prev => {
  //       const newSet = new Set(prev)
  //       newSet.delete(orderNumber)
  //       return newSet
  //     })
  //   }
  // }

  // FIXED: Enhanced order status update with socket emission - Don't remove paid orders
const updateOrderStatus = async (orderNumber, newStatus) => {
  try {
    console.log('🔄 Updating order status:', { orderNumber, newStatus })
    setUpdatingOrders(prev => new Set(prev).add(orderNumber))

    const order = orders.find(o => o.orderNumber === orderNumber)
    
    if (!order) {
      alert('Order not found in local data.')
      return
    }

    console.log('📡 Sending to backend:', { orderId: order._id, status: newStatus })

    // Update local state immediately for better UX
    setOrders(prev => {
      const updatedOrders = prev.map(o => 
        o.orderNumber === orderNumber 
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
      calculateStatsFromOrders(updatedOrders)
      return updatedOrders
    })

    // Emit socket event for real-time update
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('update-order-status', {
        orderId: order._id,
        status: newStatus
      })
    }

    // Try to update backend but don't block on failure
    try {
      // Try multiple endpoints
      try {
        await axios.put(`${API_BASE_URL}/orders/${order._id}/status`, { 
          status: newStatus 
        }, { timeout: 5000 })
      } catch (error) {
        await axios.put(`${API_BASE_URL}/orders/${order._id}`, { 
          status: newStatus 
        }, { timeout: 5000 })
      }
      console.log('✅ Backend update successful')
    } catch (error) {
      console.warn('⚠️ Backend update failed, but local state updated:', error.message)
    }

    // FIXED: Only update table status, don't remove order from list
    if (newStatus === 'paid' || newStatus === 'cancelled') {
      updateTableOrder(order.tableNumber, null)
      // REMOVED: The setTimeout that removes order from list
    } else {
      updateTableOrder(order.tableNumber, { ...order, status: newStatus })
    }

    console.log('✅ Order status updated successfully')

  } catch (error) {
    console.error('❌ Error updating order status:', error)
    alert('Failed to update order status: ' + error.message)
    
    // Revert local state on error
    fetchOrders() // Refresh data
  } finally {
    setUpdatingOrders(prev => {
      const newSet = new Set(prev)
      newSet.delete(orderNumber)
      return newSet
    })
  }
}
  // FIXED: Enhanced combined bill - mark as paid after printing
  // const generateCombinedBill = async (tableNumber) => {
  //   try {
  //     console.log('🧾 Generating combined bill for table:', tableNumber)
      
  //     const tableOrders = orders.filter(order => 
  //       order.tableNumber === tableNumber && 
  //       order.status !== 'cancelled' && 
  //       order.status !== 'paid' // Only include orders that are not paid
  //     )

  //     if (tableOrders.length === 0) {
  //       alert(`No active orders found for Table ${tableNumber}`)
  //       return
  //     }

  //     // Combine all items
  //     const combinedItems = []
  //     let totalAmount = 0
  //     let customerName = ''
  //     let mobileNumber = ''

  //     tableOrders.forEach(order => {
  //       if (!customerName && order.customerName) {
  //         customerName = order.customerName
  //         mobileNumber = order.mobileNumber
  //       }

  //       order.items?.forEach(item => {
  //         const itemName = item.name || item.menuItem?.name || 'Item'
  //         const itemPrice = item.price || 0
  //         const itemQuantity = item.quantity || 1
          
  //         const existingItem = combinedItems.find(combinedItem => 
  //           combinedItem.name === itemName && combinedItem.price === itemPrice
  //         )

  //         if (existingItem) {
  //           existingItem.quantity += itemQuantity
  //         } else {
  //           combinedItems.push({
  //             name: itemName,
  //             price: itemPrice,
  //             quantity: itemQuantity,
  //             isVeg: item.isVeg
  //           })
  //         }
  //       })

  //       totalAmount += order.totalAmount || order.finalTotal || 0
  //     })

  //     // Create combined order
  //     const combinedOrder = {
  //       orderNumber: `COMBINED-${Date.now()}`,
  //       tableNumber: tableNumber,
  //       customerName: customerName || 'Walk-in Customer',
  //       mobileNumber: mobileNumber || 'N/A',
  //       items: combinedItems,
  //       totalAmount: totalAmount,
  //       taxAmount: totalAmount * 0.05,
  //       finalTotal: totalAmount * 1.05,
  //       createdAt: new Date().toISOString(),
  //       isCombinedBill: true,
  //       originalOrders: tableOrders.map(order => order.orderNumber)
  //     }

  //     console.log('📊 Combined bill details:', combinedOrder)

  //     // Print combined bill
  //     printThermalBill(combinedOrder)

  //     // FIXED: Mark all original orders as PAID (not served) after printing bill
  //     tableOrders.forEach(order => {
  //       updateOrderStatus(order.orderNumber, 'paid') // Change to 'paid' to remove from list
  //     })

  //     // Show success message
  //     alert(`Combined bill generated for Table ${tableNumber}! All orders marked as paid.`)

  //   } catch (error) {
  //     console.error('❌ Error generating combined bill:', error)
  //     alert('Error generating combined bill: ' + error.message)
  //   }
  // }

  // FIXED: Enhanced combined bill - only mark unpaid orders as paid
// const generateCombinedBill = async (tableNumber) => {
//   try {
//     console.log('🧾 Generating combined bill for table:', tableNumber)
    
//     // FIXED: Only include orders that are NOT paid for combined billing
//     const tableOrders = orders.filter(order => 
//       order.tableNumber === tableNumber && 
//       order.status !== 'cancelled' && 
//       order.status !== 'paid' // Only include unpaid orders
//     )

//     if (tableOrders.length === 0) {
//       alert(`No active (unpaid) orders found for Table ${tableNumber}`)
//       return
//     }

//     // Combine all items
//     const combinedItems = []
//     let totalAmount = 0
//     let customerName = ''
//     let mobileNumber = ''

//     tableOrders.forEach(order => {
//       if (!customerName && order.customerName) {
//         customerName = order.customerName
//         mobileNumber = order.mobileNumber
//       }

//       order.items?.forEach(item => {
//         const itemName = item.name || item.menuItem?.name || 'Item'
//         const itemPrice = item.price || 0
//         const itemQuantity = item.quantity || 1
        
//         const existingItem = combinedItems.find(combinedItem => 
//           combinedItem.name === itemName && combinedItem.price === itemPrice
//         )

//         if (existingItem) {
//           existingItem.quantity += itemQuantity
//         } else {
//           combinedItems.push({
//             name: itemName,
//             price: itemPrice,
//             quantity: itemQuantity,
//             isVeg: item.isVeg
//           })
//         }
//       })

//       totalAmount += order.totalAmount || order.finalTotal || 0
//     })

//     // Create combined order
//     const combinedOrder = {
//       orderNumber: `COMBINED-${Date.now()}`,
//       tableNumber: tableNumber,
//       customerName: customerName || 'Walk-in Customer',
//       mobileNumber: mobileNumber || 'N/A',
//       items: combinedItems,
//       totalAmount: totalAmount,
//       taxAmount: totalAmount * 0.05,
//       finalTotal: totalAmount * 1.05,
//       createdAt: new Date().toISOString(),
//       isCombinedBill: true,
//       originalOrders: tableOrders.map(order => order.orderNumber)
//     }

//     console.log('📊 Combined bill details:', combinedOrder)

//     // Print combined bill
//     printThermalBill(combinedOrder)

//     // FIXED: Mark only the unpaid original orders as PAID after printing bill
//     tableOrders.forEach(order => {
//       if (order.status !== 'paid') {
//         updateOrderStatus(order.orderNumber, 'paid')
//       }
//     })

//     // Show success message
//     alert(`Combined bill generated for Table ${tableNumber}! Unpaid orders marked as paid.`)

//   } catch (error) {
//     console.error('❌ Error generating combined bill:', error)
//     alert('Error generating combined bill: ' + error.message)
//   }
// }

// FIXED: Enhanced combined bill - mark as paid and remove table group
const generateCombinedBill = async (tableNumber) => {
  try {
    console.log('🧾 Generating combined bill for table:', tableNumber)
    
    // FIXED: Only include orders that are NOT paid for combined billing
    const tableOrders = orders.filter(order => 
      order.tableNumber === tableNumber && 
      order.status !== 'cancelled' && 
      order.status !== 'paid' // Only include unpaid orders
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

    // Create combined order
    const combinedOrder = {
      orderNumber: `COMBINED-${Date.now()}`,
      tableNumber: tableNumber,
      customerName: customerName || 'Walk-in Customer',
      mobileNumber: mobileNumber || 'N/A',
      items: combinedItems,
      totalAmount: totalAmount,
      taxAmount: totalAmount * 0.05,
      finalTotal: totalAmount * 1.05,
      createdAt: new Date().toISOString(),
      isCombinedBill: true,
      originalOrders: tableOrders.map(order => order.orderNumber)
    }

    console.log('📊 Combined bill details:', combinedOrder)

    // Print combined bill
    printThermalBill(combinedOrder)

    // FIXED: Mark all original orders as PAID after printing bill
    tableOrders.forEach(order => {
      updateOrderStatus(order.orderNumber, 'paid')
    })

    // FIXED: The table group card will automatically vanish because 
    // getOrdersByTable() now only returns tables with unpaid orders
    
    // Show success message
    alert(`Combined bill generated for Table ${tableNumber}! All orders marked as paid. Table group removed.`)

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
  const printThermalBill = (order) => {
    try {
      const printWindow = window.open('', '_blank', 'width=320,height=600,scrollbars=no,toolbar=no,location=no')
      
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
              border-bottom: 1px dotted #ccc;
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
            .final-total {
              font-weight: bold;
              font-size: 16px;
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
              <div class="restaurant-name">AMORE MIO</div>
              <div>Restaurant & Cafe</div>
              <div>--------------------------------</div>
            </div>
            
            <div class="bill-info">
              <div><strong>Order #:</strong> ${order.orderNumber}</div>
              <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
              <div><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
              <div><strong>Table:</strong> ${order.tableNumber}</div>
              <div><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</div>
              ${order.mobileNumber ? `<div><strong>Mobile:</strong> ${order.mobileNumber}</div>` : ''}
              ${order.isCombinedBill ? `<div><strong>Type:</strong> Combined Bill</div>` : ''}
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
                ${order.items?.map(item => {
                  const itemName = item.name || item.menuItem?.name || 'Item'
                  const quantity = item.quantity || 1
                  const price = item.price || 0
                  const total = price * quantity
                  return `
                    <tr>
                      <td>${quantity}</td>
                      <td>${itemName}</td>
                      <td>₹${total}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colspan="2" style="font-size: 10px; color: #666;">₹${price} x ${quantity}</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax (5%):</span>
                <span>₹${(order.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row final-total">
                <span>TOTAL:</span>
                <span>₹${(order.finalTotal || order.totalAmount || 0).toFixed(2)}</span>
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

  // FIXED: Get orders grouped by table - include served orders for billing
  // const getOrdersByTable = () => {
  //   const tableGroups = {}
    
  //   // Initialize all tables 1-10
  //   for (let i = 1; i <= 10; i++) {
  //     tableGroups[i] = []
  //   }
    
  //   // FIXED: Include served orders (they should be visible for billing)
  //   orders.forEach(order => {
  //     if (order.status !== 'cancelled' && order.status !== 'paid') {
  //       if (!tableGroups[order.tableNumber]) {
  //         tableGroups[order.tableNumber] = []
  //       }
  //       tableGroups[order.tableNumber].push(order)
  //     }
  //   })

  //   return tableGroups
  // }

  // FIXED: Get orders grouped by table - include paid orders for reference
// const getOrdersByTable = () => {
//   const tableGroups = {}
  
//   // Initialize all tables 1-10
//   for (let i = 1; i <= 10; i++) {
//     tableGroups[i] = []
//   }
  
//   // FIXED: Include all orders except cancelled for billing reference
//   orders.forEach(order => {
//     if (order.status !== 'cancelled') {
//       if (!tableGroups[order.tableNumber]) {
//         tableGroups[order.tableNumber] = []
//       }
//       tableGroups[order.tableNumber].push(order)
//     }
//   })

//   return tableGroups
// }

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

      <header className="dashboard-header">
        <div className="header-top">
          <h1>Reception Dashboard</h1>
          <div className="header-actions">
            
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            <Link to="/admin/tables" className="btn-primary">Manage Tables</Link>
            <Link to="/admin/menu" className="btn-primary">Manage Menu</Link>
            <Link to="/inventory" className="btn-primary">Manage Inventory</Link>
            <Link to="/analysis" className="btn-primary">Analysis</Link>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
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
          <div className="header-actions">
            <button onClick={fetchOrders} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Table Groups for Combined Billing */}
        <div className="table-groups-section">
          <h3>Table Groups for Combined Billing</h3>
          {/* <div className="table-groups">
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
          </div> */}

          {/* Table Groups for Combined Billing - Only show if there are active tables */}
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
        </div>

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
                <h3>Order #{order.orderNumber}</h3>
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

              <div className="order-items">
                <h4>Items:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.quantity}x {item.name || item.menuItem?.name}</span>
                    <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
                  </div>
                ))}
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
    </div>
  )
}

export default ReceptionDashboard