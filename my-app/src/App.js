import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SalespersonDashboard from './components/SalespersonDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Landing Page Selection */}
        <Route path="/" element={<Home />} />

        {/* Salesperson Portal Path */}
        <Route path="/salesperson" element={<SalespersonDashboard />} />

        {/* Admin Dashboard Path */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all route to redirect back to Home selection */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;