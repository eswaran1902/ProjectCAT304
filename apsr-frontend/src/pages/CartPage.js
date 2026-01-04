import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ShoppingBag size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Browse Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ShoppingBag />
                    Your Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                {/* Image Placeholder */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300">
                                    <ShoppingBag size={24} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.category}</p>
                                    <p className="font-bold text-indigo-600 mt-1">RM {item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors font-bold"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>RM {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax (0%)</span>
                                    <span>RM 0.00</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                    <span>Total</span>
                                    <span>RM {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </button>

                            <button
                                onClick={() => navigate('/marketplace')}
                                className="w-full mt-3 text-gray-500 font-medium py-2 hover:text-gray-700 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
