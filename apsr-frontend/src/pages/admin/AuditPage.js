import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Shield, Search, Download, Filter, User, Activity, Clock } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const AuditPage = () => {
    const socket = useSocket();
    const [filterType, setFilterType] = useState('All');
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();

        if (socket) {
            socket.on('audit_log', (newLog) => {
                setLogs(prev => [newLog, ...prev]);
            });
        }

        return () => {
            if (socket) {
                socket.off('audit_log');
            }
        };
    }, [socket]);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/audit', {
                headers: { 'x-auth-token': token }
            });
            setLogs(res.data);
        } catch (err) {
            console.error('Error fetching logs:', err);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Security': return 'text-red-600 bg-red-50 border-red-200';
            case 'System': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Action': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const filteredLogs = logs.filter(l => {
        const matchesFilter = filterType === 'All' || l.type === filterType;
        const matchesSearch = l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l._id && l._id.includes(searchTerm));
        return matchesFilter && matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs & Compliance</h1>
                    <p className="text-gray-500 mt-1">Immutable system-wide event trail.</p>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex gap-4 bg-gray-50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search logs by User, ID or Action..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Security', 'System', 'Action'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${filterType === type ? 'bg-white border-teal-500 text-teal-700 shadow-sm border' : 'text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Target</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Log ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                                        No audit logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-900">
                                            <User size={14} className="text-gray-400" />
                                            {log.user}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeColor(log.type)}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{log.action}</td>
                                    <td className="px-6 py-4 text-teal-600 font-mono text-xs max-w-[150px] truncate" title={log.target}>
                                        {log.target}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs selection:bg-gray-200">
                                        {log._id.substring(log._id.length - 8)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-center">
                    <Shield size={12} className="mr-1" />
                    This audit trail is read-only and immutable. Archived for 7 years.
                </div>
            </div>
        </AdminLayout>
    );
};

export default AuditPage;
