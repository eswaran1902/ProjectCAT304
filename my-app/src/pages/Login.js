import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = await login(formData.email, formData.password);
            if (role === 'partner') navigate('/partner');
            else navigate('/marketplace');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
