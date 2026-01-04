import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { DollarSign, CheckCircle, Clock, AlertCircle, Play, FileText, RefreshCw, XCircle } from 'lucide-react';

const PayoutsPage = () => {
    const [activeTab, setActiveTab] = useState('payable'); // 'payable' or 'history'
    const [selectedIds, setSelectedIds] = useState([]);

    // Mock Data - Payable Balances
    const payableList = [
        { id: 'SP-001', name: 'Ahmad Rozali', method: 'Bank Transfer (**** 8829)', amount: 1250.00, status: 'Ready' },
        { id: 'SP-002', name: 'Sarah Jay', method: 'PayPal (sarah@...)', amount: 840.50, status: 'Ready' },
        { id: 'SP-004', name: 'Jessica Pearson', method: 'Bank Transfer (**** 1122)', amount: 3420.00, status: 'Ready' },
        { id: 'SP-005', name: 'Louis Litt', method: 'N/A', amount: 450.00, status: 'Missing Details' },
    ];

    // Mock Data - Batch History
    const batchHistory = [
        { id: 'BATCH-204', date: 'Oct 24, 2024', recipients: 12, total: 14500.00, status: 'Processing', progress: 65 },
        { id: 'BATCH-203', date: 'Oct 15, 2024', recipients: 45, total: 42100.00, status: 'Paid', progress: 100 },
        { id: 'BATCH-202', date: 'Oct 01, 2024', recipients: 38, total: 38000.00, status: 'Failed', progress: 0, error: 'Gateway Timeout' },
    ];

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };



    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payouts & Settlements</h1>
                    <p className="text-gray-500 mt-1">Manage partner withdrawals and batch processing.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
                        <button
                            onClick={() => setActiveTab('payable')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'payable' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Payable ({payableList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Batch History
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Payable</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">RM 5,960.50</h3>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Coming due next Friday</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Pending Processing</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-1">RM 14,500.00</h3>
                    <p className="text-xs text-gray-400 mt-2">Batch #204 in progress</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Last Payout</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">RM 42,100.00</h3>
                    <p className="text-xs text-gray-400 mt-2">Paid on Oct 15</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {activeTab === 'payable' ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Pending Balances</h3>
                                <p className="text-xs text-gray-500">Select users to create a payout batch.</p>
                            </div>
                            <button
                                disabled={selectedIds.length === 0}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${selectedIds.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                <Play size={16} fill="currentColor" />
                                Process Batch ({selectedIds.length})
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4 w-10">
                                        <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                                    </th>
                                    <th className="px-6 py-4">Salesperson</th>
                                    <th className="px-6 py-4">Payout Method</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {payableList.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleSelect(item.id)}
                                                className="rounded text-teal-600 focus:ring-teal-500"
                                                disabled={item.status !== 'Ready'}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.name}
                                            <div className="text-xs text-gray-400">{item.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.method}</td>
                                        <td className="px-6 py-4">
                                            {item.status === 'Ready' ? (
                                                <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    Ready
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                    <AlertCircle size={10} className="mr-1" /> Missing Info
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">RM {item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Batch History</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Batch ID</th>
                                    <th className="px-6 py-4">Date Submitted</th>
                                    <th className="px-6 py-4">Recipients</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {batchHistory.map(batch => (
                                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">{batch.id}</td>
                                        <td className="px-6 py-4">{batch.date}</td>
                                        <td className="px-6 py-4">{batch.recipients}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">RM {batch.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                                                    {batch.status === 'Processing' && <RefreshCw size={10} className="mr-1 animate-spin" />}
                                                    {batch.status === 'Failed' && <XCircle size={10} className="mr-1" />}
                                                    {batch.status}
                                                </span>
                                            </div>
                                            {batch.status === 'Processing' && (
                                                <div className="w-24 h-1 bg-blue-100 rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-[65%]"></div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {batch.status === 'Failed' ? (
                                                <button className="text-red-600 hover:text-red-800 text-xs font-bold border border-red-200 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors">
                                                    Retry
                                                </button>
                                            ) : (
                                                <button className="text-teal-600 hover:text-teal-800">
                                                    <FileText size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default PayoutsPage;
