import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Account Required</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Marketplace</h2>
                    <p className="text-gray-500 mb-8">
                        To add items to your cart and complete purchases, please log in or create a buyer account.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                        >
                            <LogIn size={20} />
                            Log In
                        </button>

                        <button
                            onClick={() => navigate('/signup?role=buyer')}
                            className="w-full bg-white text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} />
                            Create Buyer Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
