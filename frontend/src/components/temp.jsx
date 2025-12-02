// import React, { useState, useEffect, useRef } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import io from 'socket.io-client'
// import axios from 'axios'
// import './ReceptionDashboard.css'

// const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

// const ADMIN_CREDENTIALS = {
//   username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
//   password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
// }

// const ReceptionDashboard = () => {
//   const navigate = useNavigate()
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loginForm, setLoginForm] = useState({ username: '', password: '' })
//   const [loginError, setLoginError] = useState('')
  
//   // Hamburger menu state
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [activeModule, setActiveModule] = useState('dashboard') // dashboard, menu, inventory, analytics
  
//   // Dashboard State
//   const [showNotification, setShowNotification] = useState(false)
//   const [newOrder, setNewOrder] = useState(null)
//   const [audioPermissionGranted, setAudioPermissionGranted] = useState(false)
//   const notificationTimeoutRef = useRef(null)
//   const audioRef = useRef(null)
//   const [updatingOrders, setUpdatingOrders] = useState(new Set())
//   const socketRef = useRef(null)
//   const [socketConnected, setSocketConnected] = useState(false)
//   const [orders, setOrders] = useState([])
//   const [tables, setTables] = useState([])
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0,
//     todayRevenue: 0,
//     averageOrderValue: 0
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   // Menu Management State
//   const [menuItems, setMenuItems] = useState([])
//   const [categories, setCategories] = useState([])
//   const [menuForm, setMenuForm] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     imageUrl: '',
//     isVeg: true,
//     isAvailable: true
//   })
//   const [menuLoading, setMenuLoading] = useState(false)
  
//   // Inventory Management State
//   const [inventoryItems, setInventoryItems] = useState([])
//   const [inventoryForm, setInventoryForm] = useState({
//     name: '',
//     category: '',
//     currentStock: 0,
//     minStockLevel: 10,
//     unit: 'pcs',
//     pricePerUnit: 0,
//     supplier: ''
//   })
//   const [inventoryLoading, setInventoryLoading] = useState(false)
  
//   // Analytics State
//   const [analyticsData, setAnalyticsData] = useState({
//     dailySales: [],
//     topSellingItems: [],
//     categoryWiseSales: [],
//     peakHours: [],
//     customerStats: {
//       totalCustomers: 0,
//       repeatCustomers: 0,
//       averageVisitValue: 0
//     }
//   })
//   const [dateRange, setDateRange] = useState({
//     start: new Date().toISOString().split('T')[0],
//     end: new Date().toISOString().split('T')[0]
//   })
  
//   // Reconnection state
//   const [reconnectAttempts, setReconnectAttempts] = useState(0)
//   const maxReconnectAttempts = 5

//   // Toggle hamburger menu
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen)
//   }

//   // Change active module
//   const changeModule = (module) => {
//     setActiveModule(module)
//     setIsMenuOpen(false)
    
//     // Fetch data based on module
//     switch(module) {
//       case 'menu':
//         fetchMenuItems()
//         fetchCategories()
//         break
//       case 'inventory':
//         fetchInventoryItems()
//         break
//       case 'analytics':
//         fetchAnalyticsData()
//         break
//       case 'dashboard':
//         fetchOrders()
//         break
//     }
//   }

//   // Menu Management Functions
//   const fetchMenuItems = async () => {
//     try {
//       setMenuLoading(true)
//       const response = await axios.get(`${API_BASE_URL}/menu`)
//       setMenuItems(response.data)
//     } catch (error) {
//       console.error('Error fetching menu items:', error)
//     } finally {
//       setMenuLoading(false)
//     }
//   }

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/menu/categories`)
//       setCategories(response.data)
//     } catch (error) {
//       console.error('Error fetching categories:', error)
//     }
//   }

//   const handleAddMenuItem = async (e) => {
//     e.preventDefault()
//     try {
//       const response = await axios.post(`${API_BASE_URL}/menu`, menuForm)
//       setMenuItems([...menuItems, response.data])
//       setMenuForm({
//         name: '',
//         description: '',
//         price: '',
//         category: '',
//         imageUrl: '',
//         isVeg: true,
//         isAvailable: true
//       })
//       alert('Menu item added successfully!')
//     } catch (error) {
//       console.error('Error adding menu item:', error)
//       alert('Error adding menu item')
//     }
//   }

//   const handleDeleteMenuItem = async (id) => {
//     if (window.confirm('Are you sure you want to delete this menu item?')) {
//       try {
//         await axios.delete(`${API_BASE_URL}/menu/${id}`)
//         setMenuItems(menuItems.filter(item => item._id !== id))
//         alert('Menu item deleted successfully!')
//       } catch (error) {
//         console.error('Error deleting menu item:', error)
//         alert('Error deleting menu item')
//       }
//     }
//   }

//   // Inventory Management Functions
//   const fetchInventoryItems = async () => {
//     try {
//       setInventoryLoading(true)
//       const response = await axios.get(`${API_BASE_URL}/inventory`)
//       setInventoryItems(response.data)
//     } catch (error) {
//       console.error('Error fetching inventory items:', error)
//     } finally {
//       setInventoryLoading(false)
//     }
//   }

//   const handleAddInventoryItem = async (e) => {
//     e.preventDefault()
//     try {
//       const response = await axios.post(`${API_BASE_URL}/inventory`, inventoryForm)
//       setInventoryItems([...inventoryItems, response.data])
//       setInventoryForm({
//         name: '',
//         category: '',
//         currentStock: 0,
//         minStockLevel: 10,
//         unit: 'pcs',
//         pricePerUnit: 0,
//         supplier: ''
//       })
//       alert('Inventory item added successfully!')
//     } catch (error) {
//       console.error('Error adding inventory item:', error)
//       alert('Error adding inventory item')
//     }
//   }

//   const handleUpdateStock = async (id, newStock) => {
//     try {
//       await axios.put(`${API_BASE_URL}/inventory/${id}/stock`, { stock: newStock })
//       setInventoryItems(inventoryItems.map(item => 
//         item._id === id ? { ...item, currentStock: newStock } : item
//       ))
//       alert('Stock updated successfully!')
//     } catch (error) {
//       console.error('Error updating stock:', error)
//       alert('Error updating stock')
//     }
//   }

//   // Analytics Functions
//   const fetchAnalyticsData = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/analytics`, {
//         params: {
//           startDate: dateRange.start,
//           endDate: dateRange.end
//         }
//       })
//       setAnalyticsData(response.data)
//     } catch (error) {
//       console.error('Error fetching analytics:', error)
//     }
//   }

//   // Initialize default tables
//   const initializeTables = () => {
//     const defaultTables = Array.from({ length: 10 }, (_, i) => ({
//       tableNumber: i + 1,
//       status: 'available',
//       capacity: 4,
//       currentOrder: null
//     }))
//     setTables(defaultTables)
//   }

//   // Setup socket connection (keep your existing socket setup)
//   const setupSocketConnection = () => {
//     // ... keep your existing socket setup code ...
//   }

//   // Login handler
//   const handleLogin = (e) => {
//     e.preventDefault()
//     if (loginForm.username === ADMIN_CREDENTIALS.username && 
//         loginForm.password === ADMIN_CREDENTIALS.password) {
//       setIsAuthenticated(true)
//       localStorage.setItem('receptionAuth', 'authenticated')
//       setLoginForm({ username: '', password: '' })
//       fetchOrders()
//       setupSocketConnection()
//     } else {
//       setLoginError('Invalid credentials')
//     }
//   }

//   const handleLogout = () => {
//     setIsAuthenticated(false)
//     localStorage.removeItem('receptionAuth')
//   }

//   // Render different modules based on activeModule
//   const renderModule = () => {
//     switch(activeModule) {
//       case 'menu':
//         return renderMenuManagement()
//       case 'inventory':
//         return renderInventoryManagement()
//       case 'analytics':
//         return renderAnalytics()
//       case 'dashboard':
//       default:
//         return renderDashboard()
//     }
//   }

//   // Render Dashboard Module
//   const renderDashboard = () => {
//     return (
//       <>
//         {/* Keep your existing dashboard UI here */}
//         <div className="stats-container">
//           {/* Your existing stats cards */}
//         </div>
        
//         {/* Tables section */}
//         <div className="tables-section">
//           {/* Your existing tables grid */}
//         </div>
        
//         {/* Orders section */}
//         <div className="orders-section">
//           {/* Your existing orders grid */}
//         </div>
//       </>
//     )
//   }

//   // Render Menu Management Module
//   const renderMenuManagement = () => {
//     return (
//       <div className="module-container">
//         <div className="module-header">
//           <h2>Menu Management</h2>
//           <button onClick={() => changeModule('dashboard')} className="back-btn">
//             ← Back to Dashboard
//           </button>
//         </div>
        
//         <div className="menu-management">
//           {/* Add Menu Item Form */}
//           <div className="card add-menu-form">
//             <h3>Add New Menu Item</h3>
//             <form onSubmit={handleAddMenuItem}>
//               <div className="form-row">
//                 <input
//                   type="text"
//                   placeholder="Item Name"
//                   value={menuForm.name}
//                   onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
//                   required
//                 />
//                 <input
//                   type="number"
//                   placeholder="Price"
//                   value={menuForm.price}
//                   onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
//                   required
//                 />
//               </div>
              
//               <div className="form-row">
//                 <select
//                   value={menuForm.category}
//                   onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
                
//                 <select
//                   value={menuForm.isVeg}
//                   onChange={(e) => setMenuForm({...menuForm, isVeg: e.target.value === 'true'})}
//                 >
//                   <option value="true">🟢 Veg</option>
//                   <option value="false">🔴 Non-Veg</option>
//                 </select>
//               </div>
              
//               <textarea
//                 placeholder="Description"
//                 value={menuForm.description}
//                 onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
//                 rows={3}
//               />
              
//               <input
//                 type="text"
//                 placeholder="Image URL (optional)"
//                 value={menuForm.imageUrl}
//                 onChange={(e) => setMenuForm({...menuForm, imageUrl: e.target.value})}
//               />
              
//               <div className="form-row">
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={menuForm.isAvailable}
//                     onChange={(e) => setMenuForm({...menuForm, isAvailable: e.target.checked})}
//                   />
//                   Available
//                 </label>
                
//                 <button type="submit" className="btn-primary">Add Item</button>
//               </div>
//             </form>
//           </div>
          
//           {/* Menu Items List */}
//           <div className="card menu-list">
//             <h3>Menu Items ({menuItems.length})</h3>
//             {menuLoading ? (
//               <div className="loading">Loading menu items...</div>
//             ) : (
//               <div className="items-grid">
//                 {menuItems.map(item => (
//                   <div key={item._id} className="menu-item-card">
//                     <div className="menu-item-header">
//                       <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
//                         {item.isVeg ? '🟢' : '🔴'}
//                       </span>
//                       <h4>{item.name}</h4>
//                       <span className="price">₹{item.price}</span>
//                     </div>
//                     <p className="description">{item.description}</p>
//                     <div className="menu-item-footer">
//                       <span className="category">{item.category}</span>
//                       <span className={`availability ${item.isAvailable ? 'available' : 'unavailable'}`}>
//                         {item.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                       <button 
//                         onClick={() => handleDeleteMenuItem(item._id)}
//                         className="delete-btn"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Render Inventory Management Module
//   const renderInventoryManagement = () => {
//     return (
//       <div className="module-container">
//         <div className="module-header">
//           <h2>Inventory Management</h2>
//           <button onClick={() => changeModule('dashboard')} className="back-btn">
//             ← Back to Dashboard
//           </button>
//         </div>
        
//         <div className="inventory-management">
//           {/* Add Inventory Item Form */}
//           <div className="card add-inventory-form">
//             <h3>Add New Inventory Item</h3>
//             <form onSubmit={handleAddInventoryItem}>
//               <div className="form-row">
//                 <input
//                   type="text"
//                   placeholder="Item Name"
//                   value={inventoryForm.name}
//                   onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})}
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="Category"
//                   value={inventoryForm.category}
//                   onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})}
//                   required
//                 />
//               </div>
              
//               <div className="form-row">
//                 <input
//                   type="number"
//                   placeholder="Current Stock"
//                   value={inventoryForm.currentStock}
//                   onChange={(e) => setInventoryForm({...inventoryForm, currentStock: e.target.value})}
//                   required
//                 />
//                 <input
//                   type="number"
//                   placeholder="Min Stock Level"
//                   value={inventoryForm.minStockLevel}
//                   onChange={(e) => setInventoryForm({...inventoryForm, minStockLevel: e.target.value})}
//                   required
//                 />
//               </div>
              
//               <div className="form-row">
//                 <select
//                   value={inventoryForm.unit}
//                   onChange={(e) => setInventoryForm({...inventoryForm, unit: e.target.value})}
//                 >
//                   <option value="pcs">Pieces</option>
//                   <option value="kg">Kilograms</option>
//                   <option value="liters">Liters</option>
//                   <option value="packets">Packets</option>
//                 </select>
                
//                 <input
//                   type="number"
//                   placeholder="Price per unit"
//                   value={inventoryForm.pricePerUnit}
//                   onChange={(e) => setInventoryForm({...inventoryForm, pricePerUnit: e.target.value})}
//                 />
//               </div>
              
//               <input
//                 type="text"
//                 placeholder="Supplier"
//                 value={inventoryForm.supplier}
//                 onChange={(e) => setInventoryForm({...inventoryForm, supplier: e.target.value})}
//               />
              
//               <button type="submit" className="btn-primary">Add to Inventory</button>
//             </form>
//           </div>
          
//           {/* Inventory Items List */}
//           <div className="card inventory-list">
//             <h3>Inventory Items ({inventoryItems.length})</h3>
//             {inventoryLoading ? (
//               <div className="loading">Loading inventory...</div>
//             ) : (
//               <div className="inventory-table-container">
//                 <table className="inventory-table">
//                   <thead>
//                     <tr>
//                       <th>Item Name</th>
//                       <th>Category</th>
//                       <th>Current Stock</th>
//                       <th>Min Stock</th>
//                       <th>Unit</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {inventoryItems.map(item => (
//                       <tr key={item._id} className={item.currentStock <= item.minStockLevel ? 'low-stock' : ''}>
//                         <td>{item.name}</td>
//                         <td>{item.category}</td>
//                         <td>
//                           <div className="stock-control">
//                             <button 
//                               onClick={() => handleUpdateStock(item._id, item.currentStock - 1)}
//                               className="stock-btn"
//                             >
//                               -
//                             </button>
//                             <span>{item.currentStock}</span>
//                             <button 
//                               onClick={() => handleUpdateStock(item._id, item.currentStock + 1)}
//                               className="stock-btn"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </td>
//                         <td>{item.minStockLevel}</td>
//                         <td>{item.unit}</td>
//                         <td>
//                           <span className={`stock-status ${
//                             item.currentStock === 0 ? 'out-of-stock' :
//                             item.currentStock <= item.minStockLevel ? 'low-stock' : 'in-stock'
//                           }`}>
//                             {item.currentStock === 0 ? 'Out of Stock' :
//                              item.currentStock <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
//                           </span>
//                         </td>
//                         <td>
//                           <button className="btn-small">Order</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Render Analytics Module
//   const renderAnalytics = () => {
//     return (
//       <div className="module-container">
//         <div className="module-header">
//           <h2>Analytics & Reports</h2>
//           <button onClick={() => changeModule('dashboard')} className="back-btn">
//             ← Back to Dashboard
//           </button>
//         </div>
        
//         <div className="analytics-management">
//           {/* Date Range Selector */}
//           <div className="card date-range-selector">
//             <h3>Select Date Range</h3>
//             <div className="form-row">
//               <input
//                 type="date"
//                 value={dateRange.start}
//                 onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
//               />
//               <span>to</span>
//               <input
//                 type="date"
//                 value={dateRange.end}
//                 onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
//               />
//               <button onClick={fetchAnalyticsData} className="btn-primary">
//                 Apply
//               </button>
//             </div>
//           </div>
          
//           {/* Analytics Dashboard */}
//           <div className="analytics-dashboard">
//             {/* Sales Summary */}
//             <div className="card analytics-card">
//               <h3>Sales Summary</h3>
//               <div className="analytics-stats">
//                 <div className="stat-item">
//                   <div className="stat-label">Total Revenue</div>
//                   <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-label">Today's Revenue</div>
//                   <div className="stat-value">₹{stats.todayRevenue.toFixed(2)}</div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-label">Avg Order Value</div>
//                   <div className="stat-value">₹{stats.averageOrderValue.toFixed(2)}</div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-label">Total Orders</div>
//                   <div className="stat-value">{stats.totalOrders}</div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Top Selling Items */}
//             <div className="card analytics-card">
//               <h3>Top Selling Items</h3>
//               <div className="top-items-list">
//                 {analyticsData.topSellingItems.map((item, index) => (
//                   <div key={index} className="top-item">
//                     <span className="rank">{index + 1}</span>
//                     <span className="item-name">{item.name}</span>
//                     <span className="item-sales">{item.sales} sold</span>
//                     <span className="item-revenue">₹{item.revenue}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {/* Category-wise Sales */}
//             <div className="card analytics-card">
//               <h3>Category-wise Sales</h3>
//               <div className="category-sales">
//                 {analyticsData.categoryWiseSales.map((category, index) => (
//                   <div key={index} className="category-item">
//                     <div className="category-header">
//                       <span className="category-name">{category.name}</span>
//                       <span className="category-percentage">{category.percentage}%</span>
//                     </div>
//                     <div className="progress-bar">
//                       <div 
//                         className="progress-fill"
//                         style={{width: `${category.percentage}%`}}
//                       ></div>
//                     </div>
//                     <div className="category-footer">
//                       <span>₹{category.revenue}</span>
//                       <span>{category.orders} orders</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {/* Customer Analytics */}
//             <div className="card analytics-card">
//               <h3>Customer Analytics</h3>
//               <div className="customer-stats">
//                 <div className="customer-stat">
//                   <div className="customer-stat-label">Total Customers</div>
//                   <div className="customer-stat-value">{analyticsData.customerStats.totalCustomers}</div>
//                 </div>
//                 <div className="customer-stat">
//                   <div className="customer-stat-label">Repeat Customers</div>
//                   <div className="customer-stat-value">{analyticsData.customerStats.repeatCustomers}</div>
//                 </div>
//                 <div className="customer-stat">
//                   <div className="customer-stat-label">Avg Visit Value</div>
//                   <div className="customer-stat-value">₹{analyticsData.customerStats.averageVisitValue.toFixed(2)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="login-container">
//         <div className="login-box">
//           <h1>🔐 Reception Dashboard</h1>
//           <form onSubmit={handleLogin}>
//             {loginError && <div className="error-message">{loginError}</div>}
//             <input
//               type="text"
//               value={loginForm.username}
//               onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
//               placeholder="Username"
//               required
//             />
//             <input
//               type="password"
//               value={loginForm.password}
//               onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
//               placeholder="Password"
//               required
//             />
//             <button type="submit">Sign In</button>
//           </form>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="reception-dashboard">
//       {/* Notification Sound */}
//       <audio ref={audioRef} preload="auto">
//         <source src="/notification-sound.mp3" type="audio/mpeg" />
//       </audio>

//       {/* Notification Popup */}
//       {showNotification && newOrder && (
//         <div className="new-order-popup">
//           <button onClick={() => setShowNotification(false)}>×</button>
//           <h4>🎉 New Order #{newOrder.orderNumber}</h4>
//           <p>Table {newOrder.tableNumber} • {newOrder.customerName}</p>
//         </div>
//       )}

//       {/* Header with Hamburger Menu */}
//       <header className="dashboard-header">
//         <div className="header-top">
//           <div className="header-left">
//             <button className="hamburger-btn" onClick={toggleMenu}>
//               {isMenuOpen ? '✕' : '☰'}
//             </button>
//             <h1>Reception Dashboard</h1>
//           </div>
//           <div className="header-actions">
//             <span className="connection-status">
//               {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
//             </span>
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="module-tabs">
//           <button 
//             className={`tab-btn ${activeModule === 'dashboard' ? 'active' : ''}`}
//             onClick={() => changeModule('dashboard')}
//           >
//             📊 Dashboard
//           </button>        
//           <button 
//             className={`tab-btn ${activeModule === 'menu' ? 'active' : ''}`}
//             onClick={() => changeModule('menu')}
//           >
//             🍽️ Menu
//           </button>
//           <button 
//             className={`tab-btn ${activeModule === 'inventory' ? 'active' : ''}`}
//             onClick={() => changeModule('inventory')}
//           >
//             📦 Inventory
//           </button>
//           <button 
//             className={`tab-btn ${activeModule === 'analytics' ? 'active' : ''}`}
//             onClick={() => changeModule('analytics')}
//           >
//             📈 Analytics
//           </button>
//         </div>
//       </header>

//       {/* Hamburger Sidebar Menu */}
//       <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <h3>Restaurant Management</h3>
//           <button className="close-menu" onClick={toggleMenu}>×</button>
//         </div>
        
//         <div className="sidebar-items">
//           <div className="sidebar-section">
//             <h4>Main Modules</h4>
//             <button 
//               className={`sidebar-item ${activeModule === 'dashboard' ? 'active' : ''}`}
//               onClick={() => changeModule('dashboard')}
//             >
//               📊 Dashboard
//             </button>
//             <button 
//               className={`sidebar-item ${activeModule === 'menu' ? 'active' : ''}`}
//               onClick={() => changeModule('menu')}
//             >
//               🍽️ Menu Management
//             </button>
//             <button 
//               className={`sidebar-item ${activeModule === 'inventory' ? 'active' : ''}`}
//               onClick={() => changeModule('inventory')}
//             >
//               📦 Inventory Management
//             </button>
//             <button 
//               className={`sidebar-item ${activeModule === 'analytics' ? 'active' : ''}`}
//               onClick={() => changeModule('analytics')}
//             >
//               📈 Analytics & Reports
//             </button>
//           </div>
          
//           <div className="sidebar-section">
//             <h4>Quick Actions</h4>
//             <button className="sidebar-item" onClick={() => {/* Add table */}}>
//               ➕ Add New Table
//             </button>
//             <button className="sidebar-item" onClick={() => {/* Print report */}}>
//               🖨️ Print Today's Report
//             </button>
//             <button className="sidebar-item" onClick={() => {/* View all orders */}}>
//               📋 View All Orders
//             </button>
//           </div>
          
//           <div className="sidebar-section">
//             <h4>Settings</h4>
//             <button className="sidebar-item" onClick={() => {/* Settings */}}>
//               ⚙️ System Settings
//             </button>
//             <button className="sidebar-item" onClick={() => {/* Users */}}>
//               👥 User Management
//             </button>
//             <button className="sidebar-item" onClick={handleLogout}>
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <main className="main-content">
//         {renderModule()}
//       </main>

//       {/* Overlay for mobile menu */}
//       {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
//     </div>
//   )
// }

// export default ReceptionDashboard