import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layouts/AdminLayout';
import { AlertCircle, MessageCircle, FileText, CheckCircle, XCircle, Clock, Paperclip } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const DisputesPage = () => {
    const socket = useSocket();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();

        if (socket) {
            socket.on('dispute_created', (newTicket) => {
                setTickets(prev => [newTicket, ...prev]);
            });
            socket.on('dispute_updated', (updatedTicket) => {
                setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
                if (selectedTicket?._id === updatedTicket._id) {
                    setSelectedTicket(updatedTicket);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('dispute_created');
                socket.off('dispute_updated');
            }
        };
    }, [socket, selectedTicket]);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/disputes', {
                headers: { 'x-auth-token': token }
            });
            setTickets(res.data);
        } catch (err) {
            console.error('Error fetching disputes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5001/api/disputes/${id}`,
                { status },
                { headers: { 'x-auth-token': token } }
            );
            // State update handled by socket event
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-600 bg-red-50 border-red-200';
        if (p === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const getStatusColor = (s) => {
        if (s === 'Open') return 'bg-green-100 text-green-800';
        if (s === 'In Review') return 'bg-purple-100 text-purple-800';
        if (s === 'Resolved') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Disputes & Support</h1>
                    <p className="text-gray-500 mt-1">Resolution center for commission claims.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                {/* Apps List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Ticket Queue</h3>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {tickets.filter(t => t.status === 'Open').length} Open
                        </span>
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                        {tickets.length === 0 ? (
                            <p className="p-4 text-center text-gray-400 text-sm">No tickets found.</p>
                        ) : tickets.map(ticket => (
                            <div
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?._id === ticket._id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{ticket.subject}</h4>
                                <p className="text-xs text-gray-500">{ticket.salesperson?.name || 'Unknown User'}</p>
                                <div className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <MessageCircle size={12} /> {ticket._id.substring(ticket._id.length - 6)}
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
                                        <span className="flex items-center gap-1"><AlertCircle size={14} /> ID: {selectedTicket._id}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Issue Description</h4>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {selectedTicket.description}
                                    </p>
                                </div>

                                {/* Activity Log (Mock for Response) */}
                                {selectedTicket.adminResponse && (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">AD</div>
                                        <div>
                                            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm">
                                                {selectedTicket.adminResponse}
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 block">Admin Response</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Footer */}
                            {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Rejected' && (
                                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedTicket._id, 'Rejected')}
                                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-medium text-sm flex items-center gap-2"
                                    >
                                        <XCircle size={16} /> Reject Claim
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedTicket._id, 'Resolved')}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm flex items-center gap-2 shadow-sm"
                                    >
                                        <CheckCircle size={16} /> Resolve & Close
                                    </button>
                                </div>
                            )}
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
