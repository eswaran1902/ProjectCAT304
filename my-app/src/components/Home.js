import React from 'react';

const Home = ({ setView }) => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Select Portal</h1>
        <p className="text-slate-500 mt-4 font-medium">Choose a workspace to continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div 
          onClick={() => setView('sales')}
          className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer hover:-translate-y-2 transition-all group"
        >
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-xl shadow-indigo-100">🤝</div>
          <h2 className="text-3xl font-black text-slate-800">Partner Portal</h2>
          <p className="mt-4 text-slate-500">Track your sales and commissions.</p>
        </div>

        <div 
          onClick={() => setView('admin')}
          className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer hover:-translate-y-2 transition-all group"
        >
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-xl shadow-slate-200">🛡️</div>
          <h2 className="text-3xl font-black text-slate-800">Admin Command</h2>
          <p className="mt-4 text-slate-500">Manage payouts and system risk.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;