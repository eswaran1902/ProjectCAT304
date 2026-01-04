import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Search, Filter, MoreVertical, Shield, AlertTriangle, UserCheck, UserX, TrendingUp, DollarSign } from 'lucide-react';

const SalespeoplePage = () => {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [filterTier, setFilterTier] = useState('All');

    // Mock Data
    const people = [
        { id: 'SP-001', name: 'Alex Morgan', email: 'alex@example.com', tier: 'Gold', status: 'Active', totalSales: 12400, orders: 32, risk: 'Low', kyc: 'Verified' },
        { id: 'SP-002', name: 'Sarah Jay', email: 'sarah@example.com', tier: 'Silver', status: 'Active', totalSales: 8200, orders: 15, risk: 'Medium', kyc: 'Pending' },
        { id: 'SP-003', name: 'Mike Ross', email: 'mike@example.com', tier: 'Bronze', status: 'Suspended', totalSales: 450, orders: 2, risk: 'High', kyc: 'Failed' },
        { id: 'SP-004', name: 'Jessica Pearson', email: 'jessica@example.com', tier: 'Gold', status: 'Active', totalSales: 45000, orders: 112, risk: 'Low', kyc: 'Verified' },
        { id: 'SP-005', name: 'Louis Litt', email: 'louis@example.com', tier: 'Silver', status: 'Active', totalSales: 5600, orders: 28, risk: 'High', kyc: 'Verified' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Suspended': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Gold': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Silver': return 'text-gray-600 bg-gray-100 border-gray-300';
            case 'Bronze': return 'text-orange-700 bg-orange-50 border-orange-200';
            default: return 'text-gray-600';
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Salespeople Management</h1>
                    <p className="text-gray-500 mt-1">Manage partner tiers, risks, and access.</p>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2">
                    <UserCheck size={18} />
                    Approve New Signups
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex gap-4 bg-gray-50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Gold', 'Silver', 'Bronze'].map(tier => (
                            <button
                                key={tier}
                                onClick={() => setFilterTier(tier)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${filterTier === tier ? 'bg-white border-teal-500 text-teal-700 shadow-sm border' : 'text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name / ID</th>
                            <th className="px-6 py-4">Tier</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total Sales</th>
                            <th className="px-6 py-4">Risk Profile</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {people.map((person) => (
                            <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                                            {person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{person.name}</div>
                                            <div className="text-xs text-gray-500">{person.id} • {person.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded border text-xs font-bold uppercase ${getTierColor(person.tier)}`}>
                                        {person.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
                                        {person.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ${person.totalSales.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {person.risk === 'High' ? (
                                        <div className="flex items-center gap-1 text-red-600 font-bold text-xs">
                                            <AlertTriangle size={14} /> High Risk
                                        </div>
                                    ) : person.risk === 'Medium' ? (
                                        <div className="text-amber-600 font-medium text-xs">Medium Risk</div>
                                    ) : (
                                        <div className="text-green-600 font-medium text-xs">Low Risk</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedPerson(person)}
                                        className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Profile Drawer */}
            {selectedPerson && (
                <div className="fixed inset-0 z-20 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">

                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Partner Profile</h2>
                            <button onClick={() => setSelectedPerson(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex-1">
                            {/* Identity Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    {selectedPerson.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedPerson.name}</h3>
                                    <p className="text-gray-500">{selectedPerson.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getTierColor(selectedPerson.tier)}`}>
                                            {selectedPerson.tier} Tier
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                                            <Shield size={10} /> {selectedPerson.kyc}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Sales</div>
                                    <div className="text-2xl font-bold text-gray-900">${selectedPerson.totalSales.toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Commission Earned</div>
                                    <div className="text-2xl font-bold text-teal-600">${(selectedPerson.totalSales * 0.1).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Risk Alerts */}
                            {selectedPerson.risk === 'High' && (
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-8">
                                    <h4 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                                        <AlertTriangle size={18} /> Risk Flags Detected
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                        <li>High refund rate (15% vs avg 2%)</li>
                                        <li>Multiple orders from same IP address</li>
                                    </ul>
                                </div>
                            )}

                            {/* Actions Panel */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Administrative Actions</h4>
                                <div className="space-y-3">
                                    <button className="w-full py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
                                        <TrendingUp size={18} /> Change Commission Tier
                                    </button>
                                    <button className="w-full py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
                                        <DollarSign size={18} /> Hold Payouts
                                    </button>
                                    <button className="w-full py-3 flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-lg font-bold text-red-700 hover:bg-red-100">
                                        <UserX size={18} /> Suspend Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default SalespeoplePage;
