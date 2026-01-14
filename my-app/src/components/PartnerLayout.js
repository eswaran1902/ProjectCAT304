import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PartnerLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'bg-blue-700' : '';

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-blue-700">
                    Partner Portal
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/partner" className={`block p-3 rounded hover:bg-blue-700 transition ${isActive('/partner')}`}>
                        Dashboard
                    </Link>
                    <Link to="/partner/products" className={`block p-3 rounded hover:bg-blue-700 transition ${isActive('/partner/products')}`}>
                        My Products
                    </Link>
                    <Link to="/partner/orders" className={`block p-3 rounded hover:bg-blue-700 transition ${isActive('/partner/orders')}`}>
                        Orders
                    </Link>
                    <Link to="/partner/profile" className={`block p-3 rounded hover:bg-blue-700 transition ${isActive('/partner/profile')}`}>
                        Profile
                    </Link>
                </nav>
                <div className="p-4 border-t border-blue-700">
                    <div className="mb-4 text-sm text-blue-200">
                        Logged in as {user?.name || 'Partner'}
                    </div>
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-white transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {location.pathname === '/partner' ? 'Dashboard' :
                            location.pathname.split('/partner/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/partner/')[1]?.slice(1) || 'Page'}
                    </h2>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PartnerLayout;
