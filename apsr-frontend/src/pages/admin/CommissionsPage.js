import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Download, Plus, Search, Calendar, FileText, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const CommissionsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

    // Mock Ledger Data
    const ledgerEntries = [
        { id: 'TX-9901', date: 'Oct 24, 2024', salesperson: 'Alex Morgan', type: 'Commission', desc: 'Order #ORD-7721 - CRM Suite', amount: 45.00, status: 'Payable', balance: 1250.00 },
        { id: 'TX-9902', date: 'Oct 24, 2024', salesperson: 'Sarah Jay', type: 'Commission', desc: 'Order #ORD-7722 - Enterprise License', amount: 210.00, status: 'Pending', balance: 840.50 },
        { id: 'TX-9903', date: 'Oct 23, 2024', salesperson: 'Alex Morgan', type: 'Payout', desc: 'Batch #BATCH-203 Withdrawal', amount: -1400.00, status: 'Paid', balance: 1205.00 },
        { id: 'TX-9904', date: 'Oct 22, 2024', salesperson: 'Mike Ross', type: 'Reversal', desc: 'Refund #REF-004', amount: -55.00, status: 'Completed', balance: 450.00 },
        { id: 'TX-9905', date: 'Oct 22, 2024', salesperson: 'Jessica Pearson', type: 'Bonus', desc: 'Q3 Performance Bonus', amount: 500.00, status: 'Payable', balance: 3420.00 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Payable': return 'bg-green-100 text-green-800';
            case 'Paid': return 'bg-gray-100 text-gray-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isCredit = (amount) => amount > 0;

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Commission Ledger</h1>
                    <p className="text-gray-500 mt-1">Immutable financial records and adjustments.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Download size={18} />
                        Export Statement
                    </button>
                    <button
                        onClick={() => setShowAdjustmentModal(true)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={18} />
                        New Entry
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by Salesperson..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Calendar size={18} className="text-gray-400" />
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                    >
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Q3 2024</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Salesperson</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Running Bal.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {ledgerEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500 text-xs">{entry.id}</td>
                                <td className="px-6 py-4 text-gray-900">{entry.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{entry.salesperson}</td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{entry.desc}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${entry.type === 'Commission' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                            entry.type === 'Payout' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                                entry.type === 'Reversal' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-purple-50 text-purple-700 border-purple-100' // Bonus
                                        }`}>
                                        {entry.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${isCredit(entry.amount) ? 'text-green-600' : 'text-gray-900'}`}>
                                    {isCredit(entry.amount) ? '+' : ''}{entry.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500 font-medium">
                                    ${entry.balance.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Adjustment Modal (Mockup) */}
            {showAdjustmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">New Ledger Entry</h2>
                            <button onClick={() => setShowAdjustmentModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none">
                                    <option>Adjustment (Credit)</option>
                                    <option>Adjustment (Debit)</option>
                                    <option>Bonus</option>
                                    <option>Fee Deduction</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none">
                                    <option>Select Salesperson...</option>
                                    <option>Alex Morgan</option>
                                    <option>Sarah Jay</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Description</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none" rows="3" placeholder="e.g. Q4 Regional Sales Winner"></textarea>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800 border border-amber-100 flex gap-2">
                                <FileText size={16} className="mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Audit Note:</strong> This entry will be permanently recorded in the ledger. It cannot be deleted after creation.
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowAdjustmentModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700">Create Entry</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CommissionsPage;
