import React from 'react';
import SalespersonLayout from '../components/layouts/SalespersonLayout';
import { TrendingUp, DollarSign, MousePointer, CreditCard, ChevronRight, Copy, ExternalLink, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalespersonDashboard = () => {
    // Mock Data
    const data = [
        { name: 'Mon', sales: 400 },
        { name: 'Tue', sales: 300 },
        { name: 'Wed', sales: 550 },
        { name: 'Thu', sales: 450 },
        { name: 'Fri', sales: 650 },
        { name: 'Sat', sales: 500 },
        { name: 'Sun', sales: 750 },
    ];

    const topProducts = [
        { id: 1, name: 'Enterprise CRM Suite', commission: '10%', earned: 1200, clicks: 450 },
        { id: 2, name: 'Marketing Automation', commission: '$15 USD', earned: 345, clicks: 120 },
        { id: 3, name: 'Cloud Storage Pack', commission: '5%', earned: 85, clicks: 55 },
    ];

    return (
        <SalespersonLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Track your performance and earnings in real-time.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
                        <h3 className="text-2xl font-bold text-gray-900">RM 12,450.00</h3>
                    </div>
                    <div className="text-sm text-green-600 flex items-center font-medium">
                        <TrendingUp size={16} className="mr-1" /> +12% this month
                    </div>
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-50 to-transparent"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Available for Payout</p>
                        <h3 className="text-2xl font-bold text-gray-900">RM 1,250.00</h3>
                    </div>
                    <div className="text-sm text-teal-600 flex items-center font-medium cursor-pointer hover:underline">
                        Request Payout <ChevronRight size={14} />
                    </div>
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-teal-50 to-transparent"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Clicks</p>
                        <h3 className="text-2xl font-bold text-gray-900">8,432</h3>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center font-medium">
                        <MousePointer size={14} className="mr-1" /> Across all links
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
                        <h3 className="text-2xl font-bold text-gray-900">2.4%</h3>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center font-medium">
                        Avg. industry: 1.8%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Revenue Trend</h3>
                        <select className="text-sm border-gray-200 border rounded-lg px-2 py-1 outline-none focus:border-teal-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Top Performing Products</h3>
                    <div className="space-y-4">
                        {topProducts.map(product => (
                            <div key={product.id} className="group p-3 rounded-lg border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm text-gray-800">{product.name}</h4>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-teal-600 transition-colors" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-gray-500">
                                        <span className="font-bold text-teal-600">{product.commission}</span> comm.
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">RM {product.earned}</div>
                                        <div className="text-[10px] text-gray-400">{product.clicks} clicks</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm font-medium text-teal-600 border border-teal-100 rounded-lg hover:bg-teal-50">
                        View Full Catalog
                    </button>
                </div>
            </div>
        </SalespersonLayout>
    );
};

export default SalespersonDashboard;
