import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import qrPaymentImg from '../assets/qr_payment.jpg';

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

    const [referralCode, setReferralCode] = useState(localStorage.getItem('referralCode') || '');

    const [paymentMethod, setPaymentMethod] = useState('qr_pay');
    const [receiptFile, setReceiptFile] = useState(null);

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
        if (!referralCode.trim()) {
            alert("Referral Code is required to complete the purchase.");
            return;
        }

        if (paymentMethod === 'qr_pay' && !receiptFile) {
            alert("Please upload your payment receipt.");
            return;
        }

        setLoading(true);
        try {
            // Mock API Call preparation
            const buyerId = localStorage.getItem('userId');

            // Construct FormData for upload
            const formDataPayload = new FormData();
            // Use a valid 24-char hex string for fallback to avoid CastError if userId is missing
            formDataPayload.append('buyerId', buyerId || '650d3f8e9a2b5c7d1e8f9a2b');
            formDataPayload.append('items', JSON.stringify(cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity
            })))); // Stringify for FormData
            formDataPayload.append('shippingAddress', JSON.stringify(formData));
            formDataPayload.append('paymentMethod', paymentMethod);
            formDataPayload.append('referralCode', referralCode);

            if (receiptFile) {
                formDataPayload.append('receipt', receiptFile);
            }

            // Let browser set Content-Type with boundary for FormData
            await axios.post('http://localhost:5001/api/orders', formDataPayload);

            clearCart();
            setStep('success');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.response?.data || err.message;
            alert(`Failed to place order: ${errorMsg}`);
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
                    <p className="text-gray-500 mb-8">
                        {paymentMethod === 'qr_pay'
                            ? "Your receipt has been uploaded and is pending admin approval."
                            : "Thank you for your purchase. We have received your order."}
                    </p>
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
                            onClick={() => step === 'payment' && setStep('payment')}
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
                                {/* ... existing shipping form ... */}
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

                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={qrPaymentImg}
                                                alt="QR Payment"
                                                className="w-64 h-auto rounded-lg shadow-md"
                                            />
                                        </div>
                                        <p className="font-bold text-gray-900">Scan to Pay: RM {total.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">Recipient: APSR System</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Upload Receipt (Required)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setReceiptFile(e.target.files[0])}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>

                                    <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        <span>Only QR Payment (DuitNow) is available at this time.</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Referral Code (Required)</label>
                                    <input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        placeholder="Enter Salesperson Code"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Please enter the referral code of the salesperson who referred you.</p>
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
                                    {loading ? 'Processing...' : (paymentMethod === 'qr_pay' ? 'Submit Receipt' : `Pay RM ${total.toFixed(2)}`)}
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
