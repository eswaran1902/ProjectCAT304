import React, { useState } from 'react';

const Auth = ({ setView, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('general'); // roles: 'general', 'sales', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let authenticatedUser;

    // 1. SECURE ADMIN CHECK
    // Validates specifically for your admin credentials
    if (email === 'aqil@gmail.com' && password === 'aqil123') {
      authenticatedUser = {
        name: "Aqil (Admin)",
        email: 'aqil@gmail.com',
        role: 'admin',
        id: 'ADMIN-001'
      };
    } else {
      // 2. STANDARD USER/PARTNER AUTH
      authenticatedUser = {
        name: email.split('@')[0] || "User",
        email: email,
        role: role, 
        id: role.toUpperCase() + '-' + Math.floor(Math.random() * 1000)
      };
    }

    setUser(authenticatedUser);

    // 3. ROLE-BASED REDIRECT
    if (authenticatedUser.role === 'admin') {
      setView('admin'); // Direct to Command Center
    } else if (authenticatedUser.role === 'sales') {
      setView('sales'); // Direct to Partner Portal
    } else {
      setView('home');  // Direct to General Attraction Page
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50/50">
      <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-10 tracking-tighter uppercase italic">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {/* ROLE TOGGLE: Restored Admin Option */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
          {['general', 'sales', 'admin'].map((r) => (
            <button 
              key={r}
              type="button"
              onClick={() => setRole(r)} 
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                role === r ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'
              }`}
            >
              {r === 'sales' ? 'Partner' : r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-sm font-bold" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-sm font-bold" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-indigo-600 underline ml-1"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;