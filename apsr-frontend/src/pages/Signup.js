import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get('role');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: roleParam === 'buyer' ? 'buyer' : 'salesperson'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const role = await register(formData.name, formData.email, formData.password, formData.role);
            if (role === 'admin') navigate('/admin');
            else if (role === 'buyer') navigate('/marketplace');
            else navigate('/salesperson');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join the APSR Network</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="John Doe"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="you@example.com"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>
                    {formData.role !== 'buyer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                            <select
                                name="role"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                onChange={handleChange}
                                value={formData.role}
                            >
                                <option value="salesperson">Salesperson</option>
                                <option value="admin">Admin / Merchant</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-600 font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
