import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomerOrder from './components/CustomerOrder'
import ReceptionDashboard from './components/ReceptionDashboard'
import TableManagement from './components/TableManagement'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/order/:tableNumber" element={<CustomerOrder />} />
          <Route path="/reception" element={<ReceptionDashboard />} />
          <Route path="/admin/tables" element={<TableManagement />} />
          <Route path="/" element={<Navigate to="/reception" replace />} />
        </Routes>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  )
}

export default App