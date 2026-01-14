import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PartnerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/partner-orders');
            setOrders(res.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to fetch orders');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {loading ? <p>Loading orders...</p> : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b font-medium text-gray-600">Order ID</th>
                                <th className="p-4 border-b font-medium text-gray-600">Date</th>
                                <th className="p-4 border-b font-medium text-gray-600">Customer</th>
                                <th className="p-4 border-b font-medium text-gray-600">Items (Qty)</th>
                                <th className="p-4 border-b font-medium text-gray-600">Total</th>
                                <th className="p-4 border-b font-medium text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50 border-b last:border-0">
                                    <td className="p-4 text-sm text-gray-600">#{order._id.slice(-6)}</td>
                                    <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm">
                                        <div className="font-semibold text-gray-800">{order.buyer?.name || 'Guest'}</div>
                                        <div className="text-xs text-gray-500">{order.buyer?.email}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="mb-1">
                                                <span className="font-medium">{item.product?.name}</span>
                                                <span className="text-gray-500"> x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 font-bold text-green-600">${order.totalAmount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 italic">No orders found having your products.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PartnerOrders;
