import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layouts/AdminLayout';
import { User, Shield, DollarSign, Lock, Save, Plus, Upload, CheckCircle } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        avatar: null
    });
    const [previewAvatar, setPreviewAvatar] = useState(null);

    // Team State
    const [pendingAdmins, setPendingAdmins] = useState([]);

    // Commission State
    const [settings, setSettings] = useState({
        commissionRate: 10,
        commissionCap: 500,
        autoApproveLowRisk: true
    });

    useEffect(() => {
        fetchUser();
        fetchPendingAdmins();
        fetchSettings();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
            setFormData(prev => ({ ...prev, name: res.data.name }));
            if (res.data.avatar) setPreviewAvatar(`http://localhost:5001${res.data.avatar}`);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPendingAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/auth/pending-admins', {
                headers: { 'x-auth-token': token }
            });
            setPendingAdmins(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/settings', {
                headers: { 'x-auth-token': token }
            });
            setSettings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.avatar) data.append('avatar', formData.avatar);

            await axios.put('http://localhost:5001/api/auth/profile', data, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            fetchUser();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5001/api/auth/profile', { password: formData.newPassword }, {
                headers: { 'x-auth-token': token }
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update password' });
        }
    };

    const handleSettingsUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5001/api/settings', settings, {
                headers: { 'x-auth-token': token }
            });
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        }
    };

    const handleApproveAdmin = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/auth/approve/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchPendingAdmins();
            setMessage({ type: 'success', text: 'Admin approved successfully!' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 mt-1">Configure global rules and team access.</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-64 border-r border-gray-100 p-2">
                    {[
                        { id: 'general', label: 'General Profile', icon: User },
                        { id: 'team', label: 'Team & Roles', icon: Shield },
                        { id: 'commissions', label: 'Commission Rules', icon: DollarSign },
                        { id: 'security', label: 'Security', icon: Lock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'general' && (
                        <form onSubmit={handleProfileUpdate} className="max-w-xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">General Profile</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative w-24 h-24">
                                        {previewAvatar ? (
                                            <img src={previewAvatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-bold">
                                                {user?.name?.charAt(0)}
                                            </div>
                                        )}
                                        <label className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 shadow-sm">
                                            <Upload size={14} />
                                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user?.name}</h3>
                                        <p className="text-sm text-gray-500">{user?.role}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500" value={user?.email} disabled />
                                </div>
                                <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-md">
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'team' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Admin Team Management</h2>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3">Member</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-900">You ({user?.name})</td>
                                            <td className="px-6 py-4">{user?.email}</td>
                                            <td className="px-6 py-4 text-green-600 font-medium">Active</td>
                                            <td className="px-6 py-4 text-right"><span className="text-gray-400">Current</span></td>
                                        </tr>
                                        {pendingAdmins.map(admin => (
                                            <tr key={admin._id} className="bg-amber-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                                                <td className="px-6 py-4">{admin.email}</td>
                                                <td className="px-6 py-4 text-amber-600 font-bold">Pending Approval</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleApproveAdmin(admin._id)}
                                                        className="bg-teal-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-teal-700 flex items-center gap-1 ml-auto"
                                                    >
                                                        <CheckCircle size={12} /> Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pendingAdmins.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                                                    No pending admin requests.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'commissions' && (
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Global Commission Rules</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Default Commission Rate (%)</label>
                                    <p className="text-xs text-gray-500 mb-2">Applied to products without specific overrides.</p>
                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={settings.commissionRate}
                                            onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 my-6"></div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Commission Cap ($)</label>
                                    <p className="text-xs text-gray-500 mb-2">Maximum commission payable per single transaction.</p>
                                    <div className="flex gap-4 items-center">
                                        <span className="text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={settings.commissionCap}
                                            onChange={(e) => setSettings({ ...settings, commissionCap: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 my-6"></div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="auto-approval"
                                        className="rounded text-teal-600 focus:ring-teal-500 h-5 w-5"
                                        checked={settings.autoApproveLowRisk}
                                        onChange={(e) => setSettings({ ...settings, autoApproveLowRisk: e.target.checked })}
                                    />
                                    <div>
                                        <label htmlFor="auto-approval" className="block text-sm font-bold text-gray-900">Auto-Approve Low Risk Commissions</label>
                                        <p className="text-xs text-gray-500">Automatically move entries to "Payable" after 30 days if risk score is low.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSettingsUpdate}
                                    className="mt-4 px-5 py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-md flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Rules
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordUpdate} className="max-w-xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black shadow-md">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;
