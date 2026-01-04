import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import CustomerMarketplace from './pages/CustomerMarketplace';
import Payment from './pages/Payment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/partner" element={<PartnerDashboard />} />
            <Route path="/marketplace" element={<CustomerMarketplace />} />
            <Route path="/payment/:orderId" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;