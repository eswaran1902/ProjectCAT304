import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const portals = [
    { 
      title: 'Partner Portal', 
      path: '/salesperson', 
      icon: '🤝', 
      color: 'bg-indigo-600',
      desc: 'Access your unique sales link and track commissions.'
    },
    { 
      title: 'Admin Command Center', 
      path: '/admin', 
      icon: '🛡️', 
      color: 'bg-slate-900',
      desc: 'Process payout batches and manage system alerts.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Management System</h1>
          <p className="text-slate-500 font-medium italic">Please select the portal you wish to access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portals.map((p) => (
            <div 
              key={p.path}
              onClick={() => navigate(p.path)}
              className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${p.color} text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-slate-200`}>
                {p.icon}
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{p.title}</h2>
              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">{p.desc}</p>
              <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:gap-2 transition-all">
                Enter Portal <span className="ml-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;