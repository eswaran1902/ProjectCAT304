import React, { useState } from 'react';
import AdminLayout from '../components/layouts/AdminLayout';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, AlertCircle, ShoppingBag, Users, DollarSign, CheckCircle, Settings } from 'lucide-react';

const AdminDashboard = () => {
    // Mock Data for Charts
    const salesData = [
        { name: 'Mon', sales: 4000, com: 400 },
        { name: 'Tue', sales: 3000, com: 300 },
        { name: 'Wed', sales: 2000, com: 200 },
        { name: 'Thu', sales: 2780, com: 278 },
        { name: 'Fri', sales: 1890, com: 189 },
        { name: 'Sat', sales: 2390, com: 239 },
        { name: 'Sun', sales: 3490, com: 349 },
    ];

    const channelData = [
        { name: 'WhatsApp', value: 400 },
        { name: 'Telegram', value: 300 },
        { name: 'Direct', value: 300 },
        { name: 'QR Code', value: 200 },
    ];
    const COLORS = ['#0f766e', '#0e7490', '#f59e0b', '#10b981'];

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time platform insights and tasks.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none">
                        <option>Last 7 Days</option>
                        <option>This Month</option>
                        <option>This Year</option>
                    </select>
                    <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition">
                        Export Report
                    </button>
                </div>
            </div>

            {/* 1. Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* GMV */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={48} className="text-teal-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total GMV</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">RM 154,200</h3>
                    <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span>+12.5%</span>
                        <span className="text-gray-400 font-normal ml-2">vs last week</span>
                    </div>
                </div>

                {/* Commissions Owed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign size={48} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Commissions Owed</p>
                    <h3 className="text-3xl font-bold text-amber-500 mt-1">RM 12,450</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500 font-medium">
                        <span>45 Active Salespeople</span>
                    </div>
                </div>

                {/* Paid Out */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Commissions Paid</p>
                    <h3 className="text-3xl font-bold text-green-700 mt-1">RM 142,000</h3>
                    <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span>All time</span>
                    </div>
                </div>

                {/* Urgent Action */}
                <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 relative overflow-hidden cursor-pointer hover:bg-red-100 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-bold text-red-800 uppercase tracking-wider">Urgent Review</p>
                            <h3 className="text-3xl font-bold text-red-900 mt-1">5</h3>
                            <p className="text-sm text-red-700 mt-2">Flagged Orders</p>
                        </div>
                        <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Sales & Commission Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <ReTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#0f766e" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Channel Mix</h3>
                    <div className="h-64 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={channelData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        Most sales coming from <strong>WhatsApp</strong> campaigns.
                    </div>
                </div>
            </div>

            {/* 3. Operational Panels (Bottom) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Salespeople */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Top Performers</h3>
                        <button className="text-teal-600 text-sm font-medium hover:text-teal-700">View All</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Ahmad Rozali</p>
                                        <p className="text-xs text-gray-500">Tier 1 Partner</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">RM 12,400</p>
                                    <p className="text-xs text-green-600">32 Sales</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Disputes / Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">System Alerts</h3>
                        <button className="text-gray-400 hover:text-gray-600"><Settings size={18} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Inventory Low: CRM Suite</h4>
                                <p className="text-xs text-amber-700 mt-1">Stock level below threshold (5 licenses remaining).</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <Users className="text-gray-500 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">New Partner Application</h4>
                                <p className="text-xs text-gray-500 mt-1">Sarah Jay applied for Salesperson account.</p>
                                <div className="mt-2 flex gap-2">
                                    <button className="text-xs bg-white border border-gray-300 px-2 py-1 rounded shadow-sm">Review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
