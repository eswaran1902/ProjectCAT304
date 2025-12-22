import React from 'react';

const Navbar = ({ setView, currentView, user, setUser }) => {
  const getBtnClass = (viewName) => `
    px-5 py-2 rounded-2xl text-sm font-black transition-all 
    ${currentView === viewName 
      ? 'bg-indigo-600 text-white shadow-lg' 
      : 'text-slate-500 hover:bg-slate-100'}
  `;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 h-20 flex items-center px-8 justify-between">
      <div className="flex items-center gap-10">
        <div onClick={() => setView('home')} className="text-xl font-black cursor-pointer tracking-tighter italic">
          AP<span className="text-indigo-600">SR</span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setView('home')} className={getBtnClass('home')}>Home</button>
          
          {/* ADMIN ONLY: Admin Center */}
          {user?.role === 'admin' && (
            <button onClick={() => setView('admin')} className={getBtnClass('admin')}>Admin Center</button>
          )}

          {/* PARTNER ONLY: Sales & Store Tools */}
          {user?.role === 'sales' && (
            <>
              <button onClick={() => setView('sales')} className={getBtnClass('sales')}>Partner Portal</button>
              <button onClick={() => setView('promotions')} className={getBtnClass('promotions')}>My Store</button>
            </>
          )}

          {/* HIDE MARKETPLACE FOR ADMINS: Only visible to General Users and Partners */}
          {user?.role !== 'admin' && (
            <button onClick={() => setView('marketplace')} className={getBtnClass('marketplace')}>Marketplace</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logged In As</p>
              <p className="text-xs font-bold text-indigo-600 mt-1">{user.name}</p>
            </div>
            <button 
              onClick={() => { setUser(null); setView('home'); }} 
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={() => setView('auth')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg">Login|Register</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;