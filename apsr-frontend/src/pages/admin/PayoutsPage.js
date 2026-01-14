import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { DollarSign, CheckCircle, Clock, AlertCircle, Play, FileText, RefreshCw, XCircle } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const PayoutsPage = () => {
    const { token } = useContext(AuthContext);
    const socket = useSocket();
    const [activeTab, setActiveTab] = useState('payable'); // 'payable', 'processing', 'history'
    const [selectedIds, setSelectedIds] = useState([]);
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/payouts', {
                headers: { 'x-auth-token': token }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchRequests();
    }, [token]);

    // Real-time listener
    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => {
            console.log("Real-time update: Payouts refreshed");
            fetchRequests();
        };
        socket.on('stats_updated', handleUpdate);
        return () => socket.off('stats_updated', handleUpdate);
    }, [socket, token]);

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleProcessBatch = async () => {
        if (selectedIds.length === 0) return;
        try {
            await axios.post('http://localhost:5001/api/payouts/batch', { ids: selectedIds }, {
                headers: { 'x-auth-token': token }
            });
            setSelectedIds([]);
            fetchRequests();
            setActiveTab('processing'); // Auto-switch to processing tab
            alert("Batch processed successfully! Moved to Processing tab.");
        } catch (err) {
            console.error(err);
            alert("Failed to process batch");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
        try {
            // If status is 'approved', backend maps it to 'paid' usually for simplified flow,
            // or we might want specific 'approved' -> 'paid' step.
            // For this user request "approve and reject", let's map 'approved' to 'paid' 
            // if that's what the batch does, OR keep 'approved' if there is a 2-step flow.
            // Looking at batch: { $set: { status: 'paid' ... } }.
            // So "Approve" effectively means "Pay" in this simple system?
            // User asked "approve and reject".
            // Let's send 'paid' if approved, 'rejected' if rejected.

            const finalStatus = status === 'approved' ? 'paid' : 'rejected';

            await axios.put(`http://localhost:5001/api/payouts/${id}/status`, { status: finalStatus }, {
                headers: { 'x-auth-token': token }
            });
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert("Action failed");
        }
    };

    // Filter Logic
    const payableList = requests.filter(r => r.status === 'pending');
    const processingList = requests.filter(r => r.status === 'processing');
    const historyList = requests.filter(r => r.status === 'paid' || r.status === 'rejected');

    // Stats
    const totalPayable = payableList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = historyList.filter(r => r.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

    // Group history by date for pseudo-batch view
    const batchHistory = historyList.reduce((acc, curr) => {
        const dateKey = new Date(curr.updatedAt).toLocaleDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = { id: 'BATCH-' + dateKey.replace(/\//g, ''), date: dateKey, recipients: 0, total: 0, status: 'Completed', items: [] };
        }
        acc[dateKey].recipients += 1;
        acc[dateKey].total += curr.amount;
        acc[dateKey].items.push(curr);
        return acc;
    }, {});
    const batchList = Object.values(batchHistory);

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
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
                            onClick={() => setActiveTab('processing')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'processing' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Processing ({processingList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            History
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Payable</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">RM {totalPayable.toLocaleString()}</h3>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Pending Requests</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Settled</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">RM {totalPaid.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-2">Lifetime Payouts</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {activeTab === 'payable' ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Pending Balances</h3>
                                <p className="text-xs text-gray-500">Select users to mark as PAID.</p>
                            </div>
                            <button
                                onClick={handleProcessBatch}
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
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {payableList.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item._id)}
                                                onChange={() => handleSelect(item._id)}
                                                className="rounded text-teal-600 focus:ring-teal-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.salesperson?.name || 'Unknown'}
                                            <div className="text-xs text-gray-400">{item._id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.salesperson?.bankDetails || 'No Bank Info (Check Profile)'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">RM {item.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'approved')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve (Mark as Paid)"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'rejected')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject Request"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {payableList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No pending payouts via requests.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : activeTab === 'processing' ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Processing Payments</h3>
                                <p className="text-xs text-gray-500">View bank details and mark as completed once paid.</p>
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Salesperson</th>
                                    <th className="px-6 py-4">Bank Details</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {processingList.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.salesperson?.name || 'Unknown'}
                                            <div className="text-xs text-gray-400">{item.salesperson?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 font-mono text-xs text-gray-700">
                                                {item.salesperson?.bankDetails ? (
                                                    <div className="whitespace-pre-wrap">{item.salesperson.bankDetails}</div>
                                                ) : (
                                                    <span className="text-red-500">No Bank Info Provided</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">RM {item.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleUpdateStatus(item._id, 'approved')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-1 ml-auto"
                                            >
                                                <CheckCircle size={14} /> Mark Completed
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {processingList.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No payments currently in processing.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-900">History (Aggregated by Date)</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Batch Date</th>
                                    <th className="px-6 py-4">Recipients</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {batchList.map(batch => (
                                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">{batch.date}</td>
                                        <td className="px-6 py-4">{batch.recipients}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">RM {batch.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-teal-600 hover:text-teal-800">
                                                <FileText size={18} />
                                            </button>
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
