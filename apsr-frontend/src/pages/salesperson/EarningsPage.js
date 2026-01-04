import React, { useState } from 'react';
import SalespersonLayout from '../../components/layouts/SalespersonLayout';
import { DollarSign, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const EarningsPage = () => {
    // Mock Transaction History
    const transactions = [
        { id: 'TX-1001', date: 'Oct 24, 2024', desc: 'Commission - CRM Suite', type: 'Credit', amount: 45.00, status: 'Released' },
        { id: 'TX-1002', date: 'Oct 22, 2024', desc: 'Commission - Marketing Tool', type: 'Credit', amount: 15.00, status: 'Pending' },
        { id: 'TX-0998', date: 'Oct 15, 2024', desc: 'Payout - Bank Transfer', type: 'Debit', amount: -650.00, status: 'Paid' },
    ];

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
                        <h2 className="text-4xl font-bold text-white mb-2">RM 1,250.00</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Next Payout: Nov 01, 2024
                        </div>
                    </div>
                    <div>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-teal-900/20">
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
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{tx.desc}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${tx.type === 'Credit' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}>
                                        {tx.type === 'Credit' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block w-2 H-2 rounded-full mr-2 ${tx.status === 'Paid' ? 'bg-gray-400' :
                                        tx.status === 'Pending' ? 'bg-amber-400' : 'bg-green-500'
                                        }`}></span>
                                    {tx.status}
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SalespersonLayout>
    );
};

export default EarningsPage;
