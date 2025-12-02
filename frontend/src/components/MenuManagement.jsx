import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './MenuManagement.css'

const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [categories] = useState([
    'Starters',
    'Main Course',
    'Biryani',
    'Chinese',
    'Italian',
    'Desserts',
    'Beverages',
    'Specials'
  ])
  const [submitting, setSubmitting] = useState(false)


  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    isAvailable: true,
    image: '',
    preparationTime: 15
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/menu`)
      
      // FIXED: Handle different response formats safely
      let items = []
      if (response.data && response.data.success) {
        items = response.data.data || []
      } else if (Array.isArray(response.data)) {
        items = response.data
      }
      
      // Ensure items is always an array
      setMenuItems(Array.isArray(items) ? items : [])
      
    } catch (error) {
      console.error('❌ Error fetching menu items:', error)
      // Set empty array on error to prevent filter errors
      setMenuItems([])
      alert('Error loading menu items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }



  const validateForm = () => {
  const newErrors = {}
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required'
  } else if (formData.name.trim().length < 2) {
    newErrors.name = 'Name must be at least 2 characters long'
  }
  
  if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
    newErrors.price = 'Valid price is required (greater than 0)'
  }
  
  if (!formData.category) {
    newErrors.category = 'Category is required'
  }
  
  if (formData.preparationTime && (isNaN(formData.preparationTime) || parseInt(formData.preparationTime) < 1)) {
    newErrors.preparationTime = 'Preparation time must be at least 1 minute'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

//   const handleSubmit = async (e) => {
//   e.preventDefault()
  
//   if (!validateForm() || submitting) {
//     return
//   }

//   try {
//     setSubmitting(true)
//     const submitData = {
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       price: parseFloat(formData.price),
//       category: formData.category,
//       isVeg: Boolean(formData.isVeg),
//       isAvailable: Boolean(formData.isAvailable),
//       image: formData.image.trim(),
//       preparationTime: parseInt(formData.preparationTime) || 15
//     }

//     console.log('Submitting data:', submitData) // Debug log

//     let response;
//     if (editingItem) {
//       // Update existing item
//       response = await axios.put(`${API_BASE_URL}/menu/${editingItem._id}`, submitData)
//     } else {
//       // Create new item
//       response = await axios.post(`${API_BASE_URL}/menu`, submitData)
//     }

//     console.log('API Response:', response) // Debug log

//     // More robust response handling
//     if (response.data) {
//       if (response.data.success) {
//         // Success case
//         if (editingItem) {
//           setMenuItems(prev => {
//             const safePrev = Array.isArray(prev) ? prev : []
//             return safePrev.map(item => 
//               item._id === editingItem._id ? response.data.data : item
//             )
//           })
//           alert('Menu item updated successfully!')
//         } else {
//           setMenuItems(prev => {
//             const safePrev = Array.isArray(prev) ? prev : []
//             return [response.data.data, ...safePrev]
//           })
//           alert('Menu item added successfully!')
//         }
//         resetForm()
//         setShowAddModal(false)
//       } else {
//         // API returned success: false
//         throw new Error(response.data.message || 'Operation failed')
//       }
//     } else {
//       throw new Error('Invalid response from server')
//     }
//   } catch (error) {
//     console.error('❌ Error saving menu item:', error)
//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error ||
//                         error.message || 
//                         'Error saving menu item. Please try again.'
//     alert(`Error: ${errorMessage}`)
//   }
// }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm() || submitting) {
    return
  }

  try {
    setSubmitting(true)
    
    // Prepare data for API - ensure proper data types
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      isVeg: Boolean(formData.isVeg),
      isAvailable: Boolean(formData.isAvailable),
      image: formData.image.trim(),
      preparationTime: parseInt(formData.preparationTime) || 15
    }

    console.log('🔄 Submitting menu item:', submitData)

    let response
    let url = `${API_BASE_URL}/menu`
    let method = 'POST'

    if (editingItem) {
      url = `${API_BASE_URL}/menu/${editingItem._id}`
      method = 'PUT'
    }

    console.log(`📡 Making ${method} request to:`, url)

    if (editingItem) {
      response = await axios.put(url, submitData)
    } else {
      response = await axios.post(url, submitData)
    }

    console.log('✅ API Response:', response.data)

    // Handle response
    if (response.data && response.data.success) {
      const savedItem = response.data.data
      
      if (editingItem) {
        setMenuItems(prev => {
          const safePrev = Array.isArray(prev) ? prev : []
          return safePrev.map(item => 
            item._id === editingItem._id ? savedItem : item
          )
        })
        alert('✅ Menu item updated successfully!')
      } else {
        setMenuItems(prev => {
          const safePrev = Array.isArray(prev) ? prev : []
          return [savedItem, ...safePrev]
        })
        alert('✅ Menu item added successfully!')
      }
      
      resetForm()
      setShowAddModal(false)
    } else {
      throw new Error(response.data.message || 'Operation failed')
    }
    
  } catch (error) {
    console.error('❌ Error saving menu item:', error)
    
    let errorMessage = 'Error saving menu item. Please try again.'
    
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data
      console.error('Server error details:', serverError)
      
      if (serverError.errors && Array.isArray(serverError.errors)) {
        errorMessage = serverError.errors.join(', ')
      } else if (serverError.message) {
        errorMessage = serverError.message
      } else if (serverError.error) {
        errorMessage = serverError.error
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your connection.'
    } else {
      // Something else happened
      errorMessage = error.message
    }
    
    alert(`❌ Error: ${errorMessage}`)
  } finally {
    setSubmitting(false)
  }
}

// Test your API endpoint with better debugging
// const testAPI = async () => {
//   try {
//     const testData = {
//       name: "API Test Item",
//       description: "Testing API connection",
//       price: 12.99,
//       category: "Starters",
//       isVeg: true,
//       isAvailable: true,
//       preparationTime: 20,
//       image: ""
//     }
    
//     console.log('🧪 Testing API with:', testData)
    
//     const response = await axios.post(`${API_BASE_URL}/menu`, testData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 10000
//     })
    
//     console.log('✅ API Test Successful:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('❌ API Test Failed:')
//     console.error('Error message:', error.message)
//     console.error('Response status:', error.response?.status)
//     console.error('Response data:', error.response?.data)
//     console.error('Request config:', error.config)
//     return null
//   }
// }

// Call this in your component or in a useEffect to test
// useEffect(() => {
//   testAPI()
// }, [])
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      isAvailable: true,
      image: '',
      preparationTime: 15
    })
    setEditingItem(null)
    setErrors({})
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price ? item.price.toString() : '',
      category: item.category || '',
      isVeg: Boolean(item.isVeg),
      isAvailable: Boolean(item.isAvailable),
      image: item.image || '',
      preparationTime: item.preparationTime || 15
    })
    setEditingItem(item)
    setShowAddModal(true)
  }

  const handleDelete = async (itemId, itemName) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/menu/${itemId}`)
      if (response.data && response.data.success) {
        setMenuItems(prev => {
          const safePrev = Array.isArray(prev) ? prev : []
          return safePrev.filter(item => item._id !== itemId)
        })
        alert('Menu item deleted successfully!')
      }
    } catch (error) {
      console.error('❌ Error deleting menu item:', error)
      alert('Error deleting menu item. Please try again.')
    }
  }

  const toggleAvailability = async (item) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/menu/${item._id}/availability`)
      if (response.data && response.data.success) {
        setMenuItems(prev => {
          const safePrev = Array.isArray(prev) ? prev : []
          return safePrev.map(menuItem => 
            menuItem._id === item._id ? response.data.data : menuItem
          )
        })
      }
    } catch (error) {
      console.error('❌ Error toggling availability:', error)
      alert('Error updating availability. Please try again.')
    }
  }


  // Test your API endpoint directly first
const testAPI = async () => {
  try {
    const testData = {
      name: "Test Item",
      description: "Test Description",
      price: 10.99,
      category: "Starters",
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    }
    
    console.log('Testing API with:', testData)
    const response = await axios.post(`${API_BASE_URL}/menu`, testData)
    console.log('Test API Response:', response.data)
    return response.data
  } catch (error) {
    console.error('API Test Failed:', error.response?.data || error.message)
    return null
  }
}

// Call this function somewhere to test your API
// testAPI()
  // FIXED: Safe function to get items by category
  const getItemsByCategory = () => {
    const categorized = {}
    const safeMenuItems = Array.isArray(menuItems) ? menuItems : []
    
    categories.forEach(category => {
      categorized[category] = safeMenuItems.filter(item => item && item.category === category)
    })
    return categorized
  }

  const categorizedItems = getItemsByCategory()

  // FIXED: Safe counting functions
  const totalItems = Array.isArray(menuItems) ? menuItems.length : 0
  const availableItems = Array.isArray(menuItems) ? menuItems.filter(item => item && item.isAvailable).length : 0
  const vegItems = Array.isArray(menuItems) ? menuItems.filter(item => item && item.isVeg).length : 0

  return (
    <div className="menu-management">
      <header className="management-header">
        <div className="header-content">
          <Link to="/reception" className="back-button">
            ← Back to Dashboard
          </Link>
          <h1>Menu Management</h1>
        </div>
      </header>

      <div className="management-content">
        {/* Stats and Actions */}
        <div className="stats-actions-section">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">🍽️</div>
              <div className="stat-info">
                <h3>Total Items</h3>
                <p className="stat-number">{totalItems}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Available</h3>
                <p className="stat-number">{availableItems}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌱</div>
              <div className="stat-info">
                <h3>Veg Items</h3>
                <p className="stat-number">{vegItems}</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="btn-primary"
            >
              + Add New Item
            </button>
            <button onClick={fetchMenuItems} className="btn-secondary" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Menu'}
            </button>
          </div>
        </div>

        {/* Menu Items by Category */}
        <div className="menu-categories">
          {categories.map(category => {
            const categoryItems = categorizedItems[category] || []
            const itemCount = Array.isArray(categoryItems) ? categoryItems.length : 0
            
            return (
              <div key={category} className="category-section">
                <h2 className="category-title">
                  {category} 
                  <span className="item-count">
                    ({itemCount} items)
                  </span>
                </h2>
                
                {itemCount > 0 ? (
                  <div className="menu-items-grid">
                    {categoryItems.map(item => (
                      item && (
                        <div key={item._id} className={`menu-item-card ${!item.isAvailable ? 'disabled' : ''}`}>
                          <div className="item-header">
                            <div className="item-title">
                              <h3>{item.name || 'Unnamed Item'}</h3>
                              <div className="item-badges">
                                {item.isVeg ? (
                                  <span className="badge veg">🌱 Veg</span>
                                ) : (
                                  <span className="badge non-veg">🍗 Non-Veg</span>
                                )}
                                {!item.isAvailable && (
                                  <span className="badge unavailable">🚫 Unavailable</span>
                                )}
                              </div>
                            </div>
                            <div className="item-price">₹{item.price || 0}</div>
                          </div>
                          
                          {item.description && (
                            <p className="item-description">{item.description}</p>
                          )}
                          
                          <div className="item-meta">
                            <span className="prep-time">⏱️ {item.preparationTime || 15} min</span>
                            <span className="category-tag">{item.category}</span>
                          </div>

                          <div className="item-actions">
                            <button 
                              onClick={() => toggleAvailability(item)}
                              className={`btn-sm ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
                            >
                              {item.isAvailable ? 'Disable' : 'Enable'}
                            </button>
                            <button 
                              onClick={() => handleEdit(item)}
                              className="btn-sm btn-primary"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id, item.name)}
                              className="btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="no-items">
                    <p>No items in this category</p>
                    <button 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category }))
                        setShowAddModal(true)
                      }}
                      className="btn-primary btn-sm"
                    >
                      Add Item to {category}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="close-btn"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Item Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter item name"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price (₹) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={errors.price ? 'error' : ''}
                    />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={errors.category ? 'error' : ''}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="preparationTime">Preparation Time (minutes)</label>
                    <input
                      type="number"
                      id="preparationTime"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      placeholder="15"
                      min="1"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter item description"
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="image">Image URL</label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isVeg"
                        checked={formData.isVeg}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Vegetarian Item
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Available for Order
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }} className="btn-secondary">
                    Cancel
                  </button>
                  <button 
  type="submit" 
  className="btn-primary" 
  disabled={submitting}
>
  {submitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuManagement