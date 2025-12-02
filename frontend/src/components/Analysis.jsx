



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Analysis.css';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

const Analysis = () => {
  const [analytics, setAnalytics] = useState({
    todayOrders: 0,
    monthlyOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: [],
    popularItems: [],
    hourlyOrders: [],
    categoryRevenue: [],
    monthlyHistory: [] // NEW: For past months revenue
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allOrders, setAllOrders] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');
  
  // NEW: Date range filter state
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredRevenue, setFilteredRevenue] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📊 Fetching all orders for analytics...');
      
      const response = await axios.get(`${API_BASE_URL}/orders`);
      console.log('✅ Orders fetched:', response.data);
      
      let ordersData = [];
      
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else {
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          ordersData = possibleArrays[0];
        }
      }
      
      setAllOrders(ordersData);
      setDebugInfo(`Loaded ${ordersData.length} orders for analysis`);
      console.log(`📈 Processing ${ordersData.length} orders for analytics`);
      
      calculateAllAnalytics(ordersData);
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Failed to load orders data for analytics');
      setLoading(false);
    }
  };

  const calculateAllAnalytics = (orders) => {
    try {
      console.log('🧮 Calculating analytics from orders...');
      
      if (!orders || orders.length === 0) {
        console.warn('⚠️ No orders found for analytics');
        setAnalytics({
          todayOrders: 0,
          monthlyOrders: 0,
          todayRevenue: 0,
          monthlyRevenue: 0,
          dailyRevenue: [],
          popularItems: [],
          hourlyOrders: [],
          categoryRevenue: [],
          monthlyHistory: []
        });
        setLoading(false);
        return;
      }

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      // Filter today's orders
      const todayOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= todayStart && order.status !== 'cancelled';
      });

      // Filter this month's orders
      const monthlyOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && order.status !== 'cancelled';
      });

      // Calculate revenues
      const todayRevenue = todayOrders.reduce((sum, order) => {
        const amount = order.finalTotal || order.totalAmount || 0;
        return sum + amount;
      }, 0);

      const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
        const amount = order.finalTotal || order.totalAmount || 0;
        return sum + amount;
      }, 0);

      // NEW: Calculate monthly history
      const monthlyHistory = calculateMonthlyHistory(orders);
      
      // Calculate other analytics
      const dailyRevenue = calculateLast7DaysRevenue(orders);
      const popularItems = calculatePopularItems(orders);
      const hourlyOrders = calculateHourlyOrders(orders);

      setAnalytics({
        todayOrders: todayOrders.length,
        monthlyOrders: monthlyOrders.length,
        todayRevenue,
        monthlyRevenue,
        dailyRevenue,
        popularItems,
        hourlyOrders,
        categoryRevenue: [],
        monthlyHistory // NEW: Add monthly history
      });

      console.log('✅ Analytics calculated successfully');
      
    } catch (error) {
      console.error('❌ Error calculating analytics:', error);
      setError('Error calculating analytics data');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Calculate monthly revenue history
  const calculateMonthlyHistory = (orders) => {
    const monthlyData = {};
    
    orders.forEach(order => {
      if (!order.createdAt || order.status === 'cancelled') return;
      
      const orderDate = new Date(order.createdAt);
      const monthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = orderDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          revenue: 0,
          orders: 0,
          year: orderDate.getFullYear(),
          monthIndex: orderDate.getMonth()
        };
      }
      
      monthlyData[monthKey].revenue += order.finalTotal || order.totalAmount || 0;
      monthlyData[monthKey].orders += 1;
    });
    
    // Convert to array and sort by date (newest first)
    const result = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthIndex - a.monthIndex;
    });
    
    console.log('📅 Monthly History:', result);
    return result;
  };

  // NEW: Calculate revenue for custom date range
  const calculateDateRangeRevenue = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // Include entire end date

    if (startDate > endDate) {
      alert('Start date cannot be after end date');
      return;
    }

    const filteredOrders = allOrders.filter(order => {
      if (!order.createdAt || order.status === 'cancelled') return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const revenue = filteredOrders.reduce((sum, order) => {
      return sum + (order.finalTotal || order.totalAmount || 0);
    }, 0);

    const ordersCount = filteredOrders.length;
    const averageOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;

    setFilteredRevenue({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      revenue,
      ordersCount,
      averageOrderValue,
      period: `${dateRange.startDate} to ${dateRange.endDate}`
    });

    console.log('📅 Date Range Revenue:', {
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      orders: ordersCount,
      revenue: revenue
    });
  };

  // NEW: Reset date range filter
  const resetDateRange = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFilteredRevenue(null);
  };

  const calculateLast7DaysRevenue = (orders) => {
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= dateStart && orderDate < dateEnd && order.status !== 'cancelled';
      });
      
      const revenue = dayOrders.reduce((sum, order) => {
        return sum + (order.finalTotal || order.totalAmount || 0);
      }, 0);
      
      result.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        revenue,
        orders: dayOrders.length
      });
    }
    
    return result;
  };

  const calculatePopularItems = (orders) => {
    const itemCount = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemName = item.name || item.menuItem?.name || 'Unknown Item';
          const quantity = item.quantity || 1;
          itemCount[itemName] = (itemCount[itemName] || 0) + quantity;
        });
      }
    });
    
    const popular = Object.entries(itemCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    
    return popular;
  };

  const calculateHourlyOrders = (orders) => {
    const hourlyCount = Array(24).fill(0);
    
    orders.forEach(order => {
      if (order.createdAt && order.status !== 'cancelled') {
        const hour = new Date(order.createdAt).getHours();
        hourlyCount[hour]++;
      }
    });
    
    const result = hourlyCount.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      orders: count
    }));
    
    return result;
  };

  // Calculate max values for chart scaling
  const maxDailyRevenue = Math.max(...analytics.dailyRevenue.map(d => d.revenue), 1);
  const maxHourlyOrders = Math.max(...analytics.hourlyOrders.map(h => h.orders), 1);
  const maxMonthlyRevenue = Math.max(...analytics.monthlyHistory.map(m => m.revenue), 1);

  if (loading) {
    return (
      <div className="analysis-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading analytics data...
          {debugInfo && <div className="debug-info">{debugInfo}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <header className="analysis-header">
        <div className="header-top">
          <h1>📊 Business Analytics</h1>
          <div className="header-actions">
            <Link to="/reception" className="btn-primary">← Back to Dashboard</Link>
            <button onClick={fetchAllOrders} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {debugInfo && (
          <div className="debug-info">
            {debugInfo} • {allOrders.length} total orders
          </div>
        )}
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* NEW: Date Range Filter */}
      <div className="date-filter-card">
        <h3>📅 Custom Date Range Analysis</h3>
        <div className="date-filter-controls">
          <div className="date-input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <button onClick={calculateDateRangeRevenue} className="btn-primary">
            Analyze Period
          </button>
          <button onClick={resetDateRange} className="btn-secondary">
            Reset
          </button>
        </div>

        {filteredRevenue && (
          <div className="filtered-results">
            <h4>Results for {filteredRevenue.period}:</h4>
            <div className="filtered-metrics">
              <div className="filtered-metric">
                <span className="metric-label">Total Revenue:</span>
                <span className="metric-value">₹{filteredRevenue.revenue.toFixed(2)}</span>
              </div>
              <div className="filtered-metric">
                <span className="metric-label">Orders:</span>
                <span className="metric-value">{filteredRevenue.ordersCount}</span>
              </div>
              <div className="filtered-metric">
                <span className="metric-label">Average Order Value:</span>
                <span className="metric-value">₹{filteredRevenue.averageOrderValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>Today's Orders</h3>
            <p className="metric-number">{analytics.todayOrders}</p>
            <span className="metric-label">Total orders today</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h3>Monthly Orders</h3>
            <p className="metric-number">{analytics.monthlyOrders}</p>
            <span className="metric-label">Orders this month</span>
          </div>
        </div>

        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Today's Revenue</h3>
            <p className="metric-number">₹{analytics.todayRevenue.toFixed(2)}</p>
            <span className="metric-label">Revenue generated today</span>
          </div>
        </div>

        <div className="metric-card revenue">
          <div className="metric-icon">💵</div>
          <div className="metric-info">
            <h3>Monthly Revenue</h3>
            <p className="metric-number">₹{analytics.monthlyRevenue.toFixed(2)}</p>
            <span className="metric-label">Revenue this month</span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="analytics-grid">
        {/* NEW: Monthly Revenue History */}
        <div className="analytics-card">
          <h3>📊 Monthly Revenue History</h3>
          {analytics.monthlyHistory.length > 0 ? (
            <div className="monthly-revenue-bars">
              {analytics.monthlyHistory.map((month, index) => (
                <div key={index} className="month-bar-container">
                  <div className="month-bar-label">{month.month}</div>
                  <div className="month-bar">
                    <div 
                      className="month-fill"
                      style={{ 
                        height: `${Math.max((month.revenue / maxMonthlyRevenue) * 100, 5)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="month-amount">₹{month.revenue.toFixed(2)}</div>
                  <div className="month-orders">{month.orders} orders</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No monthly history data available</div>
          )}
        </div>

        {/* Daily Revenue Chart */}
        <div className="analytics-card">
          <h3>📅 Daily Revenue (Last 7 Days)</h3>
          {analytics.dailyRevenue.length > 0 ? (
            <div className="revenue-bars">
              {analytics.dailyRevenue.map((day, index) => (
                <div key={index} className="revenue-bar-container">
                  <div className="revenue-bar-label">{day.date}</div>
                  <div className="revenue-bar">
                    <div 
                      className="revenue-fill"
                      style={{ 
                        height: `${Math.max((day.revenue / maxDailyRevenue) * 100, 5)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="revenue-amount">₹{day.revenue.toFixed(2)}</div>
                  <div className="revenue-orders">{day.orders} orders</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No revenue data available</div>
          )}
        </div>

        {/* Popular Items */}
        <div className="analytics-card">
          <h3>🏆 Most Popular Items</h3>
          {analytics.popularItems.length > 0 ? (
            <div className="popular-items">
              {analytics.popularItems.map((item, index) => (
                <div key={index} className="popular-item">
                  <span className="item-rank">#{index + 1}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-count">{item.count} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No popular items data</div>
          )}
        </div>

        {/* Hourly Distribution */}
        <div className="analytics-card">
          <h3>🕒 Order Distribution by Hour</h3>
          {analytics.hourlyOrders.some(hour => hour.orders > 0) ? (
            <div className="hourly-chart">
              {analytics.hourlyOrders.map((hourData, index) => (
                <div key={index} className="hour-bar-container">
                  <div className="hour-label">{hourData.hour}</div>
                  <div className="hour-bar">
                    <div 
                      className="hour-fill"
                      style={{ 
                        width: `${Math.max((hourData.orders / maxHourlyOrders) * 100, 5)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="hour-count">{hourData.orders}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No hourly data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;