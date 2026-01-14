import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PartnerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // For now, just getting product count
                const res = await api.get('/products/myproducts');
                setStats(s => ({ ...s, products: res.data.length }));
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, {user?.name || 'Partner'}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-uppercase mb-1">Total Products</h3>
                    <p className="text-4xl font-bold text-gray-800">{stats.products}</p>
                    <Link to="/partner/products" className="text-blue-500 text-sm mt-2 inline-block hover:underline">Manage Products &rarr;</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-uppercase mb-1">Total Orders</h3>
                    <p className="text-4xl font-bold text-gray-800">{stats.orders}</p>
                    <Link to="/partner/orders" className="text-green-500 text-sm mt-2 inline-block hover:underline">View Orders &rarr;</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-uppercase mb-1">Total Revenue</h3>
                    <p className="text-4xl font-bold text-gray-800">${stats.revenue}</p>
                    <span className="text-purple-500 text-sm mt-2 inline-block">Estimated Earnings</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent activity found.</p>
            </div>
        </div>
    );
};

export default PartnerDashboard;
