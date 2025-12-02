




import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import './ReceptionDashboard.css'

const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
}

const OrderManagement = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [newOrder, setNewOrder] = useState(null)
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
    totalRevenue: 0,
    occupiedTables: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Add reconnection state
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const maxReconnectAttempts = 5

  // Status helpers
  const getStatusColor = (status) => {
    const colors = {
      'pending': '#fd7e14',
      'confirmed': '#17a2b8',
      'preparing': '#ffc107',
      'ready': '#20c997',
      'served': '#59a6e9',
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



const handleTableClick = (tableNumber, tableStatus) => {
      navigate(`/order/${tableNumber}`)

//   if (tableStatus === 'occupied') {
//     // Find the active order for this table
//     const tableOrder = orders.find(order => {
//       const isSameTable = order.tableNumber === tableNumber
//       const isActive = order.status !== 'paid' && order.status !== 'cancelled'
//       return isSameTable && isActive
//     })
    
//     if (tableOrder && tableOrder._id) {
//       navigate(`/order/${tableOrder._id}`)
//     } else {
//       navigate(`/order/${tableNumber}`)
//     }
//   } else {
//     navigate(`/order/${tableNumber}`)
//   }
}

  // Audio permission and notification sound
  useEffect(() => {
    if (isAuthenticated) {
      const handleUserInteraction = async () => {
        try {
          if (audioRef.current) {
            await audioRef.current.play()
            audioRef.current.pause()
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
    }
  }

  // Initialize default tables (1-10)
//   const initializeTables = () => {
//     const defaultTables = Array.from({ length: 10 }, (_, i) => ({
//       tableNumber: i + 1,
//       status: 'available',
//       capacity: 4,
//       currentOrder: null,
//       orderCount: 0,
//       lastOrderTime: null
//     }))
//     setTables(defaultTables)
//     console.log('📋 Initialized default tables:', defaultTables.length)
//   }
const initializeTables = () => {
  // Regular tables 1-10
  const regularTables = Array.from({ length: 10 }, (_, i) => ({
    tableNumber: i + 1,
    status: 'available',
    capacity: 4,
    currentOrder: null,
    orderCount: 0,
    lastOrderTime: null
  }))
  
  // Add Parcel table
  const parcelTable = {
    tableNumber: 'Parcel',
    status: 'available',
    capacity: 1,
    currentOrder: null,
    orderCount: 0,
    lastOrderTime: null
  }
  
  setTables([...regularTables, parcelTable])
  console.log('📋 Initialized tables:', regularTables.length + 1)
}

  const setupSocketConnection = () => {
    try {
      console.log('🔌 Setting up socket connection...')
      
      if (socketRef.current) {
        console.log('♻️ Closing existing socket connection...')
        socketRef.current.disconnect()
        socketRef.current = null
      }

      const socketUrl = 'wss://orderflow-backend-v964.onrender.com'
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true
      })
      
      socketRef.current = socket
      
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully')
        setSocketConnected(true)
        setReconnectAttempts(0)
        
        socket.emit('join-reception')
        
        socket.emit('test-connection', {
          clientTime: Date.now(),
          dashboard: 'reception'
        })
      })

      socket.on('connected', (data) => {
        console.log('✅ Server connection confirmed:', data)
      })

      socket.on('reception-joined', (data) => {
        console.log('✅ Joined reception room:', data)
      })

      socket.on('new-order', (newOrder) => {
        console.log('🆕 New order via socket:', newOrder)
        handleNewOrder(newOrder)
      })

      socket.on('order-status-updated', (updatedOrder) => {
        console.log('🔄 Order status updated via socket:', updatedOrder)
        handleOrderUpdate(updatedOrder)
      })

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason)
        setSocketConnected(false)
      })

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error)
        setSocketConnected(false)
      })

    } catch (error) {
      console.error('❌ Socket initialization error:', error)
      setSocketConnected(false)
    }
  }

  // Helper functions for socket events
  const handleNewOrder = (newOrder) => {
    setOrders(prev => {
      const orderExists = prev.some(order => order._id === newOrder._id)
      if (orderExists) {
        console.log('📝 Order already exists, updating...')
        return prev.map(order => 
          order._id === newOrder._id ? { ...newOrder, updatedAt: new Date().toISOString() } : order
        )
      }
      
      console.log('📥 Adding new order to list')
      const updatedOrders = [newOrder, ...prev]
      calculateStatsFromOrders(updatedOrders)
      updateTableOrder(newOrder.tableNumber, newOrder)
      return updatedOrders
    })
    
    setNewOrder(newOrder)
    setShowNotification(true)
    playNotificationSound()
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false)
      setNewOrder(null)
    }, 5000)
  }

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prev => {
      const updatedOrders = prev.map(order => 
        order._id === updatedOrder._id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : order
      )
      calculateStatsFromOrders(updatedOrders)
      
      if (updatedOrder.status === 'paid' || updatedOrder.status === 'cancelled') {
        updateTableOrder(updatedOrder.tableNumber, null)
      } else {
        updateTableOrder(updatedOrder.tableNumber, updatedOrder)
      }
      
      return updatedOrders
    })
  }

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
      
      if (!socketConnected) {
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Initialize table orders from fetched data
//   const initializeTableOrders = (ordersData) => {
//     const activeTables = {}
//     const tableOrderCounts = {}
    
//     ordersData.forEach(order => {
//       if (order.status !== 'cancelled') {
//         if (!tableOrderCounts[order.tableNumber]) {
//           tableOrderCounts[order.tableNumber] = 0
//         }
//         tableOrderCounts[order.tableNumber]++
        
//         if (order.status !== 'paid') {
//           activeTables[order.tableNumber] = order
//         }
//       }
//     })
    
//     if (tables.length === 0) {
//       initializeTables()
//     }
    
//     setTables(prev => prev.map(table => ({
//       ...table,
//       currentOrder: activeTables[table.tableNumber] || null,
//       status: activeTables[table.tableNumber] ? 'occupied' : 'available',
//       orderCount: tableOrderCounts[table.tableNumber] || 0,
//       lastOrderTime: ordersData
//         .filter(order => order.tableNumber === table.tableNumber && order.status !== 'cancelled')
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt || null
//     })))
//   }

const initializeTableOrders = (ordersData) => {
  const activeTables = {}
  const tableOrderCounts = {}
  
  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  ordersData.forEach(order => {
    const orderDate = new Date(order.createdAt || order.orderTime)
    const isToday = orderDate >= today
    
    if (order.status !== 'cancelled' && isToday) {
      if (!tableOrderCounts[order.tableNumber]) {
        tableOrderCounts[order.tableNumber] = 0
      }
      tableOrderCounts[order.tableNumber]++
      
      if (order.status !== 'paid') {
        activeTables[order.tableNumber] = order
      }
    }
  })
  
  if (tables.length === 0) {
    initializeTables()
  }
  
  setTables(prev => prev.map(table => ({
    ...table,
    currentOrder: activeTables[table.tableNumber] || null,
    status: activeTables[table.tableNumber] ? 'occupied' : 'available',
    orderCount: tableOrderCounts[table.tableNumber] || 0,
    lastOrderTime: ordersData
      .filter(order => {
        const orderDate = new Date(order.createdAt || order.orderTime)
        const isToday = orderDate >= today
        return order.tableNumber === table.tableNumber && 
               order.status !== 'cancelled' && 
               isToday
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt || null
  })))
}

  // Update table order status
//   const updateTableOrder = (tableNumber, order) => {
//     const newStatus = order ? 'occupied' : 'available'
    
//     setTables(prev => prev.map(table => 
//       table.tableNumber === tableNumber 
//         ? { 
//             ...table, 
//             currentOrder: order, 
//             status: newStatus,
//             orderCount: order ? table.orderCount + 1 : table.orderCount,
//             lastOrderTime: order ? new Date().toISOString() : table.lastOrderTime
//           }
//         : table
//     ))
//   }

const updateTableOrder = (tableNumber, order) => {
  const newStatus = order ? 'occupied' : 'available'
  
  setTables(prev => prev.map(table => 
    table.tableNumber === tableNumber 
      ? { 
          ...table, 
          currentOrder: order, 
          status: newStatus,
          orderCount: order ? table.orderCount + 1 : table.orderCount,
          lastOrderTime: order ? new Date().toISOString() : table.lastOrderTime
        }
      : table
  ))
}

  // Enhanced stats calculation
//   const calculateStatsFromOrders = (ordersData) => {
//     try {
//       const totalOrders = ordersData.length
      
//       const pendingOrders = ordersData.filter(order => 
//         ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
//       ).length
      
//       const totalRevenue = ordersData
//         .filter(order => order.status === 'paid')
//         .reduce((total, order) => {
//           let orderAmount = 0
          
//           if (order.finalTotal !== undefined && order.finalTotal !== null) {
//             orderAmount = parseFloat(order.finalTotal) || 0
//           } else if (order.totalAmount !== undefined && order.totalAmount !== null) {
//             orderAmount = parseFloat(order.totalAmount) || 0
//           } else if (order.total !== undefined && order.total !== null) {
//             orderAmount = parseFloat(order.total) || 0
//           }
          
//           if (orderAmount === 0 && order.items && Array.isArray(order.items)) {
//             orderAmount = order.items.reduce((sum, item) => {
//               const itemPrice = parseFloat(item.price) || 0
//               const itemQuantity = parseInt(item.quantity) || 1
//               return sum + (itemPrice * itemQuantity)
//             }, 0)
            
//             if (order.taxAmount) {
//               orderAmount += parseFloat(order.taxAmount) || 0
//             }
//           }
          
//           return total + orderAmount
//         }, 0)

//       const occupiedTables = tables.filter(t => t.status === 'occupied').length
      
//       setStats({ 
//         totalOrders, 
//         pendingOrders, 
//         totalRevenue,
//         occupiedTables 
//       })
//     } catch (error) {
//       console.error('Error calculating stats:', error)
//     }
//   }

const calculateStatsFromOrders = (ordersData) => {
  try {
    // Get today's date at midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Filter orders from today only
    const todayOrders = ordersData.filter(order => {
      const orderDate = new Date(order.createdAt || order.orderTime)
      return orderDate >= today
    })
    
    const totalOrders = todayOrders.length
    
    const pendingOrders = todayOrders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
    ).length
    
    const totalRevenue = todayOrders
      .filter(order => order.status === 'paid')
      .reduce((total, order) => {
        let orderAmount = 0
        
        if (order.finalTotal !== undefined && order.finalTotal !== null) {
          orderAmount = parseFloat(order.finalTotal) || 0
        } else if (order.totalAmount !== undefined && order.totalAmount !== null) {
          orderAmount = parseFloat(order.totalAmount) || 0
        } else if (order.total !== undefined && order.total !== null) {
          orderAmount = parseFloat(order.total) || 0
        }
        
        if (orderAmount === 0 && order.items && Array.isArray(order.items)) {
          orderAmount = order.items.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price) || 0
            const itemQuantity = parseInt(item.quantity) || 1
            return sum + (itemPrice * itemQuantity)
          }, 0)
          
          if (order.taxAmount) {
            orderAmount += parseFloat(order.taxAmount) || 0
          }
        }
        
        return total + orderAmount
      }, 0)

    const occupiedTables = tables.filter(t => t.status === 'occupied').length
    
    setStats({ 
      totalOrders, 
      pendingOrders, 
      totalRevenue,
      occupiedTables 
    })
    
    console.log(`📊 Today's Stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`)
  } catch (error) {
    console.error('Error calculating stats:', error)
  }
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

  // Add periodic refresh as fallback
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      if (!socketConnected && reconnectAttempts >= maxReconnectAttempts) {
        console.log('🔄 Periodic refresh due to socket disconnect')
        fetchOrders()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated, socketConnected, reconnectAttempts])

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🔐 Order Management</h1>
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
     

    

      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-left">
            <h1>Order Management</h1>
            <span className={`connection-status ${socketConnected ? 'connected' : 'disconnected'}`}>
              {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          <div className="header-actions">
            <button onClick={fetchOrders} disabled={loading} className="refresh-btn">
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
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
            <div className="stat-icon">🪑</div>
            <div className="stat-info">
              <h3>Occupied Tables</h3>
              <p className="stat-number">{stats.occupiedTables}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Tables display with click functionality */}
        <div className="tables-section">
          <div className="section-header">
            <h2>Table Status ({tables.length} tables)</h2>
            <p className="section-subtitle">Click on any table to take order</p>
          </div>
          <div className="tables-grid">
            {tables.map(table => (
              <div 
                key={table.tableNumber} 
                className={`table-card ${table.status === 'occupied' ? 'occupied' : 'available'} clickable-table`}
                onClick={() => handleTableClick(table.tableNumber, table.status)}
              >
                <div className="table-header">
                  {/* <h4>Table {table.tableNumber}</h4> */}
                  <h4>{table.tableNumber === 'Parcel' ? '📦 Parcel' : `Table ${table.tableNumber}`}</h4>
                  <span className="table-status">
                    {table.status === 'occupied' ? '🟡 Occupied' : '🟢 Available'}
                  </span>
                </div>
                
                {table.status === 'occupied' && table.currentOrder && (
                  <div className="table-order-info">
                    {/* <p className="customer-name">
                      <strong>Customer:</strong> {table.currentOrder.customerName || 'Guest'}
                    </p> */}
                    {/* <p className="order-status">
                      <strong>Status:</strong> {getStatusText(table.currentOrder.status)}
                    </p> */}
                    {/* <p className="order-time">
                      <strong>Since:</strong> {new Date(table.currentOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p> */}
                    
                  </div>
                )}
                
                
                
                {table.orderCount > 0 && (
                  <div className="table-history">
                    {/* <span className="order-count">
                      📝 {table.orderCount} order{table.orderCount > 1 ? 's' : ''} today
                    </span> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

   

        
      </main>
    </div>
  )
}

export default OrderManagement