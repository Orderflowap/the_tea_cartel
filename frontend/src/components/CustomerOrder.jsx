

//2
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
// import menuItems from './menuItems'
import menuItems from '../data/menuItems' // Import your hardcoded menu items
import './CustomerOrder.css'
import background from '../assets/barista.jpg';
const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'
import logo from '../assets/logo.png';
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
  const [showCart, setShowCart] = useState(false)
  const menuRef = useRef(null);

  useEffect(() => {
    loadMenuFromFile()
  }, [])

  // Load menu from hardcoded file instead of API
  const loadMenuFromFile = () => {
    try {
      setLoading(true);
      
      console.log('📋 Loading menu from file...');
      console.log('📦 Menu items:', menuItems);
      
      // Filter only available items
      const availableItems = menuItems.filter(item => item.isAvailable);
      
      if (availableItems.length === 0) {
        console.warn('⚠️ No available menu items found');
        setMenu([]);
        setCategories([]);
        return;
      }
      
      // Transform the data to match your existing structure
      const transformedMenu = availableItems.map(item => ({
        _id: item.id.toString(), // Convert number ID to string to match your existing code
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        isVeg: item.isVegetarian, // Map isVegetarian to isVeg
        isAvailable: item.isAvailable,
        preparationTime: item.preparationTime
      }));
      
      console.log('✅ Transformed menu:', transformedMenu);
      setMenu(transformedMenu);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(transformedMenu.map(item => item.category))];
      console.log('📂 Categories:', uniqueCategories);
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('❌ Error loading menu from file:', error);
      alert('Error loading menu. Please try again.');
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
    
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      isVeg: item.isVeg
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

  const getCartQuantity = (itemId) => {
    const cartItem = cart.find(item => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

const placeOrder = async () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  try {
    setLoading(true);
    
    console.log('🛒 Cart items:', cart);
    
    const orderData = {
      tableNumber: parseInt(tableNumber),
      customerName: customerInfo.name,
      mobileNumber: customerInfo.mobileNumber,
      items: cart.map(item => ({
        // menuItem: item._id, 

        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getTotalAmount()
    };

    console.log('📦 Order data with valid ObjectIds:', orderData);

    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    
    console.log('✅ Order response:', response.data);
    // alert(`Order placed successfully!", order id ${response}`);

    // alert(`Order placed successfully! Your order number is: ${response.data.order.orderNumber}`);
    alert(`✅ Order placed successfully! Your order number is: ${response.data.orderNumber || response.data.order?.orderNumber}`);

    setCart([]);
    setShowCart(false);
    
  } catch (error) {
    console.error('❌ Full error details:', error);
    
    if (error.response && error.response.data) {
      console.error('❌ Backend error message:', error.response.data);
      alert(`Error: ${error.response.data.message || error.response.data.error}`);
    } else {
      alert('Error placing order. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}


const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const randomValue = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return timestamp + randomValue + counter;
}

  const filteredMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === activeCategory)

  if (!isInfoSubmitted) {
    return (
      <div className="customer-info-container">
        <div className="customer-info-form">
          <div className="restaurant-header">
            <h3>Amore Mio</h3>
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
      <div className='cafe-name-overlay'>
        <img src={background} alt='cafe-img'/>
        {/* <img src={logo} className='logo-overlay'/> */}
        <div className='cafe-name'>Amore Mio</div>
        <button className='btn-primary'
          onClick={() => {
            if (menuRef.current) {
              menuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}>Start Ordering</button>
      </div>
      <header className="order-header">
        <div className="header-content">
          {/* <div className="header-left"> */}
            {/* <p>Table {tableNumber} • Ready to order delicious food</p> */}
          {/* </div> */}
          <div className="header-right">
            <button 
              className="cart-icon-btn"
              onClick={() => setShowCart(true)}
            >
              <span className="cart-icon">🛒</span>
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="order-container">
        <div className="menu-section" ref={menuRef}> 
          <div className="section-header">
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
            <div className="menu-grid">
              {filteredMenu.map(item => {
                const cartQuantity = getCartQuantity(item._id);
                return (
                  <div key={item._id} className="menu-item-card">
                    <div className="menu-item-image">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', item.image);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">☕</div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <div className="item-header">
                        <h3 className="item-left">{item.name}</h3>
                        <div className="veg-indicator">
                          {item.isVeg ? (
                            <span className="veg-icon">Veg</span>
                          ) : (
                            <span className="non-veg-icon">Non-Veg</span>
                          )}
                        </div>
                      </div>
                      {/* <p className="item-description">{item.description}</p> */}
                      
                      <div className="item-meta">
                        <span className="item-price">₹{item.price}</span>
                        {item.preparationTime && (
                          <span className="preparation-time item-right">⏱️ {item.preparationTime}min</span>
                        )}
                      </div>

                      <div className="item-actions">
                        {cartQuantity > 0 ? (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn minus"
                              onClick={() => updateQuantity(item._id, cartQuantity - 1)}
                            >
                              −
                            </button>
                            <span className="quantity-display">{cartQuantity}</span>
                            <button
                              className="quantity-btn plus"
                              onClick={() => updateQuantity(item._id, cartQuantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(item)}
                            disabled={!item.isAvailable}
                          >
                            {item.isAvailable ? 'Add' : 'Unavailable'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="cart-modal-header">
              <h2>Your Order 🛒</h2>
              <button 
                className="close-cart-btn"
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>
            
            <div className="cart-modal-content">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <p>Your cart is empty</p>
                  <small>Add items from the menu to get started</small>
                </div>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cart.map(item => (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-header">
                          <div className="cart-veg-indicator">
                            {item.isVeg ? '🟢' : '🔴'}
                          </div>
                          <div className="cart-item-details">
                            <h4>{item.name}</h4>
                            <p className="item-price">₹{item.price}</p>
                          </div>
                        </div>
                        <div className="cart-quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">
                          ₹{item.price * item.quantity}
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-total">
                    <div className="total-line">
                      <span>Subtotal:</span>
                      <span>₹{getTotalAmount()}</span>
                    </div>
                    <div className="total-line">
                      <span>Tax (5%):</span>
                      <span>₹{(getTotalAmount() * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="total-line grand-total">
                      <span>Total:</span>
                      <span>₹{(getTotalAmount() * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="place-order-btn"
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      `Place Order • ₹${(getTotalAmount() * 1.05).toFixed(2)}`
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerOrder


