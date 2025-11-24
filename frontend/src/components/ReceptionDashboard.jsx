

// import React, { useState, useEffect, useRef } from 'react'
// import { Link } from 'react-router-dom'
// import io from 'socket.io-client'
// import axios from 'axios'
// import './ReceptionDashboard.css'

// const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'
// // const API_BASE_URL = 'http://localhost:5000/api'

// const ADMIN_CREDENTIALS = {
//   username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
//   password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
// }

// const ReceptionDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loginForm, setLoginForm] = useState({ username: '', password: '' })
//   const [loginError, setLoginError] = useState('')
//   const [showNotification, setShowNotification] = useState(false)
//   const [newOrder, setNewOrder] = useState(null)
//   const [audioPermissionGranted, setAudioPermissionGranted] = useState(false)
//   const notificationTimeoutRef = useRef(null)
//   const audioRef = useRef(null)
//   const [updatingOrders, setUpdatingOrders] = useState(new Set())
//   const socketRef = useRef(null)

//   // Dashboard State
//   const [orders, setOrders] = useState([])
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Debug function to check API response
//   const debugAPIResponse = (data) => {
//     console.log('🔍 DEBUG API RESPONSE:')
//     console.log('Full response:', data)
//     console.log('Type of data:', typeof data)
//     console.log('Is array:', Array.isArray(data))
//     console.log('Keys:', Object.keys(data))
//     if (data && typeof data === 'object') {
//       console.log('Data properties:', Object.keys(data))
//     }
//   }

//   // SIMPLIFIED fetchOrders function
//   const fetchOrders = async () => {
//     try {
//       console.log('🔄 FETCHING ORDERS FROM:', `${API_BASE_URL}/orders`)
//       setLoading(true)
//       setError('')
      
//       const response = await axios.get(`${API_BASE_URL}/orders`)
      
//       console.log('✅ RAW API RESPONSE:', response)
//       console.log('📦 RESPONSE DATA:', response.data)
      
//       // Debug the response
//       debugAPIResponse(response.data)
      
//       let ordersData = []
      
//       // Handle different response formats
//       if (Array.isArray(response.data)) {
//         ordersData = response.data
//         console.log('✅ Using direct array from response.data')
//       } else if (response.data.orders && Array.isArray(response.data.orders)) {
//         ordersData = response.data.orders
//         console.log('✅ Using orders array from response.data.orders')
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         ordersData = response.data.data
//         console.log('✅ Using data array from response.data.data')
//       } else {
//         console.warn('⚠️ Unexpected response format:', response.data)
//         // Try to extract any array from the response
//         const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val))
//         if (possibleArrays.length > 0) {
//           ordersData = possibleArrays[0]
//           console.log('✅ Found array in response:', Object.keys(response.data).find(key => Array.isArray(response.data[key])))
//         }
//       }
      
//       console.log(`🎯 FINAL ORDERS DATA:`, ordersData)
//       console.log(`📊 Number of orders: ${ordersData.length}`)
      
//       if (ordersData.length > 0) {
//         console.log('📝 Sample order:', ordersData[0])
//       }
      
//       setOrders(ordersData)
//       calculateStatsFromOrders(ordersData)
      
//     } catch (error) {
//       console.error('❌ ERROR FETCHING ORDERS:', error)
//       console.error('Error details:', error.response?.data || error.message)
//       setError(`Failed to load orders: ${error.message}`)
//       setOrders([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculate stats from orders
//   const calculateStatsFromOrders = (ordersData) => {
//     try {
//       const totalOrders = ordersData.length
//       const pendingOrders = ordersData.filter(order => 
//         ['pending', 'confirmed', 'preparing'].includes(order.status)
//       ).length
//       const totalRevenue = ordersData
//         .filter(order => order.status !== 'cancelled')
//         .reduce((total, order) => total + (order.finalTotal || order.totalAmount || 0), 0)

//       setStats({ totalOrders, pendingOrders, totalRevenue })
//     } catch (error) {
//       console.error('Error calculating stats:', error)
//     }
//   }

//  // FIXED: Update order status with proper backend sync
// // const updateOrderStatus = async (orderNumber, newStatus) => {
// //   try {
// //     console.log('🔄 Updating order status:', { orderNumber, newStatus });
// //     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

// //     // Find the order
// //     const order = orders.find(o => o.orderNumber === orderNumber);
    
// //     if (!order) {
// //       alert('Order not found in local data.');
// //       return;
// //     }

// //     // Store the original status in case we need to revert
// //     const originalStatus = order.status;

// //     // 1. First update backend
// //     console.log('📡 Sending update to backend...');
// //     const response = await axios.patch(
// //       `${API_BASE_URL}/orders/order-number/${orderNumber}/status`, 
// //       { status: newStatus }
// //     );

// //     console.log('✅ Backend update successful:', response.data);

// //     // 2. Only update local state after backend confirms
// //     setOrders(prev => {
// //       const updatedOrders = prev.map(order => 
// //         order.orderNumber === orderNumber 
// //           ? { 
// //               ...order, 
// //               status: newStatus,
// //               updatedAt: new Date().toISOString()
// //             }
// //           : order
// //       );
      
// //       calculateStatsFromOrders(updatedOrders);
// //       return updatedOrders;
// //     });

// //     console.log('✅ Order status updated successfully');

// //     // 3. Emit socket event for real-time updates
// //     if (socketRef.current) {
// //       socketRef.current.emit('order-status-update', {
// //         orderNumber,
// //         status: newStatus
// //       });
// //     }

// //   } catch (error) {
// //     console.error('❌ Error updating order status:', error);
    
// //     // Show detailed error information
// //     const errorMessage = error.response?.data?.message || error.message;
// //     console.error('Error details:', {
// //       status: error.response?.status,
// //       data: error.response?.data,
// //       message: errorMessage
// //     });

// //     // Revert local state to original status
// //     setOrders(prev => {
// //       const revertedOrders = prev.map(order => 
// //         order.orderNumber === orderNumber 
// //           ? { ...order, status: originalStatus }
// //           : order
// //       );
      
// //       calculateStatsFromOrders(revertedOrders);
// //       return revertedOrders;
// //     });

// //     alert(`Failed to update order status: ${errorMessage}`);
    
// //   } finally {
// //     setUpdatingOrders(prev => {
// //       const newSet = new Set(prev);
// //       newSet.delete(orderNumber);
// //       return newSet;
// //     });
// //   }
// // };

// // FIXED: Update order status with proper backend sync
// // const updateOrderStatus = async (orderNumber, newStatus) => {
// //   let originalStatus = null;
// //   let originalOrder = null;

// //   try {
// //     console.log('🔄 Updating order status:', { orderNumber, newStatus });
// //     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

// //     // Find the order and store original state
// //     const order = orders.find(o => o.orderNumber === orderNumber);
    
// //     if (!order) {
// //       alert('Order not found in local data.');
// //       return;
// //     }

// //     // Store the original status and order for potential revert
// //     originalStatus = order.status;
// //     originalOrder = { ...order };

// //     // 1. First update backend
// //     console.log('📡 Sending update to backend...');
// //     const response = await axios.patch(
// //       `${API_BASE_URL}/orders/order-number/${orderNumber}/status`, 
// //       { status: newStatus }
// //     );

// //     console.log('✅ Backend update successful:', response.data);

// //     // 2. Only update local state after backend confirms
// //     setOrders(prev => {
// //       const updatedOrders = prev.map(order => 
// //         order.orderNumber === orderNumber 
// //           ? { 
// //               ...order, 
// //               status: newStatus,
// //               updatedAt: new Date().toISOString()
// //             }
// //           : order
// //       );
      
// //       calculateStatsFromOrders(updatedOrders);
// //       return updatedOrders;
// //     });

// //     console.log('✅ Order status updated successfully');

// //     // 3. Emit socket event for real-time updates
// //     if (socketRef.current) {
// //       socketRef.current.emit('order-status-update', {
// //         orderNumber,
// //         status: newStatus
// //       });
// //     }

// //   } catch (error) {
// //     console.error('❌ Error updating order status:', error);
    
// //     // Show detailed error information
// //     const errorMessage = error.response?.data?.message || error.message;
// //     const errorDetails = error.response?.data;
    
// //     console.error('Error details:', {
// //       status: error.response?.status,
// //       data: errorDetails,
// //       message: errorMessage
// //     });

// //     // Revert local state to original status only if we have the original data
// //     if (originalStatus && originalOrder) {
// //       console.log('🔄 Reverting local state due to backend error');
// //       setOrders(prev => {
// //         const revertedOrders = prev.map(order => 
// //           order.orderNumber === orderNumber 
// //             ? { ...originalOrder } // Restore the entire original order object
// //             : order
// //         );
        
// //         calculateStatsFromOrders(revertedOrders);
// //         return revertedOrders;
// //       });
// //     }

// //     // User-friendly error message
// //     let userMessage = `Failed to update order status: ${errorMessage}`;
// //     if (error.response?.status === 500) {
// //       userMessage = 'Server error: Could not update order status. Please try again.';
// //     }
    
// //     alert(userMessage);
    
// //   } finally {
// //     setUpdatingOrders(prev => {
// //       const newSet = new Set(prev);
// //       newSet.delete(orderNumber);
// //       return newSet;
// //     });
// //   }
// // };


// // FIXED: Update order status with proper status mapping
// // const updateOrderStatus = async (orderNumber, newStatus) => {
// //   try {
// //     console.log('🔄 Updating order status:', { orderNumber, newStatus });
// //     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

// //     // Find the order
// //     const order = orders.find(o => o.orderNumber === orderNumber);
    
// //     if (!order) {
// //       alert('Order not found in local data.');
// //       return;
// //     }

// //     // Map frontend status to backend status
// //     const statusMapping = {
// //       'pending': 'active',
// //       'confirmed': 'active', 
// //       'preparing': 'active',
// //       'ready': 'active',
// //       'served': 'billed',
// //       'cancelled': 'cancelled'
// //     };

// //     const backendStatus = statusMapping[newStatus] || newStatus;

// //     console.log('📡 Sending to backend - Frontend:', newStatus, 'Backend:', backendStatus);

// //     // 1. Update backend using the order ID (not orderNumber)
// //     const response = await axios.patch(
// //       `${API_BASE_URL}/orders/${order._id}/status`, 
// //       { status: backendStatus }
// //     );

// //     console.log('✅ Backend update successful:', response.data);

// //     // 2. Update local state with the response from backend
// //     setOrders(prev => {
// //       const updatedOrders = prev.map(order => 
// //         order._id === response.data.data._id 
// //           ? response.data.data // Use the updated order from backend
// //           : order
// //       );
      
// //       calculateStatsFromOrders(updatedOrders);
// //       return updatedOrders;
// //     });

// //     console.log('✅ Order status updated successfully');

// //   } catch (error) {
// //     console.error('❌ Error updating order status:', error);
    
// //     const errorMessage = error.response?.data?.message || error.message;
// //     console.error('Error details:', {
// //       status: error.response?.status,
// //       data: error.response?.data,
// //       message: errorMessage
// //     });

// //     alert(`Failed to update order status: ${errorMessage}`);
    
// //   } finally {
// //     setUpdatingOrders(prev => {
// //       const newSet = new Set(prev);
// //       newSet.delete(orderNumber);
// //       return newSet;
// //     });
// //   }
// // };

// // FIXED: Enhanced updateOrderStatus function with multiple fallback approaches
// const updateOrderStatus = async (orderNumber, newStatus) => {
//   try {
//     console.log('🔄 Updating order status:', { orderNumber, newStatus });
//     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

//     // Find the order
//     const order = orders.find(o => o.orderNumber === orderNumber);
    
//     if (!order) {
//       alert('Order not found in local data.');
//       return;
//     }

//     // Map frontend status to backend status
//     const statusMapping = {
//       'pending': 'active',
//       'confirmed': 'active', 
//       'preparing': 'active',
//       'ready': 'active',
//       'served': 'billed',
//       'cancelled': 'cancelled',
//       'paid': 'paid'
//     };

//     const backendStatus = statusMapping[newStatus] || newStatus;

//     console.log('📡 Status mapping - Frontend:', newStatus, 'Backend:', backendStatus);

//     // Try multiple approaches to update the status
//     let updateSuccessful = false;
//     let response;

//     // Approach 1: Try PATCH with order ID
//     try {
//       console.log('🔄 Attempting PATCH with order ID...');
//       response = await axios.patch(
//         `${API_BASE_URL}/orders/${order._id}/status`, 
//         { status: backendStatus }
//       );
//       updateSuccessful = true;
//       console.log('✅ PATCH with ID successful:', response.data);
//     } catch (error1) {
//       console.log('❌ PATCH with ID failed:', error1.message);
      
//       // Approach 2: Try PUT with order ID
//       try {
//         console.log('🔄 Attempting PUT with order ID...');
//         response = await axios.put(
//           `${API_BASE_URL}/orders/${order._id}/status`, 
//           { status: backendStatus }
//         );
//         updateSuccessful = true;
//         console.log('✅ PUT with ID successful:', response.data);
//       } catch (error2) {
//         console.log('❌ PUT with ID failed:', error2.message);
        
//         // Approach 3: Try updating the entire order
//         try {
//           console.log('🔄 Attempting full order update...');
//           const updatedOrder = { ...order, status: backendStatus };
//           response = await axios.put(
//             `${API_BASE_URL}/orders/${order._id}`, 
//             updatedOrder
//           );
//           updateSuccessful = true;
//           console.log('✅ Full update successful:', response.data);
//         } catch (error3) {
//           console.log('❌ Full update failed:', error3.message);
          
//           // Approach 4: Try PATCH without /status endpoint
//           try {
//             console.log('🔄 Attempting simple PATCH...');
//             response = await axios.patch(
//               `${API_BASE_URL}/orders/${order._id}`, 
//               { status: backendStatus }
//             );
//             updateSuccessful = true;
//             console.log('✅ Simple PATCH successful:', response.data);
//           } catch (error4) {
//             console.log('❌ All backend approaches failed');
//             throw new Error('All update methods failed');
//           }
//         }
//       }
//     }

//     if (updateSuccessful && response) {
//       // Update local state with the response from backend
//       setOrders(prev => {
//         const updatedOrders = prev.map(order => 
//           order._id === response.data.data?._id || order._id === response.data._id
//             ? response.data.data || response.data // Use the updated order from backend
//             : order
//         );
        
//         calculateStatsFromOrders(updatedOrders);
//         return updatedOrders;
//       });

//       console.log('✅ Order status updated successfully');
//     }

//   } catch (error) {
//     console.error('❌ Error updating order status:', error);
    
//     const errorMessage = error.response?.data?.message || error.message;
//     console.error('Error details:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: errorMessage
//     });

//     // Show user-friendly error message
//     let userMessage = `Failed to update order status: ${errorMessage}`;
//     if (errorMessage.includes('All update methods failed')) {
//       userMessage = 'Cannot connect to server. Please check your internet connection and try again.';
//     }
    
//     alert(userMessage);
    
//   } finally {
//     setUpdatingOrders(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(orderNumber);
//       return newSet;
//     });
//   }
// };


// // Table management functions
// const [tables, setTables] = useState([]);
// const [showAddTableModal, setShowAddTableModal] = useState(false);
// const [newTableNumber, setNewTableNumber] = useState('');

// // Fetch tables from backend or create default ones
// const fetchTables = async () => {
//   try {
//     // Try to get tables from backend
//     const response = await axios.get(`${API_BASE_URL}/tables`);
//     if (response.data.success) {
//       setTables(response.data.data);
//     }
//   } catch (error) {
//     console.log('No tables endpoint, using default tables');
//     // Create default tables if none exist
//     const defaultTables = Array.from({ length: 10 }, (_, i) => ({
//       tableNumber: i + 1,
//       status: 'available',
//       capacity: 4
//     }));
//     setTables(defaultTables);
//   }
// };

// // Add new table
// const addNewTable = async () => {
//   try {
//     const tableNum = parseInt(newTableNumber);
//     if (!tableNum || tableNum <= 0) {
//       alert('Please enter a valid table number');
//       return;
//     }

//     // Check if table already exists
//     if (tables.some(table => table.tableNumber === tableNum)) {
//       alert(`Table ${tableNum} already exists`);
//       return;
//     }

//     const newTable = {
//       tableNumber: tableNum,
//       status: 'available',
//       capacity: 4
//     };

//     // Try to save to backend
//     try {
//       await axios.post(`${API_BASE_URL}/tables`, newTable);
//     } catch (error) {
//       console.log('Tables endpoint not available, storing locally');
//     }

//     // Update local state
//     setTables(prev => [...prev, newTable]);
//     setNewTableNumber('');
//     setShowAddTableModal(false);
    
//     alert(`Table ${tableNum} added successfully!`);

//   } catch (error) {
//     console.error('Error adding table:', error);
//     alert('Error adding table: ' + error.message);
//   }
// };

// // Initialize tables on component mount
// useEffect(() => {
//   if (isAuthenticated) {
//     fetchTables();
//   }
// }, [isAuthenticated]);

// // Generate combined bill for all orders from the same table
// const generateCombinedBill = async (tableNumber) => {
//   try {
//     console.log('🧾 Generating combined bill for table:', tableNumber);
    
//     // Get all active orders for this table
//     const tableOrders = orders.filter(order => 
//       order.tableNumber === tableNumber && 
//       order.status !== 'cancelled' && 
//       order.status !== 'paid'
//     );

//     if (tableOrders.length === 0) {
//       alert(`No active orders found for Table ${tableNumber}`);
//       return;
//     }

//     // Combine all items from all orders
//     const combinedItems = [];
//     let totalAmount = 0;
//     let customerName = '';
//     let mobileNumber = '';

//     tableOrders.forEach(order => {
//       // Use the first order's customer info (assuming same customer)
//       if (!customerName) {
//         customerName = order.customerName;
//         mobileNumber = order.mobileNumber;
//       }

//       // Combine items
//       order.items?.forEach(item => {
//         const existingItem = combinedItems.find(combinedItem => 
//           combinedItem.name === item.name && combinedItem.price === item.price
//         );

//         if (existingItem) {
//           existingItem.quantity += item.quantity;
//         } else {
//           combinedItems.push({
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             isVeg: item.isVeg
//           });
//         }
//       });

//       totalAmount += order.totalAmount || 0;
//     });

//     // Create combined order object for printing
//     const combinedOrder = {
//       orderNumber: `COMBINED-${Date.now()}`,
//       tableNumber: tableNumber,
//       customerName: customerName,
//       mobileNumber: mobileNumber,
//       items: combinedItems,
//       totalAmount: totalAmount,
//       taxAmount: totalAmount * 0.05,
//       finalTotal: totalAmount * 1.05,
//       createdAt: new Date().toISOString(),
//       isCombinedBill: true,
//       originalOrders: tableOrders.map(order => order.orderNumber)
//     };

//     console.log('📊 Combined bill details:', combinedOrder);

//     // Show preview of combined bill
//     previewBill(combinedOrder);

//     // Optionally mark all original orders as billed
//     await markOrdersAsBilled(tableOrders);

//   } catch (error) {
//     console.error('❌ Error generating combined bill:', error);
//     alert('Error generating combined bill: ' + error.message);
//   }
// };

// // Mark orders as billed after generating combined bill
// const markOrdersAsBilled = async (ordersToMark) => {
//   try {
//     for (const order of ordersToMark) {
//       await axios.patch(
//         `${API_BASE_URL}/orders/${order._id}/status`, 
//         { status: 'billed' }
//       );
//     }
//     console.log('✅ Marked orders as billed');
    
//     // Refresh orders to update status
//     fetchOrders();
    
//   } catch (error) {
//     console.error('Error marking orders as billed:', error);
//     // Don't show error to user - the bill was still generated
//   }
// };

// // Group orders by table for combined billing
// const getOrdersByTable = () => {
//   const tableGroups = {};
  
//   orders.forEach(order => {
//     if (order.status !== 'cancelled' && order.status !== 'paid') {
//       if (!tableGroups[order.tableNumber]) {
//         tableGroups[order.tableNumber] = [];
//       }
//       tableGroups[order.tableNumber].push(order);
//     }
//   });

//   return tableGroups;
// };

//   // Request audio permission on user interaction
//   useEffect(() => {
//     if (isAuthenticated) {
//       // Add click event listener to grant audio permission
//       const handleUserInteraction = async () => {
//         try {
//           if (audioRef.current) {
//             // Try to play and immediately pause to get permission
//             await audioRef.current.play()
//             audioRef.current.pause()
//             setAudioPermissionGranted(true)
//             console.log('✅ Audio permission granted')
            
//             // Remove event listener after first successful interaction
//             document.removeEventListener('click', handleUserInteraction)
//           }
//         } catch (error) {
//           console.log('🔇 Audio permission not yet granted, waiting for user interaction...')
//         }
//       }

//       document.addEventListener('click', handleUserInteraction)
      
//       return () => {
//         document.removeEventListener('click', handleUserInteraction)
//       }
//     }
//   }, [isAuthenticated])

//   // Play notification sound
//   const playNotificationSound = async () => {
//     if (!audioRef.current) return
    
//     try {
//       audioRef.current.currentTime = 0
//       await audioRef.current.play()
//       console.log('🔊 Notification sound played successfully')
//     } catch (error) {
//       console.log('🔇 Could not play sound:', error)
//       // You can show a visual indicator that sound is muted
//     }
//   }

//   // Debug function to check backend status update
// const debugBackendStatusUpdate = async (orderNumber, newStatus) => {
//   try {
//     console.log('🔧 DEBUG: Testing backend status update');
    
//     const testData = {
//       status: newStatus,
//       debug: true,
//       timestamp: new Date().toISOString()
//     };

//     console.log('📤 Sending data:', testData);
//     console.log('🌐 URL:', `${API_BASE_URL}/orders/order-number/${orderNumber}/status`);

//     const response = await axios.patch(
//       `${API_BASE_URL}/orders/order-number/${orderNumber}/status`,
//       testData,
//       {
//         timeout: 10000,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     console.log('✅ Backend response:', response.data);
//     return response.data;

//   } catch (error) {
//     console.error('❌ Backend debug failed:', error);
//     console.error('Error response:', error.response?.data);
    
//     // Log the exact error from backend
//     if (error.response?.data) {
//       console.error('Backend error details:', JSON.stringify(error.response.data, null, 2));
//     }
    
//     throw error;
//   }
// };

//   // Check authentication
//   useEffect(() => {
//     const authStatus = localStorage.getItem('receptionAuth')
//     if (authStatus === 'authenticated') {
//       setIsAuthenticated(true)
//     }
//   }, [])

//   // Main data fetching effect
//   useEffect(() => {
//     if (!isAuthenticated) return

//     console.log('🚀 INITIALIZING DASHBOARD...')
    
//     const initializeDashboard = async () => {
//       await fetchOrders()
//       setupSocketConnection()
//     }

//     initializeDashboard()

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//       if (notificationTimeoutRef.current) {
//         clearTimeout(notificationTimeoutRef.current)
//       }
//     }
//   }, [isAuthenticated])


//   const setupSocketConnection = () => {
//   try {
//     const socket = io('https://orderflow-backend-v964.onrender.com')
//     socketRef.current = socket
    
//     socket.emit('join-reception')
    
//     socket.on('new-order', (newOrder) => {
//       console.log('🆕 New order via socket:', newOrder)
//       setOrders(prev => {
//         const updatedOrders = [newOrder, ...prev]
//         calculateStatsFromOrders(updatedOrders)
//         return updatedOrders
//       })
      
//       setNewOrder(newOrder)
//       setShowNotification(true)
//       playNotificationSound()
      
//       setTimeout(() => setShowNotification(false), 5000)
//     })

//     socket.on('order-status-updated', (updatedOrder) => {
//       console.log('🔄 Order status updated via socket:', updatedOrder)
      
//       // Update local state with data from backend
//       setOrders(prev => {
//         const updatedOrders = prev.map(order => 
//           order._id === updatedOrder._id ? updatedOrder : order
//         )
//         calculateStatsFromOrders(updatedOrders)
//         return updatedOrders
//       })
//     })

//     // Handle connection errors
//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error)
//     })

//   } catch (error) {
//     console.error('Socket initialization error:', error)
//   }
// }

// // Test API connection
// const testAPIconnection = async () => {
//   try {
//     console.log('🧪 Testing API connection...');
    
//     // Test 1: Check if orders endpoint works
//     const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);
//     console.log('✅ Orders endpoint:', ordersResponse.status);
    
//     // Test 2: Check if status update endpoint exists
//     // Pick a test order number from your existing orders
//     if (orders.length > 0) {
//       const testOrder = orders[0];
//       console.log('🧪 Test order:', testOrder.orderNumber);
      
//       // Just test the endpoint without actually updating
//       const testResponse = await axios.options(`${API_BASE_URL}/orders/order-number/${testOrder.orderNumber}/status`);
//       console.log('✅ Status endpoint available:', testResponse.status);
//     }
    
//   } catch (error) {
//     console.error('❌ API connection test failed:', error);
//     console.log('Error details:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       data: error.response?.data
//     });
//   }
// };

// // Call this in your dashboard temporarily to debug
// useEffect(() => {
//   if (isAuthenticated && orders.length > 0) {
//     testAPIconnection();
//   }
// }, [isAuthenticated, orders.length]);

// // const setupSocketConnection = () => {
// //   try {
// //     const socket = io('https://orderflow-backend-v964.onrender.com')
// //     socketRef.current = socket
    
// //     socket.emit('join-reception')
    
// //     socket.on('new-order', (newOrder) => {
// //       console.log('🆕 New order via socket:', newOrder)
      
// //       // FIX: Use functional update to get latest state
// //       setOrders(prev => {
// //         const updatedOrders = [newOrder, ...prev]
// //         // Calculate stats with the updated orders
// //         calculateStatsFromOrders(updatedOrders)
// //         return updatedOrders
// //       })
      
// //       // Show notification
// //       setNewOrder(newOrder)
// //       setShowNotification(true)
// //       playNotificationSound()
      
// //       // Auto hide notification
// //       setTimeout(() => setShowNotification(false), 5000)
// //     })

// //     socket.on('order-status-updated', (updatedOrder) => {
// //       console.log('🔄 Order status updated:', updatedOrder)
      
// //       // FIX: Use functional update for status changes too
// //       setOrders(prev => {
// //         const updatedOrders = prev.map(order => 
// //           order._id === updatedOrder._id ? updatedOrder : order
// //         )
// //         calculateStatsFromOrders(updatedOrders)
// //         return updatedOrders
// //       })
// //     })

// //   } catch (error) {
// //     console.error('Socket error:', error)
// //   }
// // }
 

// // Client-side only status update (temporary solution)
// // const updateOrderStatus = async (orderNumber, newStatus) => {
// //   try {
// //     console.log('🔄 Updating order status locally:', { orderNumber, newStatus });
// //     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

// //     const order = orders.find(o => o.orderNumber === orderNumber);
    
// //     if (!order) {
// //       alert('Order not found in local data.');
// //       return;
// //     }

// //     // Update local state immediately (client-side only)
// //     setOrders(prev => {
// //       const updatedOrders = prev.map(order => 
// //         order.orderNumber === orderNumber 
// //           ? { 
// //               ...order, 
// //               status: newStatus,
// //               updatedAt: new Date().toISOString() // Add update timestamp
// //             }
// //           : order
// //       );
      
// //       // Recalculate stats with updated orders
// //       calculateStatsFromOrders(updatedOrders);
// //       return updatedOrders;
// //     });

// //     console.log('✅ Order status updated locally');

// //     // Try to update backend, but don't block if it fails
// //     try {
// //       await updateOrderStatusInBackend(orderNumber, newStatus, order._id);
// //     } catch (backendError) {
// //       console.warn('⚠️ Backend update failed, but local state updated:', backendError.message);
// //       // Don't show error to user since local state is updated
// //     }

// //   } catch (error) {
// //     console.error('❌ Error updating order status:', error);
// //     alert('Error updating order status. Please try again.');
// //   } finally {
// //     setUpdatingOrders(prev => {
// //       const newSet = new Set(prev);
// //       newSet.delete(orderNumber);
// //       return newSet;
// //     });
// //   }
// // };

// // Separate function to try backend update (non-blocking)
// const updateOrderStatusInBackend = async (orderNumber, newStatus, orderId) => {
//   try {
//     console.log('🔄 Attempting backend update...');
    
//     // Try different approaches
//     const approaches = [
//       // Approach 1: PATCH with status
//       () => axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }),
      
//       // Approach 2: PUT with status  
//       () => axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }),
      
//       // Approach 3: Update entire order
//       () => {
//         const order = orders.find(o => o.orderNumber === orderNumber);
//         const updatedOrder = { ...order, status: newStatus };
//         return axios.put(`${API_BASE_URL}/orders/${orderId}`, updatedOrder);
//       },
      
//       // Approach 4: Different field name
//       () => axios.patch(`${API_BASE_URL}/orders/${orderId}`, { orderStatus: newStatus }),
      
//       // Approach 5: Simple field update
//       () => axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status: newStatus })
//     ];

//     for (let i = 0; i < approaches.length; i++) {
//       try {
//         const response = await approaches[i]();
//         console.log(`✅ Backend update successful (approach ${i + 1}):`, response.data);
//         return response.data;
//       } catch (error) {
//         console.warn(`❌ Backend approach ${i + 1} failed:`, error.response?.status);
//         // Continue to next approach
//       }
//     }
    
//     throw new Error('All backend approaches failed');
    
//   } catch (error) {
//     console.warn('⚠️ Backend update failed completely, but local state is preserved');
//     // Don't throw error - local state is already updated
//   }
// };

// // Debug function to check order data
// const debugOrderStatus = (order) => {
//   console.log('🔍 Order Debug:', {
//     orderNumber: order.orderNumber,
//     currentStatus: order.status,
//     orderId: order._id,
//     hasItems: !!order.items,
//     itemsCount: order.items?.length
//   });
// };

// // Call this in your orders.map temporarily to debug:
// {orders.map(order => {
//   debugOrderStatus(order); // Remove this after debugging
//   return (
//     <div key={order._id} className="order-card">
//       // ... rest of your order card

//     </div>
//   );
// })}


// // Print bill function for thermal printers
// const printBill = async (order) => {
//   try {
//     console.log('🖨️ Printing bill for order:', order.orderNumber);
    
//     // Check if Web Bluetooth API is available
//     if (!navigator.bluetooth) {
//       alert('Web Bluetooth is not supported in this browser. Please use Chrome or Edge.');
//       return;
//     }

//     // Request Bluetooth device
//     const device = await navigator.bluetooth.requestDevice({
//       acceptAllDevices: true,
//       optionalServices: ['generic_access']
//     });

//     console.log('📱 Connected to device:', device.name);
    
//     // Create ESC/POS commands for thermal printer
//     const billContent = generateBillContent(order);
    
//     // Convert to Uint8Array for Bluetooth
//     const encoder = new TextEncoder();
//     const data = encoder.encode(billContent);
    
//     // Send to printer (this is a simplified version)
//     // Note: Actual implementation depends on your printer's Bluetooth service
//     alert(`Bill for Order #${order.orderNumber} sent to printer!`);
    
//   } catch (error) {
//     console.error('❌ Print error:', error);
    
//     if (error.name === 'NotFoundError') {
//       alert('No Bluetooth printer found. Please make sure your printer is paired and in range.');
//     } else if (error.name === 'NotAllowedError') {
//       alert('Bluetooth permission denied. Please allow Bluetooth access.');
//     } else {
//       alert('Failed to print bill: ' + error.message);
//     }
//   }
// };

// // Generate ESC/POS formatted bill content
// // const generateBillContent = (order) => {
// //   const lineBreak = '\n';
// //   const doubleLineBreak = '\n\n';
// //   const separator = '--------------------------------';
  
// //   // ESC/POS commands
// //   const ESC = '\x1B';
// //   const initialize = ESC + '@';
// //   const centerAlign = ESC + '\x61\x01';
// //   const leftAlign = ESC + '\x61\x00';
// //   const boldOn = ESC + '\x45\x01';
// //   const boldOff = ESC + '\x45\x00';
// //   const doubleHeight = ESC + '\x21\x30';
// //   const normalText = ESC + '\x21\x00';
  
// //   let bill = initialize;
  
// //   // Header
// //   bill += centerAlign + boldOn + doubleHeight;
// //   bill += 'AMORE MIO' + lineBreak;
// //   bill += boldOff + normalText;
// //   bill += 'Restaurant & Cafe' + lineBreak;
// //   bill += '-------------------' + doubleLineBreak;
  
// //   // Order details
// //   bill += leftAlign;
// //   bill += `Order #: ${order.orderNumber}` + lineBreak;
// //   bill += `Date: ${new Date(order.createdAt).toLocaleDateString()}` + lineBreak;
// //   bill += `Time: ${new Date(order.createdAt).toLocaleTimeString()}` + lineBreak;
// //   bill += `Table: ${order.tableNumber}` + lineBreak;
// //   bill += `Customer: ${order.customerName}` + lineBreak;
// //   bill += separator + doubleLineBreak;
  
// //   // Items header
// //   bill += boldOn;
// //   bill += 'ITEMS' + lineBreak;
// //   bill += boldOff;
// //   bill += separator + lineBreak;
  
// //   // Items list
// //   order.items?.forEach(item => {
// //     const itemName = item.name || item.menuItem?.name || 'Item';
// //     const quantity = item.quantity || 1;
// //     const price = item.price || 0;
// //     const total = price * quantity;
    
// //     bill += `${quantity}x ${itemName}` + lineBreak;
// //     bill += `    ₹${price} x ${quantity} = ₹${total}` + lineBreak;
// //   });
  
// //   bill += separator + doubleLineBreak;
  
// //   // Totals
// //   bill += boldOn;
// //   bill += 'TOTAL: ₹' + (order.finalTotal || order.totalAmount || 0) + lineBreak;
// //   bill += boldOff;
  
// //   // Tax and discount breakdown
// //   if (order.taxAmount > 0) {
// //     bill += `Tax: ₹${order.taxAmount || 0}` + lineBreak;
// //   }
// //   if (order.discountAmount > 0) {
// //     bill += `Discount: -₹${order.discountAmount || 0}` + lineBreak;
// //   }
  
// //   bill += doubleLineBreak;
// //   bill += separator + doubleLineBreak;
  
// //   // Footer
// //   bill += centerAlign;
// //   bill += 'Thank you for visiting!' + lineBreak;
// //   bill += 'We hope to see you again soon.' + doubleLineBreak;
// //   bill += doubleLineBreak + doubleLineBreak + doubleLineBreak; // Paper cut
  
// //   return bill;
// // };

// // Alternative: Print using browser print dialog (fallback)
// const printBrowserBill = (order) => {
//   const billWindow = window.open('', '_blank');
//   const billContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Bill - Order #${order.orderNumber}</title>
//       <style>
//         body { 
//           font-family: 'Courier New', monospace; 
//           width: 80mm; 
//           margin: 0; 
//           padding: 10px;
//           font-size: 14px;
//         }
//         .header { text-align: center; font-weight: bold; font-size: 16px; }
//         .separator { border-bottom: 1px dashed #000; margin: 10px 0; }
//         .item { display: flex; justify-content: space-between; margin: 5px 0; }
//         .total { font-weight: bold; margin-top: 10px; }
//         .footer { text-align: center; margin-top: 20px; font-style: italic; }
//         @media print {
//           body { width: 80mm !important; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h2>AMORE MIO</h2>
//         <p>Restaurant & Cafe</p>
//       </div>
//       <div class="separator"></div>
      
//       <p><strong>Order #:</strong> ${order.orderNumber}</p>
//       <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
//       <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString()}</p>
//       <p><strong>Table:</strong> ${order.tableNumber}</p>
//       <p><strong>Customer:</strong> ${order.customerName}</p>
      
//       <div class="separator"></div>
      
//       <h3>ITEMS</h3>
//       ${order.items?.map(item => {
//         const itemName = item.name || item.menuItem?.name || 'Item';
//         const quantity = item.quantity || 1;
//         const price = item.price || 0;
//         const total = price * quantity;
//         return `
//           <div class="item">
//             <span>${quantity}x ${itemName}</span>
//             <span>₹${total}</span>
//           </div>
//           <div style="font-size: 12px; margin-left: 20px;">₹${price} x ${quantity}</div>
//         `;
//       }).join('')}
      
//       <div class="separator"></div>
      
//       <div class="total">
//         <div class="item">
//           <span>TOTAL:</span>
//           <span>₹${order.finalTotal || order.totalAmount || 0}</span>
//         </div>
//       </div>
      
//       ${order.taxAmount > 0 ? `<p>Tax: ₹${order.taxAmount}</p>` : ''}
//       ${order.discountAmount > 0 ? `<p>Discount: -₹${order.discountAmount}</p>` : ''}
      
//       <div class="footer">
//         <p>Thank you for visiting!</p>
//         <p>We hope to see you again soon.</p>
//       </div>
//     </body>
//     </html>
//   `;
  
//   billWindow.document.write(billContent);
//   billWindow.document.close();
//   billWindow.print();
//   billWindow.close();
// };



// // Enhanced Bluetooth printing function
// const printBillEnhanced = async (order) => {
//   try {
//     console.log('🖨️ Printing bill for order:', order.orderNumber);
    
//     if (!navigator.bluetooth) {
//       // Fallback to browser print
//       printBrowserBill(order);
//       return;
//     }

//     // For common thermal printers, try these services
//     const device = await navigator.bluetooth.requestDevice({
//       filters: [
//         { namePrefix: 'BT' },
//         { namePrefix: 'Printer' },
//         { namePrefix: 'POS' }
//       ],
//       optionalServices: [
//         '000018f0-0000-1000-8000-00805f9b34fb', // Common POS service
//         '00001101-0000-1000-8000-00805f9b34fb'  // Serial Port Profile
//       ]
//     });

//     const server = await device.gatt.connect();
//     console.log('✅ Connected to GATT server');
    
//     // Try different services
//     let service;
//     try {
//       service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
//     } catch (e) {
//       service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
//     }
    
//     const characteristics = await service.getCharacteristics();
//     console.log('📋 Found characteristics:', characteristics.length);
    
//     // Find a writable characteristic
//     const characteristic = characteristics.find(char => 
//       char.properties.write || char.properties.writeWithoutResponse
//     );
    
//     if (characteristic) {
//       const billContent = generateBillContent(order);
//       const encoder = new TextEncoder();
//       const data = encoder.encode(billContent);
      
//       await characteristic.writeValue(data);
//       alert(`✅ Bill printed successfully for Order #${order.orderNumber}`);
//     } else {
//       throw new Error('No writable characteristic found');
//     }
    
//     await server.disconnect();
    
//   } catch (error) {
//     console.error('❌ Bluetooth print failed:', error);
    
//     // Fallback to browser printing
//     console.log('🔄 Falling back to browser print...');
//     printBrowserBill(order);
//   }
// };

// // Test print function that simulates Bluetooth printing
// const testPrintBill = async (order) => {
//   try {
//     console.log('🧪 Testing print for order:', order.orderNumber);
    
//     // Simulate Bluetooth connection process
//     alert('🔍 Searching for Bluetooth printers...');
    
//     // Simulate delay for Bluetooth connection
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Show what would be sent to printer
//     const billContent = generateBillContent(order);
    
//     const testWindow = window.open('', '_blank', 'width=400,height=700');
//     testWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Print Test - Order #${order.orderNumber}</title>
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             padding: 20px; 
//             background: #f0f8ff;
//           }
//           .test-container {
//             background: white;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           }
//           .status {
//             background: #4CAF50;
//             color: white;
//             padding: 10px;
//             border-radius: 4px;
//             text-align: center;
//             margin-bottom: 20px;
//           }
//           .thermal-output {
//             background: white;
//             border: 2px solid #333;
//             padding: 15px;
//             font-family: 'Courier New', monospace;
//             font-size: 12px;
//             line-height: 1.3;
//             white-space: pre;
//             background: linear-gradient(white, white) padding-box,
//                         repeating-linear-gradient(0deg, #f0f0f0, #f0f0f0 1px, white 1px, white 20px);
//             background-size: 100% 20px;
//             min-height: 400px;
//           }
//           .bluetooth-info {
//             background: #e3f2fd;
//             padding: 15px;
//             border-radius: 4px;
//             margin-top: 20px;
//             font-size: 14px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="test-container">
//           <div class="status">
//             ✅ PRINT TEST SUCCESSFUL
//           </div>
          
//           <h3>What would be sent to Bluetooth printer:</h3>
//           <div class="thermal-output">
// ${billContent}
//           </div>
          
//           <div class="bluetooth-info">
//             <strong>Bluetooth Simulation:</strong><br>
//             • Device: Thermal Printer (Simulated)<br>
//             • Service: ESC/POS Protocol<br>
//             • Data Sent: ${billContent.length} characters<br>
//             • Order: #${order.orderNumber}<br>
//             • Status: Printed successfully ✅
//           </div>
          
//           <div style="text-align: center; margin-top: 20px;">
//             <button onclick="window.print()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
//               Print This Preview
//             </button>
//             <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
//               Close
//             </button>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//     testWindow.document.close();
    
//   } catch (error) {
//     console.error('Test print error:', error);
//     alert('Test print failed: ' + error.message);
//   }
// };

// // Add this function to preview the bill
// const previewBill = (order) => {
//   const billContent = generateBillContent(order);
  
//   // Create a preview window
//   const previewWindow = window.open('', '_blank', 'width=400,height=600');
  
//   previewWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Bill Preview - Order #${order.orderNumber}</title>
//       <style>
//         body {
//           font-family: 'Courier New', monospace;
//           background: #f5f5f5;
//           padding: 20px;
//         }
//         .preview-container {
//           background: white;
//           padding: 20px;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           max-width: 350px;
//           margin: 0 auto;
//           white-space: pre-wrap;
//           font-size: 14px;
//           line-height: 1.4;
//         }
//         .preview-header {
//           text-align: center;
//           margin-bottom: 20px;
//           color: #333;
//         }
//         .thermal-preview {
//           background: white;
//           border: 1px dashed #ccc;
//           padding: 15px;
//           font-family: 'Courier New', monospace;
//           font-size: 12px;
//           line-height: 1.3;
//           white-space: pre;
//         }
//         .actions {
//           margin-top: 20px;
//           text-align: center;
//         }
//         button {
//           padding: 10px 20px;
//           margin: 5px;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .print-btn {
//           background: #4CAF50;
//           color: white;
//         }
//         .close-btn {
//           background: #f44336;
//           color: white;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="preview-container">
//         <div class="preview-header">
//           <h2>Bill Preview</h2>
//           <p>Order #${order.orderNumber}</p>
//         </div>
        
//         <div class="thermal-preview">
// ${billContent}
//         </div>
        
//         <div class="actions">
//           <button class="print-btn" onclick="window.print()">Print Preview</button>
//           <button class="close-btn" onclick="window.close()">Close</button>
//         </div>
//       </div>
//     </body>
//     </html>
//   `);
  
//   previewWindow.document.close();
// };

// // Enhanced bill content generator with better formatting
// const generateBillContent = (order) => {
//   const lineBreak = '\n';
//   const separator = '--------------------------------';
  
//   let bill = '';
  
//   // Header
//   bill += '    AMORE MIO RESTAURANT    ' + lineBreak;
//   bill += '                              ' + lineBreak;
//   bill += '        Restaurant & Cafe        ' + lineBreak;
//   bill += separator + lineBreak;
  
//   // Order details
//   bill += `Order #: ${order.orderNumber}` + lineBreak;
//   bill += `Date   : ${new Date(order.createdAt).toLocaleDateString('en-IN')}` + lineBreak;
//   bill += `Time   : ${new Date(order.createdAt).toLocaleTimeString('en-IN', { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true 
//   })}` + lineBreak;
//   bill += `Table  : ${order.tableNumber}` + lineBreak;
//   bill += `Customer: ${order.customerName}` + lineBreak;
//   bill += separator + lineBreak;
  
//   // Items header
//   bill += 'QTY  ITEM                  AMT' + lineBreak;
//   bill += separator + lineBreak;
  
//   // Items list
//   order.items?.forEach(item => {
//     const itemName = item.name || item.menuItem?.name || 'Item';
//     const quantity = item.quantity || 1;
//     const price = item.price || 0;
//     const total = price * quantity;
    
//     // Truncate long item names
//     const truncatedName = itemName.length > 18 ? itemName.substring(0, 15) + '...' : itemName;
    
//     bill += `${quantity.toString().padEnd(3)} ${truncatedName.padEnd(20)} ₹${total}` + lineBreak;
//     bill += `    ₹${price} x ${quantity}` + lineBreak;
//   });
  
//   bill += separator + lineBreak;
  
//   // Totals
//   const finalTotal = order.finalTotal || order.totalAmount || 0;
  
//   if (order.taxAmount > 0) {
//     bill += `Tax:                 ₹${order.taxAmount.toFixed(2)}` + lineBreak;
//   }
  
//   if (order.discountAmount > 0) {
//     bill += `Discount:            -₹${order.discountAmount.toFixed(2)}` + lineBreak;
//   }
  
//   bill += `                     --------` + lineBreak;
//   bill += `TOTAL:               ₹${finalTotal.toFixed(2)}` + lineBreak;
//   bill += separator + lineBreak;
  
//   // Footer
//   bill += '                              ' + lineBreak;
//   bill += '   Thank you for visiting!    ' + lineBreak;
//   bill += '  We hope to see you again   ' + lineBreak;
//   bill += '         soon!               ' + lineBreak;
//   bill += '                              ' + lineBreak;
//   bill += '                              ' + lineBreak;
//   bill += '==============================' + lineBreak;
  
//   return bill;
// };
//   // Login handler
//   const handleLogin = (e) => {
//     e.preventDefault()
//     if (loginForm.username === ADMIN_CREDENTIALS.username && 
//         loginForm.password === ADMIN_CREDENTIALS.password) {
//       setIsAuthenticated(true)
//       localStorage.setItem('receptionAuth', 'authenticated')
//       setLoginForm({ username: '', password: '' })
//     } else {
//       setLoginError('Invalid credentials')
//     }
//   }

//   // Logout handler
//   const handleLogout = () => {
//     setIsAuthenticated(false)
//     setOrders([])
//     localStorage.removeItem('receptionAuth')
//   }

//   // Status helpers
//   // const getStatusColor = (status) => {
//   //   const colors = {
//   //     pending: '#fd7e14',
//   //     served: '#59a6e9ff',
//   //     paid: '#28a745'
//   //   }
//   //   return colors[status] || '#6c757d'
//   // }

  

//   // const getStatusText = (status) => {
//   //   const texts = {
//   //     pending: 'Pending', served: 'Served',  paid: 'Paid'
//   //   }
//   //   return texts[status] || status
//   // }

// // const getStatusColor = (status) => {
// //   const colors = {
// //     pending: '#fd7e14',
// //     confirmed: '#17a2b8',
// //     preparing: '#ffc107',
// //     ready: '#20c997',
// //     served: '#59a6e9ff',
// //     cancelled: '#dc3545'
// //   }
// //   return colors[status] || '#6c757d'
// // }

// // const getStatusText = (status) => {
// //   const texts = {
// //     pending: 'Pending',
// //     confirmed: 'Confirmed',
// //     preparing: 'Preparing',
// //     ready: 'Ready',
// //     served: 'Served',
// //     cancelled: 'Cancelled'
// //   }
// //   return texts[status] || status
// // }
// const getStatusColor = (status) => {
//   const colors = {
//     'active': '#fd7e14',      // Backend status for active orders
//     'pending': '#fd7e14',     // Frontend status
//     'confirmed': '#17a2b8',
//     'preparing': '#ffc107',
//     'ready': '#20c997',
//     'served': '#59a6e9ff',
//     'billed': '#59a6e9ff',    // Backend status for served orders
//     'paid': '#28a745',
//     'cancelled': '#dc3545'
//   }
//   return colors[status] || '#6c757d'
// }

// const getStatusText = (status) => {
//   const texts = {
//     'active': 'Active',
//     'pending': 'Pending',
//     'confirmed': 'Confirmed',
//     'preparing': 'Preparing',
//     'ready': 'Ready',
//     'served': 'Served',
//     'billed': 'Served',       // Map backend 'billed' to frontend 'Served'
//     'paid': 'Paid',
//     'cancelled': 'Cancelled'
//   }
//   return texts[status] || status
// }


//   // Login form
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

//   // Main dashboard
//   return (
//     <div className="reception-dashboard">
//       <audio ref={audioRef} preload="auto">
//         <source src="/notification-sound.mp3" type="audio/mpeg" />
//       </audio>

//       {showNotification && newOrder && (
//         <div className="new-order-popup">
//           <button onClick={() => setShowNotification(false)}>×</button>
//           <h4>🎉 New Order #{newOrder.orderNumber}</h4>
//           <p>Table {newOrder.tableNumber} • {newOrder.customerName}</p>
//         </div>
//       )}

//       <header className="dashboard-header">
//         <div className="header-top">
//           <h1>Reception Dashboard</h1>
//           <div className="header-actions">
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//             <Link to="/admin/tables" className="btn-primary">Manage Tables</Link>
//             <Link to="/admin/menu" className="btn-primary">Manage Menu</Link>
//             <Link to="/inventory" className="btn-primary">Manage Inventory</Link>
//             <Link to="/analysis" className="btn-primary">Analysis</Link>
//           </div>
//         </div>

//         {/* DEBUG INFO */}
//         {/* <div style={{background: '#f8f9fa', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
//           <strong>Debug Info:</strong> Orders: {orders.length} | Loading: {loading.toString()} | Error: {error}
//           <button onClick={fetchOrders} style={{marginLeft: '10px'}}>Refresh Data</button>
//         </div> */}

//         <div className="stats-container">
//           <div className="stat-card">
//             <div className="stat-icon">📊</div>
//             <div className="stat-info">
//               <h3>Total Orders</h3>
//               <p className="stat-number">{stats.totalOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-info">
//               <h3>Pending</h3>
//               <p className="stat-number">{stats.pendingOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">💰</div>
//             <div className="stat-info">
//               <h3>Monthly Revenue</h3>
//               <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="orders-section">
//         <div className="section-header">
//           <h2>Recent Orders ({orders.length})</h2>
//           <button onClick={fetchOrders} disabled={loading}>
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>

//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//             <button onClick={fetchOrders}>Retry</button>
//           </div>
//         )}

//         {loading && <div className="loading-message">Loading orders...</div>}

//         {!loading && !error && orders.length === 0 && (
//           <div className="no-orders">
//             <p>No orders found</p>
//             <button onClick={fetchOrders}>Check Again</button>
//           </div>
//         )}
// <div className="orders-section">
//   <div className="section-header">
//     <h2>Recent Orders ({orders.length})</h2>
//     <div className="header-actions">
//       <button onClick={fetchOrders} disabled={loading}>
//         {loading ? 'Refreshing...' : 'Refresh'}
//       </button>
//     </div>
//   </div>

//   {/* Table Groups Section */}
//   <div className="table-groups-section">
//     <h3>Table Groups for Combined Billing</h3>
//     <div className="table-groups">
//       {Object.entries(getOrdersByTable()).map(([tableNumber, tableOrders]) => (
//         tableOrders.length > 1 && (
//           <div key={tableNumber} className="table-group-card">
//             <div className="table-group-header">
//               <h4>Table {tableNumber}</h4>
//               <span className="order-count">{tableOrders.length} orders</span>
//             </div>
//             <div className="table-group-details">
//               <p>Customer: {tableOrders[0].customerName}</p>
//               <p>Total Amount: ₹{tableOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}</p>
//             </div>
//             <button 
//               className="combine-bill-btn"
//               onClick={() => generateCombinedBill(parseInt(tableNumber))}
//             >
//               🧾 Generate Combined Bill
//             </button>
//           </div>
//         )
//       ))}
//     </div>
//   </div>

//   {error && (
//     <div className="error-message">
//       <p>{error}</p>
//       <button onClick={fetchOrders}>Retry</button>
//     </div>
//   )}

//   {loading && <div className="loading-message">Loading orders...</div>}

//   {!loading && !error && orders.length === 0 && (
//     <div className="no-orders">
//       <p>No orders found</p>
//       <button onClick={fetchOrders}>Check Again</button>
//     </div>
//   )}

//   <div className="orders-grid">
//     {orders.map(order => (
//       <div key={order._id} className="order-card">
//         {/* ... keep your existing order card JSX ... */}
//         <div className="order-title">
//           <h3>Order #{order.orderNumber}</h3>
//           <div className="order-time-info">
//             <span className="order-date">
//               {new Date(order.createdAt || order.orderTime).toLocaleDateString('en-IN', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//               })}
//             </span>
//             <span className="order-time">
//               {new Date(order.createdAt || order.orderTime).toLocaleTimeString('en-IN', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true
//               })}
//             </span>
//           </div>
//         </div>
        
//         <span 
//           className="status-badge"
//           style={{backgroundColor: getStatusColor(order.status)}}
//         >
//           {getStatusText(order.status)}
//         </span>
        
//         {/* ... rest of your order card ... */}
//         <div className="orders-grid">
//           {orders.map(order => (
//             <div key={order._id} className="order-card">
//               {/* <div className="order-title">
//                 <h3>Order #{order.orderNumber}</h3>
//                 <span className="order-time">
//                   {new Date(order.createdAt).toLocaleTimeString()}
//                 </span>
//               </div> */}
              
              
              
//               <div className="order-details">
//                 <div className="detail-row">
//                   <span>Table:</span>
//                   <span>Table {order.tableNumber}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span>Customer:</span>
//                   <span>{order.customerName}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span>Mobile:</span>
//                   <span>{order.mobileNumber}</span>
//                 </div>
//               </div>

//               <div className="order-items">
//                 <h4>Items:</h4>
//                 {order.items?.map((item, index) => (
//                   <div key={index} className="order-item">
//                     <span>{item.quantity}x {item.name || item.menuItem?.name}</span>
//                     <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-total">
//                 <strong>Total: ₹{order.totalAmount || order.finalTotal}</strong>
//               </div>

//               <div className="order-actions">
//                 {/* <select
//                   value={order.status}
//                   onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
//                   disabled={updatingOrders.has(order.orderNumber)}
//                   className='status-select'
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="served">Served</option>
//                   <option value="paid">Paid</option>
//                 </select> */}
//                 {/* <select
//                   value={order.status}
//                   onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
//                   disabled={updatingOrders.has(order.orderNumber)}
//                   className='status-select'
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="served">Served</option>
//                   <option value="paid">Paid</option>
//                 </select> */}
//                 <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
//                       disabled={updatingOrders.has(order.orderNumber)}
//                       className='status-select'
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="preparing">Preparing</option>
//                       <option value="ready">Ready</option>
//                       <option value="served">Served</option>
//                       <option value="cancelled">Cancelled</option>
//                   </select>
                

//   <button 
//     className="preview-btn"
//     onClick={() => previewBill(order)}
//     title="Preview Bill"
//   >
//     👁 Preview
//   </button>
  
//   {/* Print Bill Button */}
//   {/* <button 
//     className="print-btn"
//     onClick={() => testPrintBill(order)}
//     title="Test Print Bill"
//     disabled={order.status === 'pending' || order.status === 'cancelled'}
//   >
//     🖨 Print Bill
//   </button> */}
//                 {/* {updatingOrders.has(order.orderNumber) && <span>Updating...</span>}
//                 {updatingOrders.has(order.orderNumber) && <span>Updating...</span>} */}

//                  {/* Print Bill Button - Only show for served/paid orders */}
//   {(order.status === 'served' || order.status === 'paid') && (
//     <button 
//       className="print-btn"
//       onClick={() => testPrintBill(order)}
//       title="Print Bill"
//     >
//       🖨 Print Bill
//     </button>
//   )}
  
//   {updatingOrders.has(order.orderNumber) && (
//     <span className="updating-indicator">Updating...</span>
//   )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
        
//       </div>
//     </div>
//   )
// }

// export default ReceptionDashboard


// import React, { useState, useEffect, useRef } from 'react'
// import { Link } from 'react-router-dom'
// import io from 'socket.io-client'
// import axios from 'axios'
// import './ReceptionDashboard.css'

// const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

// const ADMIN_CREDENTIALS = {
//   username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
//   password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
// }

// const ReceptionDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loginForm, setLoginForm] = useState({ username: '', password: '' })
//   const [loginError, setLoginError] = useState('')
//   const [showNotification, setShowNotification] = useState(false)
//   const [newOrder, setNewOrder] = useState(null)
//   const [audioPermissionGranted, setAudioPermissionGranted] = useState(false)
//   const notificationTimeoutRef = useRef(null)
//   const audioRef = useRef(null)
//   const [updatingOrders, setUpdatingOrders] = useState(new Set())
//   const socketRef = useRef(null)

//   // Dashboard State
//   const [orders, setOrders] = useState([])
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Table management
//   // const [tables, setTables] = useState([])
//   const [showAddTableModal, setShowAddTableModal] = useState(false)
//   const [newTableNumber, setNewTableNumber] = useState('')

//   // Initialize default tables (1-10)
//   const initializeTables = () => {
//     const defaultTables = Array.from({ length: 10 }, (_, i) => ({
//       tableNumber: i + 1,
//       status: 'available',
//       capacity: 4,
//       currentOrder: null
//     }))
//     setTables(defaultTables)
//   }

//   // FIX 1: Enhanced socket connection for real-time updates
//   const setupSocketConnection = () => {
//     try {
//       console.log('🔌 Setting up socket connection...')
//       const socket = io('https://orderflow-backend-v964.onrender.com', {
//         transports: ['websocket', 'polling']
//       })
//       socketRef.current = socket
      
//       socket.on('connect', () => {
//         console.log('✅ Socket connected successfully')
//         socket.emit('join-reception')
//       })

//       socket.on('new-order', (newOrder) => {
//         console.log('🆕 New order via socket:', newOrder)
        
//         setOrders(prev => {
//           // FIX 2: Prevent duplicate orders
//           const orderExists = prev.some(order => order._id === newOrder._id)
//           if (orderExists) {
//             console.log('⚠️ Order already exists, skipping duplicate')
//             return prev
//           }
          
//           const updatedOrders = [newOrder, ...prev]
//           calculateStatsFromOrders(updatedOrders)
//           updateTableOrder(newOrder.tableNumber, newOrder)
//           return updatedOrders
//         })
        
//         setNewOrder(newOrder)
//         setShowNotification(true)
//         playNotificationSound()
        
//         setTimeout(() => setShowNotification(false), 5000)
//       })

//       socket.on('order-status-updated', (updatedOrder) => {
//         console.log('🔄 Order status updated via socket:', updatedOrder)
        
//         setOrders(prev => {
//           const updatedOrders = prev.map(order => 
//             order._id === updatedOrder._id ? updatedOrder : order
//           )
//           calculateStatsFromOrders(updatedOrders)
          
//           // FIX 4: Clear table if order is served and billed
//           if (updatedOrder.status === 'billed' || updatedOrder.status === 'paid') {
//             updateTableOrder(updatedOrder.tableNumber, null)
//           }
          
//           return updatedOrders
//         })
//       })

//       socket.on('disconnect', () => {
//         console.log('🔌 Socket disconnected')
//       })

//       socket.on('connect_error', (error) => {
//         console.error('❌ Socket connection error:', error)
//       })

//     } catch (error) {
//       console.error('❌ Socket initialization error:', error)
//     }
//   }

//   // FIX 2: Enhanced fetchOrders to prevent duplicates and sort by latest
//   const fetchOrders = async () => {
//     try {
//       console.log('🔄 FETCHING ORDERS FROM:', `${API_BASE_URL}/orders`)
//       setLoading(true)
//       setError('')
      
//       const response = await axios.get(`${API_BASE_URL}/orders`)
      
//       let ordersData = []
      
//       if (Array.isArray(response.data)) {
//         ordersData = response.data
//       } else if (response.data.orders && Array.isArray(response.data.orders)) {
//         ordersData = response.data.orders
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         ordersData = response.data.data
//       } else {
//         const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val))
//         if (possibleArrays.length > 0) {
//           ordersData = possibleArrays[0]
//         }
//       }
      
//       // FIX 3: Sort orders by latest first
//       ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
//       console.log(`🎯 FINAL ORDERS DATA:`, ordersData.length, 'orders')
      
//       setOrders(ordersData)
//       calculateStatsFromOrders(ordersData)
      
//       // Initialize table states
//       initializeTableOrders(ordersData)
      
//     } catch (error) {
//       console.error('❌ ERROR FETCHING ORDERS:', error)
//       setError(`Failed to load orders: ${error.message}`)
//       setOrders([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Initialize table orders from fetched data
//   const initializeTableOrders = (ordersData) => {
//     const activeTables = {}
    
//     ordersData.forEach(order => {
//       if (order.status !== 'billed' && order.status !== 'paid' && order.status !== 'cancelled') {
//         activeTables[order.tableNumber] = order
//       }
//     })
    
//     setTables(prev => prev.map(table => ({
//       ...table,
//       currentOrder: activeTables[table.tableNumber] || null
//     })))
//   }

//   // Update table order status
//   // const updateTableOrder = (tableNumber, order) => {
//   //   setTables(prev => prev.map(table => 
//   //     table.tableNumber === tableNumber 
//   //       ? { ...table, currentOrder: order }
//   //       : table
//   //   ))
//   // }

//   // Calculate stats from orders
//   const calculateStatsFromOrders = (ordersData) => {
//     try {
//       const totalOrders = ordersData.length
//       const pendingOrders = ordersData.filter(order => 
//         ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
//       ).length
//       const totalRevenue = ordersData
//         .filter(order => order.status === 'paid' || order.status === 'billed')
//         .reduce((total, order) => total + (order.finalTotal || order.totalAmount || 0), 0)

//       setStats({ totalOrders, pendingOrders, totalRevenue })
//     } catch (error) {
//       console.error('Error calculating stats:', error)
//     }
//   }

//   // FIX 4: Enhanced order status update with table management
//   // const updateOrderStatus = async (orderNumber, newStatus) => {
//   //   try {
//   //     console.log('🔄 Updating order status:', { orderNumber, newStatus })
//   //     setUpdatingOrders(prev => new Set(prev).add(orderNumber))

//   //     const order = orders.find(o => o.orderNumber === orderNumber)
      
//   //     if (!order) {
//   //       alert('Order not found in local data.')
//   //       return
//   //     }

//   //     // Map frontend status to backend status
//   //     const statusMapping = {
//   //       'pending': 'active',
//   //       'confirmed': 'active', 
//   //       'preparing': 'active',
//   //       'ready': 'active',
//   //       'served': 'billed',
//   //       'cancelled': 'cancelled',
//   //       'paid': 'paid'
//   //     }

//   //     const backendStatus = statusMapping[newStatus] || newStatus

//   //     console.log('📡 Status mapping - Frontend:', newStatus, 'Backend:', backendStatus)

//   //     // Update backend
//   //     const response = await axios.patch(
//   //       `${API_BASE_URL}/orders/${order._id}/status`, 
//   //       { status: backendStatus }
//   //     )

//   //     console.log('✅ Backend update successful:', response.data)

//   //     // Update local state
//   //     setOrders(prev => {
//   //       const updatedOrders = prev.map(order => 
//   //         order.orderNumber === orderNumber 
//   //           ? { 
//   //               ...order, 
//   //               status: newStatus,
//   //               updatedAt: new Date().toISOString()
//   //             }
//   //           : order
//   //       )
        
//   //       calculateStatsFromOrders(updatedOrders)
//   //       return updatedOrders
//   //     })

//   //     // FIX 4: Clear table if order is served/billed
//   //     if (newStatus === 'served' || backendStatus === 'billed' || backendStatus === 'paid') {
//   //       updateTableOrder(order.tableNumber, null)
        
//   //       // Remove from orders list after a delay
//   //       setTimeout(() => {
//   //         setOrders(prev => prev.filter(o => o.orderNumber !== orderNumber))
//   //       }, 2000)
//   //     }

//   //     console.log('✅ Order status updated successfully')

//   //   } catch (error) {
//   //     console.error('❌ Error updating order status:', error)
      
//   //     const errorMessage = error.response?.data?.message || error.message
//   //     alert(`Failed to update order status: ${errorMessage}`)
      
//   //   } finally {
//   //     setUpdatingOrders(prev => {
//   //       const newSet = new Set(prev)
//   //       newSet.delete(orderNumber)
//   //       return newSet
//   //     })
//   //   }
//   // }

//   // FIXED: Proper order status update with backend synchronization
// const updateOrderStatus = async (orderNumber, newStatus) => {
//   try {
//     console.log('🔄 Updating order status:', { orderNumber, newStatus });
//     setUpdatingOrders(prev => new Set(prev).add(orderNumber));

//     const order = orders.find(o => o.orderNumber === orderNumber);
    
//     if (!order) {
//       alert('Order not found in local data.');
//       return;
//     }

//     // Map frontend status to backend status
//     const statusMapping = {
//       'pending': 'pending',
//       'confirmed': 'confirmed', 
//       'preparing': 'preparing',
//       'ready': 'ready',
//       'served': 'served',
//       'cancelled': 'cancelled',
//       'paid': 'paid'
//     };

//     const backendStatus = statusMapping[newStatus] || newStatus;

//     console.log('📡 Sending to backend:', { orderId: order._id, status: backendStatus });

//     // 1. Update backend first
//     const response = await axios.put(
//       `${API_BASE_URL}/orders/${order._id}/status`,
//       { status: backendStatus }
//     );

//     console.log('✅ Backend update successful:', response.data);

//     // 2. Update local state with backend response
//     const updatedOrder = response.data.data;
//     setOrders(prev => {
//       const updatedOrders = prev.map(order => 
//         order._id === updatedOrder._id ? updatedOrder : order
//       );
//       calculateStatsFromOrders(updatedOrders);
//       return updatedOrders;
//     });

//     // 3. Update table status if order is completed
//     if (newStatus === 'served' || newStatus === 'paid' || newStatus === 'cancelled') {
//       await updateTableInBackend(order.tableNumber, 'available', null);
//     }

//     console.log('✅ Order status updated successfully');

//   } catch (error) {
//     console.error('❌ Error updating order status:', error);
    
//     // Show specific error message
//     let errorMessage = 'Failed to update order status';
//     if (error.response?.status === 404) {
//       errorMessage = 'Backend endpoint not found. Please check if the endpoint exists.';
//     } else if (error.response?.status === 500) {
//       errorMessage = 'Server error. Please try again.';
//     } else {
//       errorMessage = error.response?.data?.message || error.message;
//     }
    
//     alert(errorMessage);
    
//   } finally {
//     setUpdatingOrders(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(orderNumber);
//       return newSet;
//     });
//   }
// };

// // FIXED: Update table in backend
// const updateTableInBackend = async (tableNumber, status, currentOrder) => {
//   try {
//     console.log('🔄 Updating table in backend:', { tableNumber, status });
    
//     const response = await axios.put(
//       `${API_BASE_URL}/tables/${tableNumber}`,
//       { 
//         status, 
//         currentOrder: currentOrder?._id || null 
//       }
//     );
    
//     console.log('✅ Table updated in backend:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error updating table in backend:', error);
//     // Don't throw error - we'll still update local state
//   }
// };

// // FIXED: Enhanced table management
// const [tables, setTables] = useState([]);

// // Fetch tables from backend
// const fetchTables = async () => {
//   try {
//     console.log('🔄 Fetching tables from backend...');
//     const response = await axios.get(`${API_BASE_URL}/tables`);
    
//     if (response.data.success) {
//       setTables(response.data.data);
//       console.log('✅ Tables fetched:', response.data.data.length);
//     }
//   } catch (error) {
//     console.error('❌ Error fetching tables:', error);
//     // Initialize with default tables if backend fails
//     initializeDefaultTables();
//   }
// };

// // Initialize default tables (fallback)
// const initializeDefaultTables = () => {
//   const defaultTables = Array.from({ length: 10 }, (_, i) => ({
//     tableNumber: i + 1,
//     status: 'available',
//     capacity: 4,
//     currentOrder: null
//   }));
//   setTables(defaultTables);
//   console.log('📋 Using default tables');
// };

// // Update table order status
// const updateTableOrder = async (tableNumber, order) => {
//   try {
//     const newStatus = order ? 'occupied' : 'available';
    
//     // Update local state immediately
//     setTables(prev => prev.map(table => 
//       table.tableNumber === tableNumber 
//         ? { ...table, currentOrder: order, status: newStatus }
//         : table
//     ));

//     // Update in backend (non-blocking)
//     updateTableInBackend(tableNumber, newStatus, order);
    
//   } catch (error) {
//     console.error('Error updating table order:', error);
//   }
// };

// // FIXED: Enhanced combined bill with proper backend updates
// const generateCombinedBill = async (tableNumber) => {
//   try {
//     console.log('🧾 Generating combined bill for table:', tableNumber);
    
//     const tableOrders = orders.filter(order => 
//       order.tableNumber === tableNumber && 
//       order.status !== 'cancelled' && 
//       order.status !== 'paid' &&
//       order.status !== 'served'
//     );

//     if (tableOrders.length === 0) {
//       alert(`No active orders found for Table ${tableNumber}`);
//       return;
//     }

//     // Combine all items
//     const combinedItems = [];
//     let totalAmount = 0;
//     let customerName = '';
//     let mobileNumber = '';

//     tableOrders.forEach(order => {
//       if (!customerName) {
//         customerName = order.customerName;
//         mobileNumber = order.mobileNumber;
//       }

//       order.items?.forEach(item => {
//         const existingItem = combinedItems.find(combinedItem => 
//           combinedItem.name === item.name && combinedItem.price === item.price
//         );

//         if (existingItem) {
//           existingItem.quantity += item.quantity;
//         } else {
//           combinedItems.push({
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             isVeg: item.isVeg
//           });
//         }
//       });

//       totalAmount += order.totalAmount || 0;
//     });

//     // Create combined order
//     const combinedOrder = {
//       orderNumber: `COMBINED-${Date.now()}`,
//       tableNumber: tableNumber,
//       customerName: customerName,
//       mobileNumber: mobileNumber,
//       items: combinedItems,
//       totalAmount: totalAmount,
//       taxAmount: totalAmount * 0.05,
//       finalTotal: totalAmount * 1.05,
//       createdAt: new Date().toISOString(),
//       isCombinedBill: true,
//       originalOrders: tableOrders.map(order => order.orderNumber)
//     };

//     console.log('📊 Combined bill details:', combinedOrder);

//     // Print combined bill
//     previewBill(combinedOrder);

//     // Mark all original orders as served in backend
//     const updatePromises = tableOrders.map(order => 
//       updateOrderStatus(order.orderNumber, 'served')
//     );

//     // Wait for all orders to be updated
//     await Promise.all(updatePromises);

//     // Clear the table
//     await updateTableOrder(tableNumber, null);

//     // Show success message
//     alert(`Combined bill generated for Table ${tableNumber}! All orders marked as served.`);

//   } catch (error) {
//     console.error('❌ Error generating combined bill:', error);
//     alert('Error generating combined bill: ' + error.message);
//   }
// };

// // FIXED: Print bill with proper backend updates
// const printBillAndClearTable = async (order) => {
//   try {
//     console.log('🧾 Printing bill and clearing table:', order.tableNumber);
    
//     // Print the bill first
//     await testPrintBill(order);
    
//     // Update order status to served in backend
//     await updateOrderStatus(order.orderNumber, 'served');
    
//     // Show success message
//     alert(`Bill printed for Table ${order.tableNumber}. Table is now available.`);
    
//   } catch (error) {
//     console.error('❌ Error in bill printing process:', error);
//     alert('Error printing bill: ' + error.message);
//   }
// };

// // Initialize tables when component mounts
// useEffect(() => {
//   if (isAuthenticated) {
//     fetchTables();
//   }
// }, [isAuthenticated]);

//   // FIX 5: Enhanced bill printing with table clearing
//   // const printBillAndClearTable = async (order) => {
//   //   try {
//   //     console.log('🧾 Printing bill and clearing table:', order.tableNumber)
      
//   //     // Print the bill
//   //     await testPrintBill(order)
      
//   //     // Update order status to billed
//   //     await updateOrderStatus(order.orderNumber, 'served')
      
//   //     // Show success message
//   //     setTimeout(() => {
//   //       alert(`Bill printed for Table ${order.tableNumber}. Table is now available.`)
//   //     }, 1000)
      
//   //   } catch (error) {
//   //     console.error('❌ Error in bill printing process:', error)
//   //     alert('Error printing bill: ' + error.message)
//   //   }
//   // }

//   // Generate combined bill for table
//   // const generateCombinedBill = async (tableNumber) => {
//   //   try {
//   //     console.log('🧾 Generating combined bill for table:', tableNumber)
      
//   //     const tableOrders = orders.filter(order => 
//   //       order.tableNumber === tableNumber && 
//   //       order.status !== 'cancelled' && 
//   //       order.status !== 'paid' &&
//   //       order.status !== 'billed'
//   //     )

//   //     if (tableOrders.length === 0) {
//   //       alert(`No active orders found for Table ${tableNumber}`)
//   //       return
//   //     }

//   //     // Combine all items
//   //     const combinedItems = []
//   //     let totalAmount = 0
//   //     let customerName = ''
//   //     let mobileNumber = ''

//   //     tableOrders.forEach(order => {
//   //       if (!customerName) {
//   //         customerName = order.customerName
//   //         mobileNumber = order.mobileNumber
//   //       }

//   //       order.items?.forEach(item => {
//   //         const existingItem = combinedItems.find(combinedItem => 
//   //           combinedItem.name === item.name && combinedItem.price === item.price
//   //         )

//   //         if (existingItem) {
//   //           existingItem.quantity += item.quantity
//   //         } else {
//   //           combinedItems.push({
//   //             name: item.name,
//   //             price: item.price,
//   //             quantity: item.quantity,
//   //             isVeg: item.isVeg
//   //           })
//   //         }
//   //       })

//   //       totalAmount += order.totalAmount || 0
//   //     })

//   //     // Create combined order
//   //     const combinedOrder = {
//   //       orderNumber: `COMBINED-${Date.now()}`,
//   //       tableNumber: tableNumber,
//   //       customerName: customerName,
//   //       mobileNumber: mobileNumber,
//   //       items: combinedItems,
//   //       totalAmount: totalAmount,
//   //       taxAmount: totalAmount * 0.05,
//   //       finalTotal: totalAmount * 1.05,
//   //       createdAt: new Date().toISOString(),
//   //       isCombinedBill: true,
//   //       originalOrders: tableOrders.map(order => order.orderNumber)
//   //     }

//   //     console.log('📊 Combined bill details:', combinedOrder)

//   //     // Print combined bill
//   //     previewBill(combinedOrder)

//   //     // Mark all original orders as billed
//   //     for (const order of tableOrders) {
//   //       await updateOrderStatus(order.orderNumber, 'served')
//   //     }

//   //   } catch (error) {
//   //     console.error('❌ Error generating combined bill:', error)
//   //     alert('Error generating combined bill: ' + error.message)
//   //   }
//   // }

//   // Get orders grouped by table
//   const getOrdersByTable = () => {
//     const tableGroups = {}
    
//     orders.forEach(order => {
//       if (order.status !== 'cancelled' && order.status !== 'paid' && order.status !== 'billed') {
//         if (!tableGroups[order.tableNumber]) {
//           tableGroups[order.tableNumber] = []
//         }
//         tableGroups[order.tableNumber].push(order)
//       }
//     })

//     return tableGroups
//   }

//   // Audio permission and notification sound
//   useEffect(() => {
//     if (isAuthenticated) {
//       const handleUserInteraction = async () => {
//         try {
//           if (audioRef.current) {
//             await audioRef.current.play()
//             audioRef.current.pause()
//             setAudioPermissionGranted(true)
//             console.log('✅ Audio permission granted')
//             document.removeEventListener('click', handleUserInteraction)
//           }
//         } catch (error) {
//           console.log('🔇 Audio permission not yet granted...')
//         }
//       }

//       document.addEventListener('click', handleUserInteraction)
      
//       return () => {
//         document.removeEventListener('click', handleUserInteraction)
//       }
//     }
//   }, [isAuthenticated])

//   const playNotificationSound = async () => {
//     if (!audioRef.current) return
    
//     try {
//       audioRef.current.currentTime = 0
//       await audioRef.current.play()
//       console.log('🔊 Notification sound played successfully')
//     } catch (error) {
//       console.log('🔇 Could not play sound:', error)
//     }
//   }

//   // Authentication and data initialization
//   useEffect(() => {
//     const authStatus = localStorage.getItem('receptionAuth')
//     if (authStatus === 'authenticated') {
//       setIsAuthenticated(true)
//     }
//   }, [])

//   useEffect(() => {
//     if (!isAuthenticated) return

//     console.log('🚀 INITIALIZING DASHBOARD...')
    
//     const initializeDashboard = async () => {
//       initializeTables()
//       await fetchOrders()
//       setupSocketConnection()
//     }

//     initializeDashboard()

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//       if (notificationTimeoutRef.current) {
//         clearTimeout(notificationTimeoutRef.current)
//       }
//     }
//   }, [isAuthenticated])

//   // Status helpers
//   const getStatusColor = (status) => {
//     const colors = {
//       'active': '#fd7e14',
//       'pending': '#fd7e14',
//       'confirmed': '#17a2b8',
//       'preparing': '#ffc107',
//       'ready': '#20c997',
//       'served': '#59a6e9ff',
//       'billed': '#59a6e9ff',
//       'paid': '#28a745',
//       'cancelled': '#dc3545'
//     }
//     return colors[status] || '#6c757d'
//   }

//   const getStatusText = (status) => {
//     const texts = {
//       'active': 'Active',
//       'pending': 'Pending',
//       'confirmed': 'Confirmed',
//       'preparing': 'Preparing',
//       'ready': 'Ready',
//       'served': 'Served',
//       'billed': 'Served',
//       'paid': 'Paid',
//       'cancelled': 'Cancelled'
//     }
//     return texts[status] || status
//   }

//   // Bill printing functions (keep your existing implementations)
//   const testPrintBill = async (order) => {
//     // Your existing testPrintBill implementation
//     console.log('🧪 Testing print for order:', order.orderNumber)
//     // ... rest of your implementation
//   }

//   const previewBill = (order) => {
//     // Your existing previewBill implementation
//     const billContent = generateBillContent(order)
//     // ... rest of your implementation
//   }

//   const generateBillContent = (order) => {
//     // Your existing generateBillContent implementation
//     // ... rest of your implementation
//     return "Bill content"
//   }

//   // Login handler
//   const handleLogin = (e) => {
//     e.preventDefault()
//     if (loginForm.username === ADMIN_CREDENTIALS.username && 
//         loginForm.password === ADMIN_CREDENTIALS.password) {
//       setIsAuthenticated(true)
//       localStorage.setItem('receptionAuth', 'authenticated')
//       setLoginForm({ username: '', password: '' })
//     } else {
//       setLoginError('Invalid credentials')
//     }
//   }

//   const handleLogout = () => {
//     setIsAuthenticated(false)
//     setOrders([])
//     localStorage.removeItem('receptionAuth')
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
//       <audio ref={audioRef} preload="auto">
//         <source src="/notification-sound.mp3" type="audio/mpeg" />
//       </audio>

//       {showNotification && newOrder && (
//         <div className="new-order-popup">
//           <button onClick={() => setShowNotification(false)}>×</button>
//           <h4>🎉 New Order #{newOrder.orderNumber}</h4>
//           <p>Table {newOrder.tableNumber} • {newOrder.customerName}</p>
//         </div>
//       )}

//       <header className="dashboard-header">
//         <div className="header-top">
//           <h1>Reception Dashboard</h1>
//           <div className="header-actions">
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//             <Link to="/admin/tables" className="btn-primary">Manage Tables</Link>
//             <Link to="/admin/menu" className="btn-primary">Manage Menu</Link>
//             <Link to="/inventory" className="btn-primary">Manage Inventory</Link>
//             <Link to="/analysis" className="btn-primary">Analysis</Link>
//           </div>
//         </div>

//         <div className="stats-container">
//           <div className="stat-card">
//             <div className="stat-icon">📊</div>
//             <div className="stat-info">
//               <h3>Total Orders</h3>
//               <p className="stat-number">{stats.totalOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-info">
//               <h3>Pending</h3>
//               <p className="stat-number">{stats.pendingOrders}</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">💰</div>
//             <div className="stat-info">
//               <h3>Monthly Revenue</h3>
//               <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* FIX 5: Fixed tables display */}
//       <div className="tables-section">
//         <h3>Table Status</h3>
//         <div className="tables-grid">
//           {tables.map(table => (
//             <div key={table.tableNumber} className={`table-card ${table.currentOrder ? 'occupied' : 'available'}`}>
//               <div className="table-header">
//                 <h4>Table {table.tableNumber}</h4>
//                 <span className="table-status">
//                   {table.currentOrder ? '🟡 Occupied' : '🟢 Available'}
//                 </span>
//               </div>
//               {table.currentOrder ? (
//                 <div className="table-order-info">
//                   <p>Order: #{table.currentOrder.orderNumber}</p>
//                   <p>Customer: {table.currentOrder.customerName}</p>
//                   <p>Status: {getStatusText(table.currentOrder.status)}</p>
//                   <button 
//                     className="print-bill-btn"
//                     onClick={() => printBillAndClearTable(table.currentOrder)}
//                   >
//                     🖨 Print Bill & Clear
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-empty">
//                   <p>No active orders</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="orders-section">
//         <div className="section-header">
//           <h2>Recent Orders ({orders.length})</h2>
//           <div className="header-actions">
//             <button onClick={fetchOrders} disabled={loading}>
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>
//         </div>

//         {/* Table Groups for Combined Billing */}
//         <div className="table-groups-section">
//           <h3>Table Groups for Combined Billing</h3>
//           <div className="table-groups">
//             {Object.entries(getOrdersByTable()).map(([tableNumber, tableOrders]) => (
//               tableOrders.length > 1 && (
//                 <div key={tableNumber} className="table-group-card">
//                   <div className="table-group-header">
//                     <h4>Table {tableNumber}</h4>
//                     <span className="order-count">{tableOrders.length} orders</span>
//                   </div>
//                   <div className="table-group-details">
//                     <p>Customer: {tableOrders[0].customerName}</p>
//                     <p>Total Amount: ₹{tableOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}</p>
//                   </div>
//                   <button 
//                     className="combine-bill-btn"
//                     onClick={() => generateCombinedBill(parseInt(tableNumber))}
//                   >
//                     🧾 Generate Combined Bill
//                   </button>
//                 </div>
//               )
//             ))}
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//             <button onClick={fetchOrders}>Retry</button>
//           </div>
//         )}

//         {loading && <div className="loading-message">Loading orders...</div>}

//         {!loading && !error && orders.length === 0 && (
//           <div className="no-orders">
//             <p>No orders found</p>
//             <button onClick={fetchOrders}>Check Again</button>
//           </div>
//         )}

//         <div className="orders-grid">
//           {orders.map(order => (
//             <div key={order._id} className="order-card">
//               <div className="order-title">
//                 <h3>Order #{order.orderNumber}</h3>
//                 <div className="order-time-info">
//                   <span className="order-date">
//                     {new Date(order.createdAt || order.orderTime).toLocaleDateString('en-IN', {
//                       day: '2-digit',
//                       month: '2-digit',
//                       year: 'numeric'
//                     })}
//                   </span>
//                   <span className="order-time">
//                     {new Date(order.createdAt || order.orderTime).toLocaleTimeString('en-IN', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true
//                     })}
//                   </span>
//                 </div>
//               </div>
              
//               <span 
//                 className="status-badge"
//                 style={{backgroundColor: getStatusColor(order.status)}}
//               >
//                 {getStatusText(order.status)}
//               </span>
              
//               <div className="order-details">
//                 <div className="detail-row">
//                   <span>Table:</span>
//                   <span>Table {order.tableNumber}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span>Customer:</span>
//                   <span>{order.customerName}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span>Mobile:</span>
//                   <span>{order.mobileNumber}</span>
//                 </div>
//               </div>

//               <div className="order-items">
//                 <h4>Items:</h4>
//                 {order.items?.map((item, index) => (
//                   <div key={index} className="order-item">
//                     <span>{item.quantity}x {item.name || item.menuItem?.name}</span>
//                     <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-total">
//                 <strong>Total: ₹{order.totalAmount || order.finalTotal}</strong>
//               </div>

//               <div className="order-actions">
//                 <select
//                   value={order.status}
//                   onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
//                   disabled={updatingOrders.has(order.orderNumber)}
//                   className='status-select'
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="preparing">Preparing</option>
//                   <option value="ready">Ready</option>
//                   <option value="served">Served</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>

//                 <button 
//                   className="preview-btn"
//                   onClick={() => previewBill(order)}
//                   title="Preview Bill"
//                 >
//                   👁 Preview
//                 </button>
                
//                 {(order.status === 'served' || order.status === 'ready') && (
//                   <button 
//                     className="print-btn"
//                     onClick={() => printBillAndClearTable(order)}
//                     title="Print Bill & Clear Table"
//                   >
//                     🖨 Print Bill
//                   </button>
//                 )}
                
//                 {updatingOrders.has(order.orderNumber) && (
//                   <span className="updating-indicator">Updating...</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ReceptionDashboard

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

// Add this function in your ReceptionDashboard component
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

  // Socket connection
  const setupSocketConnection = () => {
    try {
      console.log('🔌 Setting up socket connection...')
      const socket = io('https://orderflow-backend-v964.onrender.com', {
        transports: ['websocket', 'polling']
      })
      socketRef.current = socket
      
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully')
        socket.emit('join-reception')
      })

      socket.on('new-order', (newOrder) => {
        console.log('🆕 New order via socket:', newOrder)
        
        setOrders(prev => {
          const orderExists = prev.some(order => order._id === newOrder._id)
          if (orderExists) return prev
          
          const updatedOrders = [newOrder, ...prev]
          calculateStatsFromOrders(updatedOrders)
          updateTableOrder(newOrder.tableNumber, newOrder)
          return updatedOrders
        })
        
        setNewOrder(newOrder)
        setShowNotification(true)
        playNotificationSound()
        
        setTimeout(() => setShowNotification(false), 5000)
      })

      socket.on('order-status-updated', (updatedOrder) => {
        console.log('🔄 Order status updated via socket:', updatedOrder)
        
        setOrders(prev => {
          const updatedOrders = prev.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
          calculateStatsFromOrders(updatedOrders)
          
          // Only clear table if order is paid, not served
          if (updatedOrder.status === 'paid') {
            updateTableOrder(updatedOrder.tableNumber, null)
          }
          
          return updatedOrders
        })
      })

    } catch (error) {
      console.error('❌ Socket initialization error:', error)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    try {
      console.log('🔄 FETCHING ORDERS...')
      setLoading(true)
      setError('')
      
      const response = await axios.get(`${API_BASE_URL}/orders`)
      
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
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      console.log(`🎯 Loaded ${ordersData.length} orders`)
      
      setOrders(ordersData)
      calculateStatsFromOrders(ordersData)
      initializeTableOrders(ordersData)
      
    } catch (error) {
      console.error('❌ ERROR FETCHING ORDERS:', error)
      setError(`Failed to load orders: ${error.message}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Initialize table orders from fetched data
  const initializeTableOrders = (ordersData) => {
    const activeTables = {}
    
    ordersData.forEach(order => {
      // FIXED: Only exclude paid and cancelled orders, keep served orders visible
      if (order.status !== 'paid' && order.status !== 'cancelled') {
        activeTables[order.tableNumber] = order
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
  const calculateStatsFromOrders = (ordersData) => {
    try {
      const totalOrders = ordersData.length
      
      // FIXED: Include served orders in pending count (they're still visible for billing)
      const pendingOrders = ordersData.filter(order => 
        ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(order.status)
      ).length
      
      // FIXED: Calculate revenue from paid orders with proper amount
      const totalRevenue = ordersData
        .filter(order => order.status === 'paid')
        .reduce((total, order) => {
          const orderAmount = order.finalTotal || order.totalAmount || 0
          console.log(`💰 Order ${order.orderNumber}: ${orderAmount}`)
          return total + orderAmount
        }, 0)

      console.log(`📊 Stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Revenue: ${totalRevenue}`)
      
      setStats({ totalOrders, pendingOrders, totalRevenue })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  // FIXED: Enhanced order status update - don't delete served orders
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

      // Try to update backend but don't block on failure
      try {
        // Try multiple endpoints
        try {
          await axios.put(`${API_BASE_URL}/orders/${order._id}/status`, { status: newStatus })
        } catch (error) {
          await axios.put(`${API_BASE_URL}/orders/${order._id}`, { status: newStatus })
        }
        console.log('✅ Backend update successful')
      } catch (error) {
        console.warn('⚠️ Backend update failed, but local state updated:', error.message)
      }

      // FIXED: Only clear table and remove from list when order is PAID, not served
      if (newStatus === 'paid') {
        updateTableOrder(order.tableNumber, null)
        
        // Remove from orders list after a delay when PAID
        setTimeout(() => {
          setOrders(prev => prev.filter(o => o.orderNumber !== orderNumber))
        }, 2000)
      }

      console.log('✅ Order status updated successfully')

    } catch (error) {
      console.error('❌ Error updating order status:', error)
      alert('Failed to update order status: ' + error.message)
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderNumber)
        return newSet
      })
    }
  }

  // FIXED: Enhanced combined bill - mark as paid after printing
  const generateCombinedBill = async (tableNumber) => {
    try {
      console.log('🧾 Generating combined bill for table:', tableNumber)
      
      const tableOrders = orders.filter(order => 
        order.tableNumber === tableNumber && 
        order.status !== 'cancelled' && 
        order.status !== 'paid' // Only include orders that are not paid
      )

      if (tableOrders.length === 0) {
        alert(`No active orders found for Table ${tableNumber}`)
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

      // FIXED: Mark all original orders as PAID (not served) after printing bill
      tableOrders.forEach(order => {
        updateOrderStatus(order.orderNumber, 'paid') // Change to 'paid' to remove from list
      })

      // Show success message
      alert(`Combined bill generated for Table ${tableNumber}! All orders marked as paid.`)

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
  const getOrdersByTable = () => {
    const tableGroups = {}
    
    // Initialize all tables 1-10
    for (let i = 1; i <= 10; i++) {
      tableGroups[i] = []
    }
    
    // FIXED: Include served orders (they should be visible for billing)
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
    }
  }

  // Authentication and data initialization
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
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [isAuthenticated])

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
            {/* <div className="stat-info">
              <h3>Today's Revenue</h3>
            <p className="metric-number">₹{analytics.todayRevenue.toFixed(2)}</p>
            </div> */}

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
              {table.currentOrder ? (
                <div className="table-order-info">
                  <p>Order: #{table.currentOrder.orderNumber}</p>
                  <p>Customer: {table.currentOrder.customerName}</p>
                  <p>Status: {getStatusText(table.currentOrder.status)}</p>
                  <div className="table-actions">
                    <button 
                      className="print-bill-btn"
                      onClick={() => printBillAndClearTable(table.currentOrder)}
                    >
                      🖨 Print Bill
                    </button>
                    {getOrdersByTable()[table.tableNumber]?.length > 1 && (
                      <button 
                        className="combine-bill-btn"
                        onClick={() => generateCombinedBill(table.tableNumber)}
                      >
                        🧾 Combined Bill
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="table-empty">
                  <p>No active orders</p>
                </div>
              )}
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