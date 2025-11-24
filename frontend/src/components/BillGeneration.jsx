import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillGeneration.css';

const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api';

const BillGeneration = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders/active`);
      setActiveSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBill = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/orders/session/${sessionId}/generate-bill`);
      
      alert('Bill generated successfully!');
      setSelectedSession(response.data.data);
      fetchActiveSessions(); // Refresh list
      
      // Print bill (you can implement print functionality)
      printBill(response.data.data);
      
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Error generating bill: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const printBill = (session) => {
    const billContent = `
      <div class="bill">
        <h2>AMORE MIO RESTAURANT</h2>
        <p>Bill #: ${session.billNumber}</p>
        <p>Table: ${session.tableNumber}</p>
        <p>Customer: ${session.customerName}</p>
        <p>Mobile: ${session.mobileNumber}</p>
        <hr>
        <table width="100%">
          ${session.items.map(item => `
            <tr>
              <td>${item.name} x${item.quantity}</td>
              <td align="right">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
        <hr>
        <table width="100%">
          <tr><td>Subtotal:</td><td align="right">₹${session.subtotal.toFixed(2)}</td></tr>
          <tr><td>Tax (5%):</td><td align="right">₹${session.taxAmount.toFixed(2)}</td></tr>
          <tr><td><strong>Total:</strong></td><td align="right"><strong>₹${session.totalAmount.toFixed(2)}</strong></td></tr>
        </table>
        <p>Thank you for visiting!</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill ${session.billNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .bill { max-width: 300px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            hr { border: 1px dashed #000; }
          </style>
        </head>
        <body>${billContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bill-generation">
      <h1>Bill Generation</h1>
      
      <div className="sessions-list">
        <h2>Active Sessions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : activeSessions.length === 0 ? (
          <p>No active sessions</p>
        ) : (
          activeSessions.map(session => (
            <div key={session._id} className="session-card">
              <div className="session-info">
                <h3>Table {session.tableNumber}</h3>
                <p>Customer: {session.customerName} ({session.mobileNumber})</p>
                <p>Session Started: {new Date(session.sessionStartTime).toLocaleString()}</p>
                <p>Total Items: {session.items.length}</p>
                <p>Current Total: ₹{session.totalAmount.toFixed(2)}</p>
              </div>
              <div className="session-actions">
                <button 
                  onClick={() => generateBill(session.sessionId)}
                  className="btn-primary"
                  disabled={loading}
                >
                  Generate & Print Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillGeneration;