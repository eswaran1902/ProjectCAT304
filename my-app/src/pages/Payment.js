import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const handlePaid = async () => {
        try {
            await api.post(`/orders/${orderId}/pay`);
            alert('Payment Successful!');
            navigate('/marketplace');
        } catch (err) {
            alert('Payment confirmation failed');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Payment</h1>
                <p className="mb-4">Order ID: {orderId}</p>
                <div className="mb-6 p-4 border-2 border-dashed border-gray-400 rounded">
                    <p className="font-mono mb-2">Scan QR to Pay</p>
                    <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center">
                        {/* Placeholder for QR Code */}
                        <span className="text-4xl">QR</span>
                    </div>
                </div>
                <button onClick={handlePaid} className="bg-green-600 text-white px-8 py-3 rounded font-bold text-lg hover:bg-green-700">
                    I Have Paid
                </button>
            </div>
        </div>
    );
};

export default Payment;
