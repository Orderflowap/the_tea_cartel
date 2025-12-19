// components/CombinedBillsManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CombinedBillsManager.css';

// const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api';
const API_BASE_URL = 'https://the-tea-cartel-1.onrender.com/api';

const CombinedBillsManager = () => {
  const [combinedBills, setCombinedBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    avgBillAmount: 0
  });

  const fetchCombinedBills = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = `${API_BASE_URL}/combined-bills`;
      if (dateRange.startDate && dateRange.endDate) {
        url = `${API_BASE_URL}/combined-bills/by-date?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setCombinedBills(response.data.combinedBills);
        calculateStats(response.data.combinedBills);
      } else {
        setError('Failed to load combined bills');
      }
    } catch (error) {
      console.error('Error fetching combined bills:', error);
      setError('Failed to load combined bills: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bills) => {
    const totalBills = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => sum + (bill.finalTotal || 0), 0);
    const avgBillAmount = totalBills > 0 ? totalRevenue / totalBills : 0;
    
    setStats({
      totalBills,
      totalRevenue,
      avgBillAmount
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    fetchCombinedBills();
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    fetchCombinedBills();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const printCombinedBill = (bill) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Combined Bill - ${bill.combinedBillNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .bill-info { margin: 10px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .total-section { margin-top: 20px; text-align: right; }
          .total-row { margin: 5px 0; }
          .final-total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>THE CHAI CARTEL</h1>
          <h3>Combined Bill Report</h3>
        </div>
        
        <div class="bill-info">
          <p><strong>Bill Number:</strong> ${bill.combinedBillNumber}</p>
          <p><strong>Date:</strong> ${formatDate(bill.createdAt)}</p>
          <p><strong>Table:</strong> ${bill.tableNumber}</p>
          <p><strong>Customer:</strong> ${bill.customerName}</p>
          ${bill.mobileNumber ? `<p><strong>Mobile:</strong> ${bill.mobileNumber}</p>` : ''}
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${bill.totalAmount.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (5%):</span>
            <span>₹${bill.taxAmount.toFixed(2)}</span>
          </div>
          <div class="total-row final-total">
            <span>Final Total:</span>
            <span>₹${bill.finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <p><strong>Original Orders:</strong> ${bill.originalOrders.map(o => o.orderNumber).join(', ')}</p>
          <p><strong>Generated By:</strong> ${bill.generatedBy}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">🖨 Print Report</button>
          <button onclick="window.close()" style="padding: 10px 20px; margin-left: 10px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  useEffect(() => {
    fetchCombinedBills();
  }, []);

  return (
    <div className="combined-bills-manager">
      <header className="manager-header">
        <h1>📋 Combined Bills Management</h1>
        <Link to="/reception" className="back-btn">← Back to Dashboard</Link>
      </header>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Combined Bills</h3>
          <p className="stat-number">{stats.totalBills}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Average Bill Amount</h3>
          <p className="stat-number">₹{stats.avgBillAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="filter-section">
        <h3>Filter by Date Range</h3>
        <form onSubmit={handleDateFilter} className="date-filter-form">
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            placeholder="Start Date"
          />
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            placeholder="End Date"
          />
          <button type="submit" className="filter-btn">Apply Filter</button>
          <button type="button" onClick={clearDateFilter} className="clear-btn">
            Clear Filter
          </button>
        </form>
      </div>

      {/* Combined Bills List */}
      <div className="combined-bills-list">
        <div className="list-header">
          <h2>All Combined Bills ({combinedBills.length})</h2>
          <button onClick={fetchCombinedBills} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchCombinedBills}>Retry</button>
          </div>
        )}

        {loading && <div className="loading-message">Loading combined bills...</div>}

        {!loading && !error && combinedBills.length === 0 && (
          <div className="no-bills">
            <p>No combined bills found</p>
            <button onClick={fetchCombinedBills}>Refresh</button>
          </div>
        )}

        <div className="bills-grid">
          {combinedBills.map(bill => (
            <div key={bill._id} className="combined-bill-card">
              <div className="bill-header">
                <h3>{bill.combinedBillNumber}</h3>
                <span className="bill-date">{formatDate(bill.createdAt)}</span>
              </div>
              
              <div className="bill-details">
                <div className="detail-row">
                  <span>Table:</span>
                  <span>{bill.tableNumber}</span>
                </div>
                <div className="detail-row">
                  <span>Customer:</span>
                  <span>{bill.customerName}</span>
                </div>
                <div className="detail-row">
                  <span>Original Orders:</span>
                  <span>{bill.originalOrders.length} orders</span>
                </div>
              </div>

              <div className="bill-items">
                <h4>Items ({bill.items.length}):</h4>
                <div className="items-list">
                  {bill.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {bill.items.length > 3 && (
                    <div className="more-items">+ {bill.items.length - 3} more items</div>
                  )}
                </div>
              </div>

              <div className="bill-totals">
                <div className="total-row">
                  <span>Total:</span>
                  <span>₹{bill.finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bill-actions">
                <button 
                  className="view-btn"
                  onClick={() => printCombinedBill(bill)}
                >
                  👁 View Details
                </button>
                <button 
                  className="print-btn"
                  onClick={() => {
                    // Recreate and print the original bill
                    const tempBill = {
                      orderNumber: bill.combinedBillNumber,
                      tableNumber: bill.tableNumber,
                      customerName: bill.customerName,
                      mobileNumber: bill.mobileNumber,
                      items: bill.items,
                      totalAmount: bill.totalAmount,
                      taxAmount: bill.taxAmount,
                      finalTotal: bill.finalTotal,
                      createdAt: bill.createdAt,
                      isCombinedBill: true
                    };
                    // You'll need to reuse your printThermalBill function
                    window.printThermalBill?.(tempBill);
                  }}
                >
                  🖨 Reprint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <h3>Export Data</h3>
        <div className="export-buttons">
          <button 
            className="export-btn"
            onClick={() => {
              // Export as CSV
              const csvContent = generateCSV(combinedBills);
              downloadCSV(csvContent, `combined-bills-${new Date().toISOString().split('T')[0]}.csv`);
            }}
          >
            📥 Export as CSV
          </button>
          <button 
            className="export-btn"
            onClick={() => {
              // Export as PDF (you'll need a PDF library)
              alert('PDF export feature coming soon!');
            }}
          >
            📄 Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate CSV
const generateCSV = (bills) => {
  const headers = ['Bill Number', 'Date', 'Table', 'Customer', 'Items Count', 'Subtotal', 'Tax', 'Total', 'Original Orders'];
  
  const rows = bills.map(bill => [
    bill.combinedBillNumber,
    new Date(bill.createdAt).toLocaleDateString(),
    bill.tableNumber,
    bill.customerName,
    bill.items.length,
    bill.totalAmount,
    bill.taxAmount,
    bill.finalTotal,
    bill.originalOrders.map(o => o.orderNumber).join(', ')
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Helper function to download CSV
const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default CombinedBillsManager;