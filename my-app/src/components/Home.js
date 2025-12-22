import React from 'react';

const Home = ({ setView }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Attraction Section */}
      <section className="bg-slate-900 text-white py-24 px-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              Empowering <span className="text-indigo-400 italic">Strategic</span> Sales.
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-10 leading-relaxed">
              Transform your network into a scalable revenue engine with automated attribution, 
              transparent ledgers, and AI-backed strategy.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={() => setView('sales')}
                className="px-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20"
              >
                Join as Partner
              </button>
              <button 
                onClick={() => setView('marketplace')}
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Explore Marketplace
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
             {/* Decorative UI element representing the 'Transparent Ledger' */}
             <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">🤝</div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Real-time Attribution</p>
                      <p className="text-lg font-black text-emerald-400">+$120.00</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="h-2 w-full bg-white/5 rounded-full" />
                   <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                   <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                </div>
             </div>
          </div>
        </div>
        
        {/* Background glow for attraction */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-64 -mt-64" />
      </section>

      {/* Portal Selection Hub */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Choose Your Path</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">Dedicated Workspaces</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div 
            onClick={() => setView('sales')}
            className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">🤝</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Partner Portal</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Track your sales performance, manage your unique links, and monitor your auditable commission ledger in real-time.
            </p>
          </div>

          <div 
            onClick={() => setView('admin')}
            className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">🛡️</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Admin Command</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Automate reconciliation, manage payout batches, and leverage AI insights to drive strategic F&B warehouse operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;