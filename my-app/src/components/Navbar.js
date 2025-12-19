import React from 'react';

const Navbar = ({ setView, currentView }) => {
  const getBtnClass = (viewName) => `
    px-5 py-2 rounded-2xl text-sm font-black transition-all 
    ${currentView === viewName 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
      : 'text-slate-500 hover:bg-slate-100'}
  `;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 h-20 flex items-center px-8 justify-between">
      <div className="flex items-center gap-10">
        <div 
          onClick={() => setView('home')} 
          className="text-xl font-black cursor-pointer tracking-tighter"
        >
          SYSTEM<span className="text-indigo-600">OS</span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setView('home')} className={getBtnClass('home')}>Home</button>
          <button onClick={() => setView('sales')} className={getBtnClass('sales')}>Partner Portal</button>
          <button onClick={() => setView('admin')} className={getBtnClass('admin')}>Admin Center</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;