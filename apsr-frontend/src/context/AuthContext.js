import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on start
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode or verify token effectively?
            // For now, assume if token exists, we are logged in.
            // Ideally, verify with backend /me endpoint.
            const storedRole = localStorage.getItem('role');
            const storedName = localStorage.getItem('name');
            const storedId = localStorage.getItem('userId');
            const storedRef = localStorage.getItem('referralCodeOwn'); // Use distinct key to avoid conflict with buyer attribution
            setUser({ role: storedRole, name: storedName, id: storedId, referralCode: storedRef });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('userId', res.data.id);
            if (res.data.referralCode) {
                localStorage.setItem('referralCodeOwn', res.data.referralCode);
            }
            setUser({ role: res.data.role, name: res.data.name, id: res.data.id, referralCode: res.data.referralCode });
            return res.data.role; // Return role for redirect
        } catch (err) {
            throw err.response?.data?.msg || 'Login failed';
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('userId', res.data.id);
            if (res.data.referralCode) {
                localStorage.setItem('referralCodeOwn', res.data.referralCode);
            }
            setUser({ role: res.data.role, name: res.data.name, id: res.data.id, referralCode: res.data.referralCode });
            return res.data.role;
        } catch (err) {
            throw err.response?.data?.msg || 'Signup failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('referralCodeOwn');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token: localStorage.getItem('token'), login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
