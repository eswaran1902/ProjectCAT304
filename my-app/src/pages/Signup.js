import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'general' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = await register(formData.name, formData.email, formData.password, formData.role);
            if (role === 'partner') navigate('/partner');
            else navigate('/marketplace');
        } catch (err) {
            console.error('Signup Error:', err.response?.data || err.message);
            alert('Signup failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <input name="name" type="text" placeholder="Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <select name="role" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
                    <option value="general">General (Customer)</option>
                    <option value="partner">Partner (Shop Owner)</option>
                </select>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Sign Up</button>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
