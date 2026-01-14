import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerProducts from './pages/PartnerProducts';
import PartnerOrders from './pages/PartnerOrders';
import PartnerProfile from './pages/PartnerProfile';
import PartnerLayout from './components/PartnerLayout';
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

            {/* Partner Portal Routes */}
            <Route path="/partner" element={<PartnerLayout />}>
              <Route index element={<PartnerDashboard />} />
              <Route path="products" element={<PartnerProducts />} />
              <Route path="orders" element={<PartnerOrders />} />
              <Route path="profile" element={<PartnerProfile />} />
            </Route>

            <Route path="/marketplace" element={<CustomerMarketplace />} />
            <Route path="/payment/:orderId" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;