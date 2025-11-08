// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import io from 'socket.io-client'
// import axios from 'axios'
// import './ReceptionDashboard.css'

// const API_BASE_URL = 'http://localhost:5000/api'

// const ReceptionDashboard = () => {
//   const [orders, setOrders] = useState([])
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0
//   })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchOrders()
//     fetchStats()
    
//     const socket = io('http://localhost:5000')
//     socket.emit('join-reception')
    
//     socket.on('new-order', (newOrder) => {
//       setOrders(prev => [newOrder, ...prev])
//       fetchStats()
//     })

//     return () => socket.disconnect()
//   }, [])

//   const fetchOrders = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${API_BASE_URL}/orders`)
//       setOrders(response.data)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       alert('Error loading orders. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/orders/stats/today`)
//       setStats(response.data)
//     } catch (error) {
//       console.error('Error fetching stats:', error)
//     }
//   }

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, {
//         status: newStatus
//       })
//       fetchOrders() // Refresh orders to get updated data
//     } catch (error) {
//       console.error('Error updating order status:', error)
//       alert('Error updating order status. Please try again.')
//     }
//   }

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: '#ffc107',
//       confirmed: '#17a2b8',
//       preparing: '#fd7e14',
//       ready: '#28a745',
//       served: '#6c757d',
//       cancelled: '#dc3545'
//     }
//     return colors[status] || '#6c757d'
//   }

//   const getStatusText = (status) => {
//     const texts = {
//       pending: 'Pending',
//       confirmed: 'Confirmed',
//       preparing: 'Preparing',
//       ready: 'Ready to Serve',
//       served: 'Served',
//       cancelled: 'Cancelled'
//     }
//     return texts[status] || status
//   }

//   return (
//     <div className="reception-dashboard">
//       <header className="dashboard-header">
//         <div className="header-top">
//           <h1>Reception Dashboard</h1>
//           <div className="header-actions">
//             <Link to="/admin/tables" className="btn-primary">
//               Manage Tables
//             </Link>
//             <button onClick={fetchOrders} className="btn-secondary" disabled={loading}>
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>
//         </div>
        
//         <div className="stats-container">
//           <div className="stat-card">
//             <div className="stat-icon">📊</div>
//             <div className="stat-info">
//               <h3>Total Orders Today</h3>
//               <p className="stat-number">{stats.totalOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-info">
//               <h3>Pending Orders</h3>
//               <p className="stat-number">{stats.pendingOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">💰</div>
//             <div className="stat-info">
//               <h3>Revenue Today</h3>
//               <p className="stat-number">₹{stats.totalRevenue}</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="orders-section">
//         <div className="section-header">
//           <h2>Recent Orders</h2>
//           <span className="orders-count">{orders.length} orders</span>
//         </div>
        
//         {loading ? (
//           <div className="loading-message">Loading orders...</div>
//         ) : (
//           <div className="orders-grid">
//             {orders.length === 0 ? (
//               <div className="no-orders">
//                 <p>No orders yet</p>
//                 <small>Orders will appear here when customers place them</small>
//               </div>
//             ) : (
//               orders.map(order => (
//                 <div key={order._id} className="order-card">
//                   <div className="order-header">
//                     <div className="order-title">
//                       <h3>Order #{order.orderNumber}</h3>
//                       <span className="order-time">
//                         {new Date(order.orderTime).toLocaleTimeString()}
//                       </span>
//                     </div>
//                     <span 
//                       className="status-badge"
//                       style={{ backgroundColor: getStatusColor(order.status) }}
//                     >
//                       {getStatusText(order.status)}
//                     </span>
//                   </div>
                  
//                   <div className="order-details">
//                     <div className="detail-row">
//                       <span className="detail-label">Table:</span>
//                       <span className="detail-value">Table {order.tableNumber}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="detail-label">Customer:</span>
//                       <span className="detail-value">{order.customerName}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="detail-label">Mobile:</span>
//                       <span className="detail-value">{order.mobileNumber}</span>
//                     </div>
//                   </div>

//                   <div className="order-items">
//                     <h4>Order Items:</h4>
//                     {order.items.map((item, index) => (
//                       <div key={index} className="order-item">
//                         <span className="item-name">
//                           {item.quantity}x {item.menuItem?.name || 'Item'}
//                         </span>
//                         <span className="item-price">
//                           ₹{item.price * item.quantity}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="order-total">
//                     <strong>Total: ₹{order.totalAmount}</strong>
//                   </div>

//                   <div className="order-actions">
//                     <label>Update Status:</label>
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="status-select"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="preparing">Preparing</option>
//                       <option value="ready">Ready</option>
//                       <option value="served">Served</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ReceptionDashboard

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import './ReceptionDashboard.css'

const API_BASE_URL = 'http://localhost:5000/api'

const ReceptionDashboard = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchStats()
    
    const socket = io('http://localhost:5000')
    socket.emit('join-reception')
    
    socket.on('new-order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev])
      fetchStats()
    })

    return () => socket.disconnect()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/orders`)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Error loading orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/stats/today`)
      setStats(response.data)
      setStatsError(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStatsError(true)
      // Set default stats if API fails
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => 
          ['pending', 'confirmed', 'preparing'].includes(order.status)
        ).length,
        totalRevenue: orders
          .filter(order => order.status !== 'cancelled')
          .reduce((total, order) => total + order.totalAmount, 0)
      })
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, {
        status: newStatus
      })
      fetchOrders() // Refresh orders to get updated data
      fetchStats() // Refresh stats
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      preparing: '#fd7e14',
      ready: '#28a745',
      served: '#6c757d',
      cancelled: '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready to Serve',
      served: 'Served',
      cancelled: 'Cancelled'
    }
    return texts[status] || status
  }

  return (
    <div className="reception-dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <h1>Reception Dashboard</h1>
          <div className="header-actions">
            <Link to="/admin/tables" className="btn-primary">
              Manage Tables
            </Link>
            <button onClick={fetchOrders} className="btn-secondary" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Orders Today</h3>
              <p className="stat-number">{stats.totalOrders}</p>
              {statsError && <small style={{color: '#ff6b6b'}}>Live stats unavailable</small>}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending Orders</h3>
              <p className="stat-number">{stats.pendingOrders}</p>
              {statsError && <small style={{color: '#ff6b6b'}}>Live stats unavailable</small>}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Revenue Today</h3>
              <p className="stat-number">₹{stats.totalRevenue}</p>
              {statsError && <small style={{color: '#ff6b6b'}}>Live stats unavailable</small>}
            </div>
          </div>
        </div>
      </header>

      <div className="orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <span className="orders-count">{orders.length} orders</span>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading orders...</div>
        ) : (
          <div className="orders-grid">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders yet</p>
                <small>Orders will appear here when customers place them</small>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-title">
                      <h3>Order #{order.orderNumber}</h3>
                      <span className="order-time">
                        {new Date(order.orderTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="detail-label">Table:</span>
                      <span className="detail-value">Table {order.tableNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Customer:</span>
                      <span className="detail-value">{order.customerName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{order.mobileNumber}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Order Items:</h4>
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">
                          {item.quantity}x {item.menuItem?.name || 'Item'}
                        </span>
                        <span className="item-price">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>

                  <div className="order-actions">
                    <label>Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="served">Served</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceptionDashboard