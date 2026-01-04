import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { AlertTriangle, CheckCircle, Clock, Search, Filter, ArrowRight, UserPlus, XCircle } from 'lucide-react';

const AttributionPage = () => {
    const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'mismatch'
    const [selectedTx, setSelectedTx] = useState(null);

    // Mock Data - Audit Queue (Standard)
    const auditQueue = [
        { id: 'ORD-7721', sales: 'John Sales', source: 'Link Click', risk: 12, amount: 450, time: '10:42 AM', device: 'Mobile', confidence: 'High' },
        { id: 'ORD-7725', sales: 'Mike D.', source: 'Link Click', risk: 8, amount: 890, time: '03:10 PM', device: 'Desktop', confidence: 'High' },
    ];

    // Mock Data - Mismatch/Exception Queue
    const mismatchQueue = [
        { id: 'ORD-7799', reason: 'Unmatched', desc: 'No salesperson cookie found', amount: 120, time: '09:15 AM' },
        { id: 'ORD-7801', reason: 'Duplicate Claim', desc: 'Claimed by John Sales & Sarah K.', amount: 2100, time: '11:20 AM' },
        { id: 'ORD-7805', reason: 'Suspicious', desc: 'High velocity (3s from click to buy)', amount: 550, time: '01:45 PM' },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attribution & Reconciliation</h1>
                    <p className="text-gray-500 mt-1">Audit commissions and resolve mismatches.</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'audit' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Audit Log
                    </button>
                    <button
                        onClick={() => setActiveTab('mismatch')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'mismatch' ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Mismatch Queue
                        <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full">3</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                {/* Left List Column */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input type="text" placeholder="Search ID..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500" />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-500">
                            <Filter size={16} />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {activeTab === 'audit' ? (
                            <ul className="divide-y divide-gray-100">
                                {auditQueue.map(tx => (
                                    <li
                                        key={tx.id}
                                        onClick={() => setSelectedTx(tx)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTx?.id === tx.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-gray-800 text-sm">{tx.id}</span>
                                            <span className="text-xs text-gray-400">{tx.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 truncate">{tx.sales}</span>
                                            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">Score: 98</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {mismatchQueue.map(tx => (
                                    <li
                                        key={tx.id}
                                        onClick={() => setSelectedTx({ ...tx, type: 'mismatch' })}
                                        className={`p-4 cursor-pointer hover:bg-amber-50/30 transition-colors ${selectedTx?.id === tx.id ? 'bg-amber-50 border-l-4 border-amber-500' : ''}`}
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                                                <AlertTriangle size={12} className="text-amber-500" />
                                                {tx.id}
                                            </span>
                                            <span className="text-xs text-gray-400">{tx.time}</span>
                                        </div>
                                        <div className="text-xs text-amber-700 font-medium mb-1">{tx.reason}</div>
                                        <div className="text-xs text-gray-500 truncate">{tx.desc}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Detail Column */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
                    {selectedTx ? (
                        <>
                            <div className="border-b border-gray-100 pb-6 mb-6 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedTx.id}</h2>
                                        {selectedTx.type === 'mismatch' ? (
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                Needs Review
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm">Session ID: sess_8829_xyz • IP: 192.168.1.12</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900">${selectedTx.amount}</p>
                                </div>
                            </div>

                            {/* Mismatch Resolver Tools */}
                            {selectedTx.type === 'mismatch' && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8">
                                    <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        Resolution Required: {selectedTx.reason}
                                    </h3>
                                    <p className="text-sm text-amber-800 mb-6">{selectedTx.desc}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-100 font-medium shadow-sm">
                                            <UserPlus size={16} />
                                            Assign Salesperson
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-100 font-medium shadow-sm">
                                            <ArrowRight size={16} />
                                            Split Commission
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-100 font-medium shadow-sm">
                                            <XCircle size={16} />
                                            Mark Non-Comm.
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Standard Attribution Data */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Attribution Signals</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">Source Token</div>
                                            <div className="font-mono text-sm font-medium text-gray-800">tok_ref_john_12</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">Click Timestamp</div>
                                            <div className="font-medium text-sm text-gray-800">10:15:22 AM (27m before buy)</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">Device Fingerprint</div>
                                            <div className="font-medium text-sm text-gray-800">Match (Mobile Safari)</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">AI Confidence</div>
                                            <div className="font-bold text-sm text-green-600 flex items-center gap-1">
                                                <CheckCircle size={14} />
                                                High (98.2%)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Search size={48} className="mb-4 text-gray-200" />
                            <p>Select a transaction to audit.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AttributionPage;
