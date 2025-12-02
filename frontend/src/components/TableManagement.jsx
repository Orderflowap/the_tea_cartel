


import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TableManagement.css'

const API_BASE_URL = 'https://orderflow-backend-v964.onrender.com/api'

const TableManagement = () => {
  const [tables, setTables] = useState([])
  const [newTableNumber, setNewTableNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingQR, setGeneratingQR] = useState(null)

  // Initialize with default tables or load from localStorage
  useEffect(() => {
    loadTablesFromStorage()
  }, [])

  // Load tables from localStorage or initialize empty
  const loadTablesFromStorage = () => {
    try {
      const savedTables = localStorage.getItem('restaurantTables')
      if (savedTables) {
        setTables(JSON.parse(savedTables))
      } else {
        // Initialize with some default tables
        const defaultTables = [
          { _id: '1', tableNumber: 1, isOccupied: false, createdAt: new Date() },
          { _id: '2', tableNumber: 2, isOccupied: false, createdAt: new Date() },
          { _id: '3', tableNumber: 3, isOccupied: false, createdAt: new Date() },
          { _id: '4', tableNumber: 4, isOccupied: false, createdAt: new Date() },
          { _id: '5', tableNumber: 5, isOccupied: false, createdAt: new Date() },
        ]
        setTables(defaultTables)
        localStorage.setItem('restaurantTables', JSON.stringify(defaultTables))
      }
    } catch (error) {
      console.error('Error loading tables:', error)
      setTables([])
    }
  }

  const saveTablesToStorage = (updatedTables) => {
    try {
      localStorage.setItem('restaurantTables', JSON.stringify(updatedTables))
    } catch (error) {
      console.error('Error saving tables:', error)
    }
  }

  const fetchTables = () => {
    setLoading(true)
    setTimeout(() => {
      loadTablesFromStorage()
      setLoading(false)
    }, 500)
  }

  const generateTableQR = async () => {
    if (!newTableNumber || isNaN(newTableNumber)) {
      alert('Please enter a valid table number')
      return
    }
    
    const tableNum = parseInt(newTableNumber)
    if (tableNum < 1 || tableNum > 50) {
      alert('Please enter a table number between 1 and 50')
      return
    }
    
    try {
      setGeneratingQR(tableNum)
      
      // Check if table already exists
      const existingTable = tables.find(t => t.tableNumber === tableNum)
      if (existingTable) {
        alert(`Table ${tableNum} already exists!`)
        return
      }

      // Create new table
      const newTable = {
        _id: `table_${Date.now()}`,
        tableNumber: tableNum,
        isOccupied: false,
        createdAt: new Date()
      }

      const updatedTables = [...tables, newTable]
      setTables(updatedTables)
      saveTablesToStorage(updatedTables)
      
      setNewTableNumber('')
      alert(`QR code generated successfully for Table ${tableNum}`)
      
    } catch (error) {
      console.error('Error generating table QR:', error)
      alert('Error generating QR code. Please try again.')
    } finally {
      setGeneratingQR(null)
    }
  }

  // QR code generation function
  const generateQRCodeImage = (tableNumber) => {
    const baseUrl = 'https://dapper-muffin-326944.netlify.app'
    const url = `${baseUrl}/order/${tableNumber}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&format=png&margin=10&qzone=1`
  }

  const printQRCode = (tableNumber) => {
    try {
      const printWindow = window.open('', '_blank', 'width=400,height=600')
      const baseUrl = 'https://dapper-muffin-326944.netlify.app'
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Table ${tableNumber} QR Code</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .print-container {
              max-width: 300px;
              margin: 0 auto;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
            }
            .table-number {
              font-size: 20px;
              color: #666;
              margin-bottom: 20px;
            }
            .qr-container {
              margin: 20px 0;
              padding: 15px;
              border: 2px solid #333;
              border-radius: 10px;
              background: white;
            }
            .instructions {
              margin-top: 15px;
              color: #888;
              font-size: 16px;
              font-weight: bold;
            }
            .url {
              margin-top: 10px;
              font-size: 12px;
              color: #666;
              word-break: break-all;
              padding: 0 10px;
            }
            @media print {
              body { 
                padding: 10px;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .print-container { 
                max-width: 80mm;
                transform: scale(0.9);
              }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="restaurant-name">AMORE MIO</div>
            <div class="table-number">Table ${tableNumber}</div>
            <div class="qr-container">
              <img 
                src="${generateQRCodeImage(tableNumber)}" 
                alt="QR Code for Table ${tableNumber}" 
                style="width: 100%; height: auto;"
                onload="setTimeout(() => window.print(), 1000)"
              />
            </div>
            <div class="instructions">
              Scan to order from your table
            </div>
            <div class="url">
              ${baseUrl}/order/${tableNumber}
            </div>
          </div>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print QR Code
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error('Error printing QR code:', error)
      alert('Error opening print window. Please try again.')
    }
  }

  const downloadQRCode = (tableNumber) => {
    try {
      const link = document.createElement('a')
      link.href = generateQRCodeImage(tableNumber)
      link.download = `table-${tableNumber}-qrcode.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading QR code:', error)
      alert('Error downloading QR code. Please try again.')
    }
  }

  const deleteTable = (tableNumber) => {
    if (!confirm(`Are you sure you want to delete Table ${tableNumber}?`)) {
      return
    }
    
    const updatedTables = tables.filter(table => table.tableNumber !== tableNumber)
    setTables(updatedTables)
    saveTablesToStorage(updatedTables)
    alert(`Table ${tableNumber} deleted successfully`)
  }

  return (
    <div className="table-management">
      <header className="management-header">
        <div className="header-content">
          <Link to="/reception" className="back-button">
            ← Back to Dashboard
          </Link>
          <h1>Table Management</h1>
          <p>Generate and manage QR codes for your tables</p>
        </div>
      </header>

      <div className="management-content">
        <div className="add-table-section">
          <div className="add-table-form">
            <h2>Add New Table</h2>
            <div className="form-row">
              <input
                type="number"
                placeholder="Enter table number (1-50)"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                min="1"
                max="50"
                className="table-input"
              />
              <button 
                onClick={generateTableQR}
                disabled={!newTableNumber || generatingQR}
                className="btn-primary"
              >
                {generatingQR ? (
                  <>
                    <div className="loading-spinner"></div>
                    Generating...
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="tables-section">
          <div className="section-header">
            <h2>Existing Tables ({tables.length})</h2>
            <button onClick={fetchTables} className="btn-secondary" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Loading tables...</div>
          ) : (
            <div className="tables-grid">
              {tables.length === 0 ? (
                <div className="no-tables">
                  <p>No tables created yet</p>
                  <small>Add your first table using the form above</small>
                </div>
              ) : (
                tables.map(table => (
                  <div key={table._id} className="table-card">
                    <div className="table-header">
                      <h3>Table {table.tableNumber}</h3>
                      <div className="table-header-actions">
                        <span className={`status ${table.isOccupied ? 'occupied' : 'available'}`}>
                          {table.isOccupied ? '🟡 Occupied' : '🟢 Available'}
                        </span>
                        <button 
                          onClick={() => deleteTable(table.tableNumber)}
                          className="delete-btn"
                          title="Delete Table"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="qr-code-container">
                      <img 
                        src={generateQRCodeImage(table.tableNumber)}
                        alt={`QR Code for Table ${table.tableNumber}`}
                        className="qr-image"
                        onError={(e) => {
                          console.error('QR code failed to load')
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'block'
                        }}
                      />
                      <div className="qr-fallback" style={{display: 'none'}}>
                        <p>QR Code Preview</p>
                        <small>Image will load when printing</small>
                      </div>
                    </div>
                    
                    <div className="table-actions">
                      <button 
                        onClick={() => printQRCode(table.tableNumber)}
                        className="btn-primary"
                      >
                        🖨️ Print QR
                      </button>
                      <button
                        onClick={() => downloadQRCode(table.tableNumber)}
                        className="btn-secondary"
                      >
                        📥 Download
                      </button>
                    </div>
                    
                    <div className="table-info">
                      <p className="table-url">
                        <strong>Order URL:</strong><br />
                        https://dapper-muffin-326944.netlify.app/order/{table.tableNumber}
                      </p>
                      <small className="created-date">
                        Created: {new Date(table.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableManagement