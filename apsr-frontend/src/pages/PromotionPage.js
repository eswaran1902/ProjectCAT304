import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PromotionPage = () => {
    const { id } = useParams(); // In real app, fetch product by ID
    const [copied, setCopied] = useState(false);

    // Mock Product Data
    const product = {
        id: 'prod_123',
        name: 'Enterprise CRM Suite',
        description: 'The ultimate customer relationship management tool for growing businesses. Features include automated workflows, AI insights, and seamless integrations.',
        price: 5000,
        commissionRate: 10,
        commissionAmount: 500,
        image: 'https://via.placeholder.com/600x400/0f766e/ffffff?text=CRM+Suite'
    };

    const referralLink = `https://apsr.com/ref/john_sales/${product.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            {/* Navbar Placeholder */}
            <div className="w-full max-w-lg mb-4 flex items-center text-gray-500">
                <Link to="/salesperson" className="flex items-center hover:text-teal-600 transition-colors">
                    <span className="mr-1">←</span> Back to Dashboard
                </Link>
            </div>

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Product Image */}
                <div className="h-64 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-teal-800 text-white opacity-20 text-4xl font-bold">
                        IMG
                    </div>
                    {/* Real image would act as cover */}
                </div>

                <div className="p-8">
                    {/* Badge */}
                    <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                        High Commission
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                        {product.name}
                    </h1>

                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Commission Highlight */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-teal-100">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-gray-500 text-sm font-medium mb-1">Your Commission</div>
                                <div className="text-4xl font-bold text-teal-700">${product.commissionAmount}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-400 text-xs mb-1">Price</div>
                                <div className="text-lg font-semibold text-gray-900">${product.price.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleCopy}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${copied
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                    : 'bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700'
                                }`}
                        >
                            {copied ? (
                                <><span>✓</span> Link Copied!</>
                            ) : (
                                <><span>🔗</span> Copy Referral Link</>
                            )}
                        </button>

                        <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <span>💬</span> Share via WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-gray-400 text-xs">
                Powered by APSR Attribution Engine™
            </div>
        </div>
    );
};

export default PromotionPage;
