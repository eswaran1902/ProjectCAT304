import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const PartnerProfile = () => {
    const { logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setFormData({ name: res.data.name, email: res.data.email, password: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await api.put('/auth/profile', { name: formData.name, password: formData.password });
            setMessage('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (err) {
            setMessage('Error updating profile');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            {message && (
                <div className={`p-3 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" value={formData.email} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full border p-2 rounded" />
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default PartnerProfile;
