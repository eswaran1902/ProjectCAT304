import React, { useState } from 'react';

const AttributionPanel = () => {
    const [selectedTx, setSelectedTx] = useState(null);

    // Mock Transaction Data
    const transactions = [
        { id: 'ORD-7721', sales: 'John Sales', source: 'Link Click', risk: 12, amount: 450, time: '10:42 AM', device: 'Mobile', confidence: 'High' },
        { id: 'ORD-7722', sales: 'Sarah K.', source: 'QR Scan', risk: 85, amount: 2100, time: '11:15 AM', device: 'Desktop', confidence: 'Low' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
            {/* List View */}
            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Audit Queue</div>
                <ul className="divide-y divide-gray-100">
                    {transactions.map(tx => (
                        <li
                            key={tx.id}
                            onClick={() => setSelectedTx(tx)}
                            className={`p-4 cursor-pointer hover:bg-teal-50 transition-colors ${selectedTx?.id === tx.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-gray-800">{tx.id}</span>
                                <span className="text-xs text-gray-500">{tx.time}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{tx.sales}</span>
                                {tx.risk > 50 ? (
                                    <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full">High Risk</span>
                                ) : (
                                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Detail View */}
            <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {selectedTx ? (
                    <>
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit: {selectedTx.id}</h2>
                            <p className="text-gray-500 text-sm">Reviewing attribution logic and risk signals.</p>
                        </div>

                        {/* Attribution Timeline Visualization */}
                        <div className="mb-10">
                            <h3 className="font-bold text-gray-800 mb-6">Attribution Timeline</h3>
                            <div className="relative flex items-center justify-between">
                                {/* Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>

                                {/* Steps */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold mb-2">1</div>
                                    <span className="text-xs font-bold text-gray-600">Link Generated</span>
                                    <span className="text-xs text-gray-400">09:30 AM</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold mb-2">2</div>
                                    <span className="text-xs font-bold text-gray-600">Click & Cookie</span>
                                    <span className="text-xs text-gray-400">10:15 AM</span>
                                </div>
                                <div className={`flex flex-col items-center`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 text-white ${selectedTx.risk > 50 ? 'bg-amber-500' : 'bg-teal-600'}`}>3</div>
                                    <span className="text-xs font-bold text-gray-600">Conversion</span>
                                    <span className="text-xs text-gray-400">{selectedTx.time}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Analysis Card */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>🤖</span> AI Risk Assessment
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Confidence Score</div>
                                    <div className="text-xl font-bold text-gray-900">{selectedTx.confidence === 'High' ? '98.2%' : '45.4%'}</div>
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-full ${selectedTx.confidence === 'High' ? 'bg-green-500 w-[98%]' : 'bg-red-500 w-[45%]'}`}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Device Fingerprint</div>
                                    <div className="text-sm font-medium text-gray-800">{selectedTx.device} (Valid)</div>
                                    <div className="text-xs text-gray-400 mt-1">IP: 192.168.1.XX (US)</div>
                                </div>
                            </div>
                            {selectedTx.risk > 50 && (
                                <div className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
                                    <strong>Warning:</strong> Time-to-conversion was unusually fast (less than 30s).
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-4">🔍</span>
                        <p>Select a transaction to verify attribution.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttributionPanel;
