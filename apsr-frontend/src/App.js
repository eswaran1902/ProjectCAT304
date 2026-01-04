import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import SalespersonDashboard from './pages/SalespersonDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/admin/OrdersPage';
import AttributionPage from './pages/admin/AttributionPage';
import SalespeoplePage from './pages/admin/SalespeoplePage';
import PayoutsPage from './pages/admin/PayoutsPage';
import CommissionsPage from './pages/admin/CommissionsPage';
import ProductsPage from './pages/admin/ProductsPage';
import ChannelsPage from './pages/admin/ChannelsPage';
import DisputesPage from './pages/admin/DisputesPage';
import AuditPage from './pages/admin/AuditPage';
import SettingsPage from './pages/admin/SettingsPage';
import PromotionPage from './pages/PromotionPage';
import CatalogPage from './pages/salesperson/CatalogPage';
import EarningsPage from './pages/salesperson/EarningsPage';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Simple role check (if allowedRole specified)
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their allowed dashboard if they try to access wrong one
    return <Navigate to={user.role === 'admin' ? '/admin' : '/salesperson'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/salesperson"
                element={
                  <ProtectedRoute allowedRole="salesperson">
                    <SalespersonDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/salesperson/catalog"
                element={
                  <ProtectedRoute allowedRole="salesperson">
                    <CatalogPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/salesperson/earnings"
                element={
                  <ProtectedRoute allowedRole="salesperson">
                    <EarningsPage />
                  </ProtectedRoute>
                }
              />

              {/* Placeholder for others */}
              {['links', 'settings'].map(path => (
                <Route
                  key={path}
                  path={`/salesperson/${path}`}
                  element={
                    <ProtectedRoute allowedRole="salesperson">
                      <SalespersonDashboard />
                    </ProtectedRoute>
                  }
                />
              ))}

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/salespeople"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <SalespeoplePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/payouts"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <PayoutsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/commissions"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <CommissionsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/channels"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <ChannelsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/disputes"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <DisputesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AuditPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared/Protected Routes */}
              <Route
                path="/promotion/:id"
                element={
                  <ProtectedRoute allowedRole="salesperson">
                    <PromotionPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attribution"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AttributionPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
          </div>

        </Router>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
