import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SalespersonDashboard from './components/SalespersonDashboard';
import AdminDashboard from './components/AdminDashboard';
import Promotions from './components/Promotion';
import Marketplace from './components/Marketplace';

const App = () => {
  const [currentView, setCurrentView] = useState('home');

  // STARTING EMPTY: Removed the pre-defined Gyoza and Sauce
  const [sharedProducts, setSharedProducts] = useState([]);

  // NEW: Function to remove an item from the global state
  const deleteProduct = (id) => {
    setSharedProducts(sharedProducts.filter(product => product.id !== id));
  };

  const renderView = () => {
    switch(currentView) {
      case 'marketplace': 
        return <Marketplace products={sharedProducts} />;
      case 'promotions': 
        return (
          <Promotions 
            products={sharedProducts} 
            setProducts={setSharedProducts} 
            deleteProduct={deleteProduct} 
          />
        );
      case 'sales': return <SalespersonDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar setView={setCurrentView} currentView={currentView} />
      {renderView()}
    </div>
  );
};

export default App;