import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    LayoutDashboard,
    ShoppingBag,
    Link as LinkIcon,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    TrendingUp
} from 'lucide-react';

const SalespersonLayout = ({ children }) => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => logout(), 100);
    };

    const navItems = [
        { path: '/salesperson', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/salesperson/catalog', label: 'Product Catalog', icon: ShoppingBag },
        { path: '/salesperson/links', label: 'My Links', icon: LinkIcon },
        { path: '/salesperson/earnings', label: 'Earnings & Payouts', icon: DollarSign },
        { path: '/salesperson/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        S
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Partner Portal</span>
                </div>

                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                            {user?.role ? user.role[0].toUpperCase() : 'S'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Partner'}</p>
                            <p className="text-xs text-teal-600 font-medium">{user?.tier || 'Silver'} Tier Partner</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/salesperson' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-teal-600' : 'text-gray-400'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 transition-all duration-300">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            S
                        </div>
                        <span className="font-bold text-gray-900">Partner Portal</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-200 shadow-xl absolute top-16 left-0 w-full z-40 animate-in slide-in-from-top-2">
                        <nav className="p-4 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === item.path ? 'bg-teal-50 text-teal-700' : 'text-gray-600'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-2"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SalespersonLayout;
