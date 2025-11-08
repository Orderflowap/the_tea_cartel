// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import {QRCodeSVG} from 'qrcode.react'
// import './TableManagement.css'

// const API_BASE_URL = 'http://localhost:5000/api'

// const TableManagement = () => {
//   const [tables, setTables] = useState([])
//   const [newTableNumber, setNewTableNumber] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [generatingQR, setGeneratingQR] = useState(null)

//   useEffect(() => {
//     fetchTables()
//   }, [])

//   const fetchTables = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${API_BASE_URL}/tables`)
//       setTables(response.data)
//     } catch (error) {
//       console.error('Error fetching tables:', error)
//       alert('Error loading tables. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateTableQR = async () => {
//     if (!newTableNumber || isNaN(newTableNumber)) {
//       alert('Please enter a valid table number')
//       return
//     }
    
//     try {
//       setGeneratingQR(newTableNumber)
//       await axios.post(`${API_BASE_URL}/tables/generate`, {
//         tableNumber: parseInt(newTableNumber)
//       })
//       setNewTableNumber('')
//       fetchTables()
//       alert(`QR code generated successfully for Table ${newTableNumber}`)
//     } catch (error) {
//       console.error('Error generating table QR:', error)
//       if (error.response?.data?.message) {
//         alert(error.response.data.message)
//       } else {
//         alert('Error generating QR code. Please try again.')
//       }
//     } finally {
//       setGeneratingQR(null)
//     }
//   }

//   const printQRCode = (tableNumber, qrCode) => {
//     const printWindow = window.open('', '_blank')
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Table ${tableNumber} QR Code</title>
//           <style>
//             body { 
//               font-family: Arial, sans-serif; 
//               text-align: center; 
//               padding: 2rem;
//             }
//             .qr-container { 
//               margin: 2rem auto; 
//               max-width: 300px;
//             }
//             .table-info {
//               margin-bottom: 1rem;
//             }
//             .restaurant-name {
//               font-size: 1.5rem;
//               font-weight: bold;
//               margin-bottom: 0.5rem;
//               color: #333;
//             }
//             .table-number {
//               font-size: 1.2rem;
//               color: #666;
//             }
//             .instructions {
//               margin-top: 1rem;
//               color: #888;
//               font-size: 0.9rem;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="table-info">
//             <div class="restaurant-name">Delicious Restaurant</div>
//             <div class="table-number">Table ${tableNumber}</div>
//           </div>
//           <div class="qr-container">
//             <img src="${qrCode}" alt="QR Code for Table ${tableNumber}" style="width: 100%; height: auto;" />
//           </div>
//           <div class="instructions">
//             Scan to order from your table
//           </div>
//         </body>
//       </html>
//     `)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   return (
//     <div className="table-management">
//       <header className="management-header">
//         <div className="header-content">
//           <Link to="/reception" className="back-button">
//             ← Back to Dashboard
//           </Link>
//           <h1>Table Management</h1>
//           <p>Generate and manage QR codes for your tables</p>
//         </div>
//       </header>

//       <div className="management-content">
//         <div className="add-table-section">
//           <div className="add-table-form">
//             <h2>Add New Table</h2>
//             <div className="form-row">
//               <input
//                 type="number"
//                 placeholder="Enter table number"
//                 value={newTableNumber}
//                 onChange={(e) => setNewTableNumber(e.target.value)}
//                 min="1"
//                 className="table-input"
//               />
//               <button 
//                 onClick={generateTableQR}
//                 disabled={!newTableNumber || generatingQR}
//                 className="btn-primary"
//               >
//                 {generatingQR ? (
//                   <div className="loading-spinner"></div>
//                 ) : (
//                   'Generate QR Code'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="tables-section">
//           <div className="section-header">
//             <h2>Existing Tables</h2>
//             <button onClick={fetchTables} className="btn-secondary" disabled={loading}>
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>

//           {loading ? (
//             <div className="loading-message">Loading tables...</div>
//           ) : (
//             <div className="tables-grid">
//               {tables.length === 0 ? (
//                 <div className="no-tables">
//                   <p>No tables created yet</p>
//                   <small>Add your first table using the form above</small>
//                 </div>
//               ) : (
//                 tables.map(table => (
//                   <div key={table._id} className="table-card">
//                     <div className="table-header">
//                       <h3>Table {table.tableNumber}</h3>
//                       <span className={`status ${table.isOccupied ? 'occupied' : 'available'}`}>
//                         {table.isOccupied ? 'Occupied' : 'Available'}
//                       </span>
//                     </div>
                    
//                     <div className="qr-code-container">
//                       <QRCode 
//                         value={`${window.location.origin}/order/${table.tableNumber}`}
//                         size={180}
//                         level="M"
//                         includeMargin
//                       />
//                     </div>
                    
//                     <div className="table-actions">
//                       <button 
//                         onClick={() => printQRCode(table.tableNumber, table.qrCode)}
//                         className="btn-primary"
//                       >
//                         Print QR Code
//                       </button>
//                       <a
//                         href={table.qrCode}
//                         download={`table-${table.tableNumber}-qrcode.png`}
//                         className="btn-secondary"
//                       >
//                         Download QR
//                       </a>
//                     </div>
                    
//                     <div className="table-info">
//                       <p>
//                         <strong>URL:</strong>{' '}
//                         <a 
//                           href={`/order/${table.tableNumber}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {window.location.origin}/order/{table.tableNumber}
//                         </a>
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TableManagement

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TableManagement.css'

const API_BASE_URL = 'http://localhost:5000/api'

const TableManagement = () => {
  const [tables, setTables] = useState([])
  const [newTableNumber, setNewTableNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingQR, setGeneratingQR] = useState(null)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/tables`)
      setTables(response.data)
    } catch (error) {
      console.error('Error fetching tables:', error)
      alert('Error loading tables. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateTableQR = async () => {
    if (!newTableNumber || isNaN(newTableNumber)) {
      alert('Please enter a valid table number')
      return
    }
    
    try {
      setGeneratingQR(newTableNumber)
      await axios.post(`${API_BASE_URL}/tables/generate`, {
        tableNumber: parseInt(newTableNumber)
      })
      setNewTableNumber('')
      fetchTables()
      alert(`QR code generated successfully for Table ${newTableNumber}`)
    } catch (error) {
      console.error('Error generating table QR:', error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('Error generating QR code. Please try again.')
      }
    } finally {
      setGeneratingQR(null)
    }
  }

  const generateQRCodeImage = (tableNumber) => {
    const url = `${window.location.origin}/order/${tableNumber}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`
  }

  const printQRCode = (tableNumber) => {
    const printWindow = window.open('', '_blank')
    const qrCodeUrl = `${window.location.origin}/order/${tableNumber}`
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${tableNumber} QR Code</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 2rem;
            }
            .qr-container { 
              margin: 2rem auto; 
              max-width: 300px;
            }
            .table-info {
              margin-bottom: 1rem;
            }
            .restaurant-name {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
              color: #333;
            }
            .table-number {
              font-size: 1.2rem;
              color: #666;
            }
            .instructions {
              margin-top: 1rem;
              color: #888;
              font-size: 0.9rem;
            }
            .url {
              margin-top: 1rem;
              font-size: 0.8rem;
              color: #666;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="table-info">
            <div class="restaurant-name">Delicious Restaurant</div>
            <div class="table-number">Table ${tableNumber}</div>
          </div>
          <div class="qr-container">
            <img src="${generateQRCodeImage(tableNumber)}" alt="QR Code for Table ${tableNumber}" style="width: 100%; height: auto;" />
          </div>
          <div class="instructions">
            Scan to order from your table
          </div>
          <div class="url">
            ${qrCodeUrl}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
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
                placeholder="Enter table number"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                min="1"
                className="table-input"
              />
              <button 
                onClick={generateTableQR}
                disabled={!newTableNumber || generatingQR}
                className="btn-primary"
              >
                {generatingQR ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Generate QR Code'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="tables-section">
          <div className="section-header">
            <h2>Existing Tables</h2>
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
                      <span className={`status ${table.isOccupied ? 'occupied' : 'available'}`}>
                        {table.isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </div>
                    
                    <div className="qr-code-container">
                      <img 
                        src={generateQRCodeImage(table.tableNumber)}
                        alt={`QR Code for Table ${table.tableNumber}`}
                        style={{ width: '180px', height: '180px' }}
                      />
                    </div>
                    
                    <div className="table-actions">
                      <button 
                        onClick={() => printQRCode(table.tableNumber)}
                        className="btn-primary"
                      >
                        Print QR Code
                      </button>
                      <a
                        href={generateQRCodeImage(table.tableNumber)}
                        download={`table-${table.tableNumber}-qrcode.png`}
                        className="btn-secondary"
                      >
                        Download QR
                      </a>
                    </div>
                    
                    <div className="table-info">
                      <p>
                        <strong>URL:</strong>{' '}
                        <a 
                          href={`/order/${table.tableNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {window.location.origin}/order/{table.tableNumber}
                        </a>
                      </p>
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