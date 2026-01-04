import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { AlertCircle, MessageCircle, FileText, CheckCircle, XCircle, Clock, Paperclip } from 'lucide-react';

const DisputesPage = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Mock Data
    const tickets = [
        { id: 'TKT-2001', subject: 'Missing Commission for Order #7723', salesperson: 'Alex Morgan', status: 'Open', priority: 'High', date: '2 hrs ago', evidence: 'screenshot_proof.png' },
        { id: 'TKT-2002', subject: 'Incorrect Commission Rate Applied', salesperson: 'Sarah Jay', status: 'In Review', priority: 'Medium', date: '5 hrs ago', evidence: null },
        { id: 'TKT-1998', subject: 'Payout Batch #202 Not Received', salesperson: 'Mike Ross', status: 'Resolved', priority: 'High', date: 'Yesterday', evidence: 'bank_statement.pdf' },
    ];

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-600 bg-red-50 border-red-200';
        if (p === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const getStatusColor = (s) => {
        if (s === 'Open') return 'bg-green-100 text-green-800';
        if (s === 'In Review') return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Disputes & Support</h1>
                    <p className="text-gray-500 mt-1">Resolution center for commission claims.</p>
                </div>
                <div className="flex gap-3">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 outline-none">
                        <option>All Statuses</option>
                        <option>Open</option>
                        <option>Resolved</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                {/* Apps List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Ticket Queue</h3>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">2 Open</span>
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                        {tickets.map(ticket => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className="text-xs text-gray-400">{ticket.date}</span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 mb-1">{ticket.subject}</h4>
                                <p className="text-xs text-gray-500">{ticket.salesperson}</p>
                                <div className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <MessageCircle size={12} /> {ticket.id}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    {selectedTicket ? (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><AlertCircle size={14} /> Ticket #{selectedTicket.id}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> SLA: 4 hours left</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Issue Description</h4>
                                    <p className="text-sm text-gray-800">
                                        I referred a customer (Customer ID: 9928) yesterday who purchased the Enterprise plan, but the commission is not showing in my dashboard. Please investigate.
                                    </p>
                                    {selectedTicket.evidence && (
                                        <div className="mt-3 flex items-center gap-2 text-sm text-teal-600 font-medium cursor-pointer hover:underline">
                                            <Paperclip size={16} />
                                            {selectedTicket.evidence} (Click to preview)
                                        </div>
                                    )}
                                </div>

                                {/* Activity Log (Mock) */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">SM</div>
                                        <div>
                                            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm">
                                                I've checked the logs. The attribution cookie seems to have been blocked by the user's browser privacy settings.
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 block">Support Agent • 10:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm">
                                    Reply
                                </button>
                                <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-medium text-sm flex items-center gap-2">
                                    <XCircle size={16} /> Reject Claim
                                </button>
                                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm flex items-center gap-2 shadow-sm">
                                    <CheckCircle size={16} /> Approve & Credit
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <FileText size={48} className="mb-4 text-gray-200" />
                            <p>Select a ticket to begin resolution.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default DisputesPage;
