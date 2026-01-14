import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Search, Filter, ChevronDown, CheckCircle, AlertCircle, Clock, X, Eye, Phone, Globe, MessageSquare } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const OrdersPage = () => {
    const { token } = useContext(AuthContext);
    const socket = useSocket();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/orders', {
                headers: { 'x-auth-token': token }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    // Real-time listener
    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => {
            console.log("Real-time update: Orders list refreshed");
            fetchOrders();
        };

        socket.on('order_created', handleUpdate);
        socket.on('order_updated', handleUpdate);

        return () => {
            socket.off('order_created', handleUpdate);
            socket.off('order_updated', handleUpdate);
        };
    }, [socket, token]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'pending_approval': return 'bg-orange-100 text-orange-800';
            case 'flagged': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    const getChannelIcon = (channel) => {
        // Map backend payment/channel to icon
        // Currently backend stores paymentMethod, not explicit 'channel' like WhatsApp unless custom field
        // For now, we defaults to 'Globe' unless we infer from something else or add 'source' field to Order
        // Let's assume 'manual' or 'link' from Transactions logic could be here if we fetched transactions
        // For now, simple mapping:
        return <Globe size={16} className="text-purple-600" />;
    };

    const filteredOrders = filterStatus === 'All'
        ? orders
        : orders.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase() || (filterStatus === 'Pending' && o.status === 'pending_approval'));

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders & Transactions</h1>
                    <p className="text-gray-500 mt-1">Manage and audit all platform sales.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
                        <Filter size={16} className="mr-2" />
                        Filters
                    </button>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 overflow-x-auto">
                {['All', 'Paid', 'Pending', 'Flagged'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Channel</th>
                            <th className="px-6 py-4">Salesperson</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-teal-600">{order._id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.buyer?.name || 'Guest'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getChannelIcon(order.paymentMethod)}
                                        <span>{order.paymentMethod === 'qr_pay' ? 'QR Pay' : 'Stripe'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{order.salesperson?.name || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status === 'flagged' && <AlertCircle size={12} className="mr-1" />}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">RM {order.totalAmount?.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-gray-400 hover:text-teal-600 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Drawer (Right Side) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-20 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>

                    {/* Sidebar */}
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Order Header Card */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h3>
                                    <p className="text-sm text-gray-500">{selectedOrder.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</div>
                                    <div className="text-xl font-bold text-gray-900">RM {selectedOrder.amount.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 text-right">Commission</div>
                                    <div className="text-lg font-bold text-teal-600 text-right">RM {(selectedOrder.amount * 0.1).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Attribution Card */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Attribution Record</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Salesperson</span>
                                    <span className="font-medium text-teal-700">{selectedOrder.salesperson}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Source</span>
                                    <span className="font-medium text-gray-900">{selectedOrder.attribution}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Risk Score</span>
                                    <span className={`font-bold ${selectedOrder.risk > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedOrder.risk}/100
                                    </span>
                                </div>
                                {selectedOrder.risk > 50 && (
                                    <div className="bg-red-50 p-3 rounded-lg text-xs text-red-700 border border-red-100 mt-2">
                                        <strong>Risk Alert:</strong> Abnormal user velocity detected. Verify with customer before releasing commission.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buyer Journey */}
                        <div className="mb-8">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Buyer Journey</h4>
                            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white"></div>
                                    <p className="text-xs text-gray-400 mb-0.5">10:40 AM</p>
                                    <p className="text-sm font-medium text-gray-900">User clicked referral link</p>
                                    <p className="text-xs text-gray-500">Source: WhatsApp</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white"></div>
                                    <p className="text-xs text-gray-400 mb-0.5">10:41 AM</p>
                                    <p className="text-sm font-medium text-gray-900">Added "CRM Suite" to cart</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-500 border border-white"></div>
                                    <p className="text-xs text-gray-400 mb-0.5">10:42 AM</p>
                                    <p className="text-sm font-bold text-teal-700">Checkout Completed</p>
                                    <p className="text-xs text-gray-500">Payment ID: tx_8823_stripe</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button className="py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">
                                View Invoice
                            </button>
                            <button className="py-3 bg-teal-600 rounded-lg text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-200">
                                Verify Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrdersPage;
