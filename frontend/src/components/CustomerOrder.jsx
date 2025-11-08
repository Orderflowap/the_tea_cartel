import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './CustomerOrder.css'

const API_BASE_URL = 'http://localhost:5000/api'

const CustomerOrder = () => {
  const { tableNumber } = useParams()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    mobileNumber: ''
  })
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [isInfoSubmitted, setIsInfoSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMenu()
  }, [])

  // const fetchMenu = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await axios.get(`${API_BASE_URL}/menu`)
  //     setMenu(response.data)
      
  //     // Extract unique categories
  //     const uniqueCategories = [...new Set(response.data.map(item => item.category))]
  //     setCategories(uniqueCategories)
  //   } catch (error) {
  //     console.error('Error fetching menu:', error)
  //     alert('Error loading menu. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchMenu = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/menu`);
    
    // If menu is empty, show message
    if (response.data.length === 0) {
      setMenu([]);
      setCategories([]);
      alert('Menu is empty. Please add menu items first.');
      return;
    }
    
    setMenu(response.data);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(response.data.map(item => item.category))];
    setCategories(uniqueCategories);
  } catch (error) {
    console.error('Error fetching menu:', error);
    
    // If menu endpoint fails, show sample data for testing
    const sampleMenu = [
      {
        _id: '1',
        name: 'Sample Pizza',
        description: 'This is sample data - add real menu items',
        price: 12.99,
        category: 'Pizza',
        isAvailable: true,
        preparationTime: 15
      },
      {
        _id: '2', 
        name: 'Sample Burger',
        description: 'This is sample data - add real menu items',
        price: 9.99,
        category: 'Burgers',
        isAvailable: true,
        preparationTime: 10
      }
    ];
    
    setMenu(sampleMenu);
    setCategories(['Pizza', 'Burgers']);
    
    alert('Menu not loaded. Using sample data for demonstration.');
  } finally {
    setLoading(false);
  }
};

  const handleInfoSubmit = (e) => {
    e.preventDefault()
    if (customerInfo.name && customerInfo.mobileNumber) {
      if (customerInfo.mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number')
        return
      }
      setIsInfoSubmitted(true)
    } else {
      alert('Please fill in all fields')
    }
  }

const addToCart = (item) => {
  console.log('➕ Adding to cart:', item);
  
  // Make sure the item has all required fields
  const cartItem = {
    _id: item._id, // This is crucial for the order
    name: item.name,
    price: item.price,
    quantity: 1
  };

  const existingItem = cart.find(cartItem => cartItem._id === item._id);
  
  if (existingItem) {
    setCart(cart.map(cartItem =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    ));
  } else {
    setCart([...cart, cartItem]);
  }
};

  // const addToCart = (item) => {

  //   // const existingItem = cart.find(cartItem => cartItem._id === item._id)
    
  //   if (existingItem) {
  //     setCart(cart.map(cartItem =>
  //       cartItem._id === item._id
  //         ? { ...cartItem, quantity: cartItem.quantity + 1 }
  //         : cartItem
  //     ))
  //   } else {
  //     setCart([...cart, { ...item, quantity: 1 }])
  //   }
  // }

  

  
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    
    setCart(cart.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // const placeOrder = async () => {
  //   if (cart.length === 0) {
  //     alert('Your cart is empty. Please add items before placing an order.')
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     const orderData = {
  //       tableNumber: parseInt(tableNumber),
  //       customerName: customerInfo.name,
  //       mobileNumber: customerInfo.mobileNumber,
  //       items: cart.map(item => ({
  //         menuItem: item._id,
  //         quantity: item.quantity,
  //         price: item.price
  //       }))
  //     }

  //     const response = await axios.post(`${API_BASE_URL}/orders`, orderData)
  //     alert(`Order placed successfully! Your order number is: ${response.data.order.orderNumber}`)
  //     setCart([])
  //   } catch (error) {
  //     console.error('Error placing order:', error)
  //     alert('Error placing order. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const placeOrder = async () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  try {
    setLoading(true);
    
    // Debug: log what we're sending
    console.log('🛒 Cart items:', cart);
    
    const orderData = {
      tableNumber: parseInt(tableNumber),
      customerName: customerInfo.name,
      mobileNumber: customerInfo.mobileNumber,
      items: cart.map(item => ({
        menuItem: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getTotalAmount() // Add this line - IMPORTANT!
    };

    console.log('📦 Order data:', orderData);

    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    
    console.log('✅ Order response:', response.data);
    
    alert(`Order placed successfully! Your order number is: ${response.data.order.orderNumber}`);
    setCart([]);
    
  } catch (error) {
    console.error('❌ Full error details:', error);
    
    // Show the actual backend error message
    if (error.response && error.response.data) {
      console.error('❌ Backend error message:', error.response.data.message);
      alert(`Error: ${error.response.data.message}`);
    } else {
      alert('Error placing order. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}

  const filteredMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === activeCategory)

  if (!isInfoSubmitted) {
    return (
      <div className="customer-info-container">
        <div className="customer-info-form">
          <div className="restaurant-header">
            <h1>🍽️ Delicious Restaurant</h1>
            <p>Table {tableNumber}</p>
          </div>
          <form onSubmit={handleInfoSubmit}>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="tel"
                value={customerInfo.mobileNumber}
                onChange={(e) => setCustomerInfo({...customerInfo, mobileNumber: e.target.value})}
                required
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : 'Start Ordering'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="customer-order">
      <header className="order-header">
        <div className="header-content">
          <h1>Welcome, {customerInfo.name}! 👋</h1>
          <p>Table {tableNumber} • Ready to order delicious food</p>
        </div>
      </header>

      <div className="order-container">
        <div className="menu-section">
          <div className="section-header">
            <h2>Our Menu</h2>
            <div className="category-tabs">
              <button
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-message">Loading menu...</div>
          ) : (
            <div className="menu-items">
              {filteredMenu.map(item => (
                <div key={item._id} className="menu-item-card">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-footer">
                      <span className="item-price">₹{item.price}</span>
                      {item.preparationTime && (
                        <span className="preparation-time">⏱️ {item.preparationTime} min</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                    disabled={!item.isAvailable}
                  >
                    {item.isAvailable ? 'Add +' : 'Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h2>🛒 Your Order</h2>
            <p>Table {tableNumber}</p>
          </div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <small>Add items from the menu to get started</small>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">₹{item.price} x {item.quantity}</p>
                    <p className="item-total">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="total-section">
                <div className="total-amount">
                  <h3>Total Amount: ₹{getTotalAmount()}</h3>
                </div>
                <button 
                  className="place-order-btn" 
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? <div className="loading-spinner"></div> : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerOrder