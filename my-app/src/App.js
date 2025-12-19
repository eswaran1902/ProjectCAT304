import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SalespersonDashboard from './components/SalespersonDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  // state can be: 'home', 'sales', or 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Function to determine which page to display
  const renderContent = () => {
    switch(currentView) {
      case 'sales':
        return <SalespersonDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* We pass setView to the Navbar so buttons can change the page */}
      <Navbar setView={setCurrentView} currentView={currentView} />
      
      {/* The main content area */}
      <main className="transition-all duration-500">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;