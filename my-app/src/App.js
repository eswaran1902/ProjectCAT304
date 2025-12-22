import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Authentication';
import SalespersonDashboard from './components/SalespersonDashboard';
import AdminDashboard from './components/AdminDashboard';
import Promotions from './components/Promotion';
import Marketplace from './components/Marketplace';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null); 
  const [sharedProducts, setSharedProducts] = useState([]);

  const deleteProduct = (id) => {
    setSharedProducts(sharedProducts.filter(product => product.id !== id));
  };

  const renderView = () => {
    // PROTECTED VIEW GUARD: Force login for sensitive areas
    const protectedViews = ['sales', 'admin', 'promotions'];
    if (protectedViews.includes(currentView) && !user) {
      return <Auth setView={setCurrentView} setUser={setUser} />;
    }

    switch (currentView) {
      case 'admin':
        // Only allow Aqil to see the Admin Dashboard
        if (user?.role === 'admin' && user?.email === 'aqil@gmail.com') {
          return <AdminDashboard />; 
        }
        return <Home setView={setCurrentView} />;
      
      case 'marketplace':
        // RESTRICTION: Block Admin from seeing the Marketplace
        if (user?.role === 'admin') {
          return <AdminDashboard />; 
        }
        return <Marketplace products={sharedProducts} />;

      case 'sales':
        // Restricted to Partners; Admins are blocked
        if (user?.role === 'sales') {
          return <SalespersonDashboard user={user} />;
        }
        return <Home setView={setCurrentView} />;
      
      case 'promotions':
        // Restricted to Partners; Admins are blocked
        if (user?.role === 'sales') {
          return (
            <Promotions 
              products={sharedProducts} 
              setProducts={setSharedProducts} 
              deleteProduct={deleteProduct} 
            />
          );
        }
        return <Home setView={setCurrentView} />;

      case 'auth':
        return <Auth setView={setCurrentView} setUser={setUser} />;

      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar setView={setCurrentView} currentView={currentView} user={user} setUser={setUser} />
      <main>{renderView()}</main>
    </div>
  );
};

export default App;