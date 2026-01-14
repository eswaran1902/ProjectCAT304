import React, { useState, useEffect, useContext } from 'react';
import SalespersonLayout from '../../components/layouts/SalespersonLayout';
import { DollarSign, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const EarningsPage = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState({ pending: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats for "Unpaid Balance"
                const statsRes = await axios.get('http://localhost:5001/api/dashboard/salesperson/stats', {
                    headers: { 'x-auth-token': token }
                });
                setStats(statsRes.data);

                // Fetch Transaction History
                const histRes = await axios.get('http://localhost:5001/api/dashboard/salesperson/history', {
                    headers: { 'x-auth-token': token }
                });
                setTransactions(histRes.data);
            } catch (err) {
                console.error("Error fetching earnings data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const handleRequestPayout = async () => {
        if (!stats.pending || stats.pending < 50) return;

        if (!window.confirm(`Request payout for RM ${stats.pending.toFixed(2)}?`)) return;

        try {
            await axios.post('http://localhost:5001/api/dashboard/salesperson/payouts', {}, {
                headers: { 'x-auth-token': token }
            });
            alert('Payout requested successfully!');
            // Refresh Data
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to request payout');
        }
    };

    return (
        <SalespersonLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
                    <p className="text-gray-500 mt-1">View your commission history and upcoming payments.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar size={16} className="text-gray-400" />
                    This Month
                </div>
            </div>

            {/* Payout Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <p className="text-gray-400 font-medium mb-1 uppercase tracking-wide text-xs">Unpaid Balance</p>
                        <h2 className="text-4xl font-bold text-white mb-2">RM {stats.pending?.toFixed(2) || '0.00'}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Next Payout: Nov 01, 2024
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleRequestPayout}
                            disabled={!stats.pending || stats.pending < 50}
                            className={`font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-teal-900/20 ${!stats.pending || stats.pending < 50
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                                }`}
                        >
                            Request Payout Now
                        </button>
                        <p className="text-xs text-gray-500 mt-2 text-center md:text-right">Min. threshold RM 50.00</p>
                    </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
            </div>

            {/* Ledger */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Transaction History</h3>
                    <button className="text-gray-400 hover:text-teal-600">
                        <Download size={20} />
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading history...</td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map(tx => (
                                <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{tx.product?.name || 'Product Sale'}</td>
                                    <td className="px-6 py-4">
                                        <span className={'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border bg-green-50 text-green-700 border-green-100'}>
                                            <ArrowUpRight size={12} />
                                            Credit
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block w-2 H-2 rounded-full mr-2 ${tx.status === 'paid' ? 'bg-gray-400' :
                                            tx.status === 'pending' ? 'bg-amber-400' : 'bg-green-500'
                                            }`}></span>
                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-green-600`}>
                                        +RM {tx.commissionAmount.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SalespersonLayout>
    );
};

export default EarningsPage;
