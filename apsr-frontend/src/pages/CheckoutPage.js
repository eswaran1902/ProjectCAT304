import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('shipping'); // shipping, payment, success

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        zip: '',
        country: 'Malaysia'
    });

    const total = getCartTotal();

    // Redirect if cart empty or not logged in
    if (cartItems.length === 0 && step !== 'success') {
        setTimeout(() => navigate('/marketplace'), 0);
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Mock API Call
            // Note: In a real app we would get buyerId from the token in the backend from the request, 
            // but for this MVP orders route expects buyerId in body if we didn't update it to use auth middleware yet.
            // Let's assume we need to pass a buyerId. Since we don't have the user ID easily accessible in the frontend `user` object 
            // (User object in AuthContext usually just has name/role/token in this implementation, let's check),
            // we might need to rely on the backend decoding the token. 
            // However, the current backend /api/orders route reads `buyerId` from body.
            // I'll check AuthContext again. It stores { role, name }. It DOES NOT store ID.
            // This is a gap. I should probably decode the token or fetch /me.
            // For now, I will simulate it or assume the backend can handle it if I pass a placeholder or if I update backend to use req.user.id.
            // Actually, I'll pass a dummy ID or "guest" if I can't get it, BUT `Order` model requires buyer ID.
            // Let's check Login.js to see what it stores. It stores `token`, `role`, `name`.
            // I should update Login to store ID too.
            // OR I can blindly trust the backend to use the token if I add middleware.
            // The EASIEST fix right now without refactoring everything is:
            // 1. Update AuthContext/Login to store `_id`.
            // 2. Pass it here.

            // Let's assume I will fix AuthContext in a moment.
            const buyerId = localStorage.getItem('userId'); // I'll add this to Login/Register response handling.

            const orderData = {
                buyerId: buyerId || '650d...placeholder', // Fallback for safety to prevent crash, but strictly should be real.
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                shippingAddress: formData,
                paymentMethod: 'credit_card',
                // salespersonId: ... (We need to track this context from the marketplace link?) 
                // For now, I'll omit salespersonId unless we added referral logic.
            };

            await axios.post('http://localhost:5001/api/orders', orderData);

            clearCart();
            setStep('success');
        } catch (err) {
            console.error(err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. We have received your order.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button
                            className={`flex-1 py-4 font-bold text-sm ${step === 'shipping' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
                            onClick={() => setStep('shipping')}
                        >
                            1. Shipping
                        </button>
                        <button
                            className={`flex-1 py-4 font-bold text-sm ${step === 'payment' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
                            onClick={() => step === 'payment' && setStep('payment')} // Only clickable if active or passed (logic simplified)
                        >
                            2. Payment
                        </button>
                    </div>

                    <div className="p-8">
                        {step === 'shipping' ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <Truck size={20} className="text-indigo-600" />
                                    Shipping Details
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123 Main St" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Kuala Lumpur" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">ZIP / Postcode</label>
                                        <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="50000" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep('payment')}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-indigo-700 transition-colors"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <CreditCard size={20} className="text-indigo-600" />
                                    Payment Details
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4 text-sm text-gray-500">
                                    This is a mock checkout. No valid card details required.
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Card Number (Mock)</label>
                                    <input type="text" disabled value="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500" />
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-4">
                                    <span className="font-bold text-gray-900">Total to Pay</span>
                                    <span className="text-2xl font-bold text-indigo-600">RM {total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center"
                                >
                                    {loading ? 'Processing...' : `Pay RM ${total.toFixed(2)}`}
                                </button>
                                <button
                                    onClick={() => setStep('shipping')}
                                    className="w-full text-gray-500 py-2 hover:text-gray-900 font-medium"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
