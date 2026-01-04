import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    CreditCard,
    BarChart2,
    Settings,
    LogOut,
    Bell,
    Search,
    Box,
    MessageSquare,
    AlertOctagon,
    FileText
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => logout(), 100); // Small delay to ensure navigation happens first
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { label: 'Attribution', path: '/attribution', icon: BarChart2 }, // Kept existing route for now
        { label: 'Commissions', path: '/admin/commissions', icon: CreditCard },
        { label: 'Payouts', path: '/admin/payouts', icon: Box },
        { label: 'Salespeople', path: '/admin/salespeople', icon: Users },
        { label: 'Products', path: '/admin/products', icon: Box },
        { label: 'Channels', path: '/admin/channels', icon: MessageSquare },
        { label: 'Disputes', path: '/admin/disputes', icon: AlertOctagon },
        { label: 'Audit Logs', path: '/admin/audit', icon: FileText },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">A</div>
                    <span className="font-bold text-xl tracking-tight text-gray-800">APSR Admin</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} className={`mr-3 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    {/* Search */}
                    <div className="relative w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                            placeholder="Search orders, salespeople, or transaction IDs..."
                        />
                    </div>

                    {/* Profile & Notifs */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</div>
                                <div className="text-xs text-gray-500">Super Admin</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
