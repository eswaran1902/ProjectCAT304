import React, { useState, useMemo } from 'react';
import './SalespersonDashboard.css';



// Reusable Metric Component - Fixes 'MetricCard' is not defined error
const MetricCard = ({ title, value, colorClass, subtitle }) => (
  <div className="stat-card">
    <p className="text-sm font-semibold text-slate-500 uppercase tracking-tight">{title}</p>
    <p className={`text-3xl font-black mt-2 ${colorClass}`}>{value}</p>
    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
      {subtitle}
    </p>
  </div>
);

const SalespersonDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock Data
  const data = useMemo(() => ({
    name: 'Alex Tan',
    uniqueLink: 'https://tinyurl.com/axt987',
    token: 'AXT987',
    ledger: [
      { id: 101, date: '2025-12-08', desc: 'Order #MZ0331 (Lazada)', amount: 120.00, status: 'Eligible' },
      { id: 102, date: '2025-12-07', desc: 'Chat Order (WHATSAPP)', amount: 95.00, status: 'Pending' },
      { id: 103, date: '2025-12-05', desc: 'Batch Payout (1-Dec)', amount: -820.00, status: 'Approved' },
      { id: 104, date: '2025-11-20', desc: 'Refund Clawback', amount: -15.00, status: 'Approved' },
    ]
  }), []);

  // Dynamic Calculations based on Ledger
  const stats = useMemo(() => {
    const available = data.ledger
      .filter(i => i.status === 'Eligible')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const pending = data.ledger
      .filter(i => i.status === 'Pending')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { available, pending };
  }, [data.ledger]);

  // Search and Filter Logic
  const filteredData = data.ledger.filter(item => {
    const matchesSearch = item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(data.uniqueLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Partner Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring performance for {data.name}</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              {data.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-bold text-slate-700 font-mono">ID: {data.token}</span>
          </div>
        </header>

        {/* Attribution Link Box */}
        <div className="link-section shadow-lg shadow-indigo-50/50">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800">Your Sales Link</h3>
            <p className="text-sm text-slate-500">Track your commissions automatically.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
              readOnly 
              value={data.uniqueLink} 
              className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-sm font-mono text-indigo-600 flex-1 md:w-64 outline-none" 
            />
            <button onClick={handleCopy} className={`copy-btn transition-all ${copySuccess ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Available Commission" value={`$${stats.available.toFixed(2)}`} colorClass="text-emerald-600" subtitle="Ready for payout" />
          <MetricCard title="Pending Review" value={`$${stats.pending.toFixed(2)}`} colorClass="text-amber-500" subtitle="In return window" />
          <MetricCard title="Next Payout Date" value="Dec 15" colorClass="text-slate-900" subtitle="Automatic transfer" />
        </div>

        {/* Ledger Table Section */}
        <div className="ledger-container">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="font-bold text-xl text-slate-800">Earnings History</h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input type="text" placeholder="Search orders..." className="search-input" onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="filter-select" onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Eligible">Eligible</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{item.date}</td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-800">{item.desc}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">ID: {item.id}</div>
                    </td>
                    <td className={`px-8 py-6 text-sm text-right font-mono font-bold ${item.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`status-pill status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalespersonDashboard;