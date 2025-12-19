import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // Importing the separate CSS file

// --- Sub-Components ---

const Sidebar = () => (
  <div className="admin-sidebar">
    <div className="text-xl font-black mb-8 tracking-tight italic text-indigo-400">AdminPortal</div>
    <nav className="space-y-3">
      <div className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] mb-4">Operations</div>
      <div className="nav-item nav-item-active">Dashboard</div>
      <div className="nav-item">Payout Batches</div>
      <div className="nav-item">Fraud Reports</div>
      <div className="nav-item">System Logs</div>
    </nav>
  </div>
);

const Header = ({ title }) => (
  <header className="bg-white border-b border-slate-100 py-5 px-8 sticky top-0 z-10 w-full">
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-emerald-600">System Live</span>
      </div>
    </div>
  </header>
);

const MetricCard = ({ title, value, colorClass }) => (
  <div className={`admin-stat-card ${colorClass}`}>
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{title}</h3>
    <p className="text-2xl font-black mt-2 leading-none tracking-tight">{value}</p>
  </div>
);

const ActionPanel = ({ title, value, buttonText, isAlert = false }) => (
  <div className={`action-panel-card ${isAlert ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
    <p className={`mt-2 text-3xl font-black ${isAlert ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
    <button className={`admin-btn ${isAlert ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
      {buttonText}
    </button>
  </div>
);

// --- Main Dashboard ---

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  const data = {
    totalPendingPayouts: 3250.75,
    unreconciledMarketplaceReports: 4,
    fraudAlerts: 2,
    predictiveSKU: 'Frozen Dumplings',
    highRefundRiskOrders: 18,
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest">Initialising Command Center...</div>;

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Administrator Command Center" />
        <main className="flex-1 max-w-7xl mx-auto py-10 px-6 lg:px-10 w-full">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Pending Payouts" value={`$${data.totalPendingPayouts}`} colorClass="bg-slate-900" />
            <MetricCard title="Unreconciled" value={`${data.unreconciledMarketplaceReports} Files`} colorClass="bg-indigo-600" />
            <MetricCard title="Risk Alerts" value={`${data.fraudAlerts} New`} colorClass="bg-rose-600" />
            <MetricCard title="AI Strategy" value={data.predictiveSKU} colorClass="bg-emerald-600" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ActionPanel title="Payouts Ready" value={`$${data.totalPendingPayouts}`} buttonText="Batch Process" />
            <ActionPanel title="Marketplace Sync" value={`${data.unreconciledMarketplaceReports} Reports`} buttonText="Reconcile Now" isAlert={true} />
            <ActionPanel title="Risk Queue" value={`${data.fraudAlerts + 1} Pending`} buttonText="Manage Queue" />
          </div>

          <section className="insights-container">
            <div className="px-8 py-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Analytics & Controls</h3>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="px-8 py-6 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund Risk Score</dt>
                <dd className="text-sm text-slate-900 sm:col-span-2 font-medium">
                  <span className="text-rose-600 font-black">{data.highRefundRiskOrders} orders</span> at high risk. <span className="text-indigo-600 underline font-bold ml-2 cursor-pointer">Adjust Rules</span>
                </dd>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;