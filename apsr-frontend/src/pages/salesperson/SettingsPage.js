import React, { useState, useContext, useEffect } from 'react';
import SalespersonLayout from '../../components/layouts/SalespersonLayout';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const SettingsPage = () => {
    const { token, user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        referralCode: 'Loading...'
    });
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const activeToken = token || storedToken;

        console.log("SettingsPage mounted. Active Token:", activeToken ? "Present" : "Missing");

        const fetchUserData = async () => {
            console.log("Fetching user data...");
            try {
                const res = await axios.get('http://localhost:5001/api/auth/me', {
                    headers: { 'x-auth-token': activeToken }
                });
                console.log("User data fetched:", res.data);
                setProfileData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    referralCode: res.data.referralCode || 'Not Assigned',
                    bankDetails: res.data.bankDetails || ''
                });
            } catch (err) {
                console.error("Error fetching user data", err);
                // Fallback to context
                if (user) {
                    setProfileData({
                        name: user.name || '',
                        email: user.email || '',
                        referralCode: user.referralCode || '',
                        bankDetails: user.bankDetails || ''
                    });
                }
            }
        };

        if (activeToken) fetchUserData();
        else console.log("No token found in context or localStorage");
    }, [token, user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const activeToken = token || localStorage.getItem('token');

        try {
            await axios.put('http://localhost:5001/api/auth/profile',
                { name: profileData.name, bankDetails: profileData.bankDetails },
                { headers: { 'x-auth-token': activeToken } }
            );
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.password !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        const activeToken = token || localStorage.getItem('token');

        try {
            await axios.put('http://localhost:5001/api/auth/profile',
                { password: passwordData.password },
                { headers: { 'x-auth-token': activeToken } }
            );
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ password: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SalespersonLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your profile and security preferences.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User size={20} className="text-teal-600" />
                        Profile Details
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={profileData.referralCode || ''}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-mono tracking-wider font-bold"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Your unique ID for attribution.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details (Bank & Acc No)</label>
                            <input
                                type="text"
                                value={profileData.bankDetails || ''}
                                onChange={(e) => setProfileData({ ...profileData, bankDetails: e.target.value })}
                                placeholder="e.g. Maybank 1234567890"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={profileData.email}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed contact support.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Security Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-teal-600" />
                        Security
                    </h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                placeholder="Min. 6 characters"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Re-enter password"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-800 text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                        >
                            <Lock size={18} />
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Support & Disputes */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit mt-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <AlertCircle size={20} className="text-teal-600" />
                        Support & Disputes
                    </h2>
                    <DisputeForm token={token} setMessage={setMessage} setLoading={setLoading} loading={loading} />
                </div>
            </div>
        </SalespersonLayout>
    );
};

const DisputeForm = ({ token, setMessage, setLoading, loading }) => {
    const [formData, setFormData] = useState({ subject: '', description: '', priority: 'Medium' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const activeToken = token || localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5001/api/disputes', formData, {
                headers: { 'x-auth-token': activeToken }
            });
            setMessage({ type: 'success', text: 'Ticket submitted successfully! Admin will review shortly.' });
            setFormData({ subject: '', description: '', priority: 'Medium' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to submit ticket.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief issue summary"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                    <CheckCircle size={18} />
                    Submit Ticket
                </button>
            </div>
        </form>
    );
};

export default SettingsPage;
