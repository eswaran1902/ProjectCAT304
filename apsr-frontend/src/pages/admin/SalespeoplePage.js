import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Search, Filter, MoreVertical, Shield, AlertTriangle, UserCheck, UserX, TrendingUp, DollarSign } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const SalespeoplePage = () => {
    const { token } = useContext(AuthContext);
    const socket = useSocket();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [filterTier, setFilterTier] = useState('All');
    const [people, setPeople] = useState([]);

    const fetchPeople = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/dashboard/admin/users', {
                headers: { 'x-auth-token': token }
            });
            setPeople(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchPeople();
    }, [token]);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => {
            console.log("Real-time update: User list refreshed");
            fetchPeople();
        };
        socket.on('user_registered', handleUpdate);
        socket.on('stats_updated', handleUpdate); // Refresh if sales change (tier updates)
        return () => {
            socket.off('user_registered', handleUpdate);
            socket.off('stats_updated', handleUpdate);
        };
    }, [socket, token]);

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/auth/approve/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchPeople();
            setSelectedPerson(null);
            alert("User approved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to approve user");
        }
    };

    const handleSuspend = async (id) => {
        if (!window.confirm("Are you sure you want to suspend/activate this user?")) return;
        try {
            await axios.put(`http://localhost:5001/api/auth/suspend/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchPeople();
            setSelectedPerson(null);
            alert("User status updated!");
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleTierChange = async (id, tier) => {
        try {
            await axios.put(`http://localhost:5001/api/auth/tier/${id}`, { tier }, {
                headers: { 'x-auth-token': token }
            });
            fetchPeople();
            setSelectedPerson(null);
            alert(`Tier updated to ${tier || 'Auto'}!`);
        } catch (err) {
            console.error(err);
            alert("Failed to update tier");
        }
    };

    const getStatusColor = (user) => {
        if (user.isSuspended) return 'bg-red-100 text-red-800';
        if (!user.isApproved) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (user) => {
        if (user.isSuspended) return 'Suspended';
        if (!user.isApproved) return 'Pending Approval';
        return 'Active';
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Gold': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Silver': return 'text-gray-600 bg-gray-100 border-gray-300';
            case 'Bronze': return 'text-orange-700 bg-orange-50 border-orange-200';
            default: return 'text-gray-600';
        }
    };

    // Filter Logic
    const filteredPeople = people.filter(p => {
        if (filterTier !== 'All' && p.tier !== filterTier) return false;
        return true;
    });

    const pendingCount = people.filter(p => !p.isApproved).length;

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Salespeople Management</h1>
                    <p className="text-gray-500 mt-1">Manage partner tiers, risks, and access.</p>
                </div>
                {pendingCount > 0 && (
                    <div className="px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-medium border border-yellow-200 flex items-center gap-2">
                        <UserCheck size={18} />
                        {pendingCount} New Signup{pendingCount > 1 ? 's' : ''} Pending
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex gap-4 bg-gray-50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Gold', 'Silver', 'Bronze'].map(tier => (
                            <button
                                key={tier}
                                onClick={() => setFilterTier(tier)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${filterTier === tier ? 'bg-white border-teal-500 text-teal-700 shadow-sm border' : 'text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name / ID</th>
                            <th className="px-6 py-4">Tier</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total Sales</th>
                            <th className="px-6 py-4">Risk Profile</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredPeople.map((person) => (
                            <tr key={person._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                                            {person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{person.name}</div>
                                            <div className="text-xs text-gray-500">{person._id.substring(0, 6)}... • {person.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded border text-xs font-bold uppercase ${getTierColor(person.tier)}`}>
                                        {person.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person)}`}>
                                        {getStatusText(person)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    RM {person.totalSales.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-green-600 font-medium text-xs">Low Risk</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedPerson(person)}
                                        className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPeople.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">No salespeople found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Profile Drawer */}
            {selectedPerson && (
                <div className="fixed inset-0 z-20 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">

                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Partner Profile</h2>
                            <button onClick={() => setSelectedPerson(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex-1">
                            {/* Identity Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    {selectedPerson.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedPerson.name}</h3>
                                    <p className="text-gray-500">{selectedPerson.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getTierColor(selectedPerson.tier)}`}>
                                            {selectedPerson.tier} Tier
                                        </span>
                                        {!selectedPerson.isApproved ? (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                                                <Shield size={10} /> Pending Approval
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                                                <Shield size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400 font-mono">
                                        Bank: {selectedPerson.bankDetails || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Sales</div>
                                    <div className="text-2xl font-bold text-gray-900">RM {selectedPerson.totalSales.toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Orders</div>
                                    <div className="text-2xl font-bold text-teal-600">{selectedPerson.ordersCount}</div>
                                </div>
                            </div>

                            {/* Actions Panel */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Administrative Actions</h4>
                                <div className="space-y-3">
                                    {!selectedPerson.isApproved && !selectedPerson.isSuspended && (
                                        <button
                                            onClick={() => handleApprove(selectedPerson._id)}
                                            className="w-full py-3 flex items-center justify-center gap-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                                        >
                                            <UserCheck size={18} /> Approve Account
                                        </button>
                                    )}

                                    <div className="p-3 border border-gray-200 rounded-lg">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Set Tier (Current: {selectedPerson.manualTier ? 'Manual' : 'Auto'})</label>
                                        <div className="flex gap-2">
                                            {['Gold', 'Silver', 'Bronze', 'Auto'].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => handleTierChange(selectedPerson._id, t === 'Auto' ? null : t)}
                                                    className={`pkg-2 py-1 flex-1 text-xs rounded border ${selectedPerson.tier === t ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSuspend(selectedPerson._id)}
                                        className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg font-bold transition-colors ${selectedPerson.isSuspended ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100' : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'}`}
                                    >
                                        {selectedPerson.isSuspended ? <UserCheck size={18} /> : <UserX size={18} />}
                                        {selectedPerson.isSuspended ? 'Activate Account' : 'Suspend Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default SalespeoplePage;
