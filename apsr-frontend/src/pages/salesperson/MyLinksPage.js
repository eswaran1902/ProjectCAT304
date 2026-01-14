import React, { useState, useEffect, useContext } from 'react';
import SalespersonLayout from '../../components/layouts/SalespersonLayout';
import { Copy, Link as LinkIcon, ExternalLink, Search, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const MyLinksPage = () => {
    const { token } = useContext(AuthContext);
    const [referralCode, setReferralCode] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedMap, setCopiedMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Referral Code (from stats endpoint which ensures it exists)
                const statsRes = await axios.get('http://localhost:5001/api/dashboard/salesperson/stats', {
                    headers: { 'x-auth-token': token }
                });
                setReferralCode(statsRes.data.referralCode);

                // Fetch Products (Now Sales History)
                const histRes = await axios.get('http://localhost:5001/api/dashboard/salesperson/history', {
                    headers: { 'x-auth-token': token }
                });
                setProducts(histRes.data); // Reusing 'products' state for sales list to minimize diff
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedMap({ ...copiedMap, [id]: true });
        setTimeout(() => {
            setCopiedMap(prev => ({ ...prev, [id]: false }));
        }, 2000);
    };

    const getRefLink = (path = '') => {
        const baseUrl = window.location.origin; // e.g., http://localhost:3000
        const url = new URL(baseUrl + path);
        if (referralCode) {
            url.searchParams.set('ref', referralCode);
        }
        return url.toString();
    };

    const filteredProducts = products.filter(p =>
        (p.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SalespersonLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Referral Links</h1>
                <p className="text-gray-500 mt-1">Manage and share your unique referral links to earn commissions.</p>
            </div>

            {/* Main Referral Link Card */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-10 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Your Unique Referral Code</h2>
                    <p className="text-teal-100 mb-6 max-w-xl">
                        Share this code or link with your network. When they sign up or purchase using your link, you'll earn commissions automatically.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                        <div className="flex-1 px-4 font-mono text-lg tracking-wider">
                            {getRefLink()}
                        </div>
                        <button
                            onClick={() => handleCopy(getRefLink(), 'main')}
                            className="flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-bold hover:bg-teal-50 transition-colors shadow-sm"
                        >
                            {copiedMap['main'] ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            {copiedMap['main'] ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-teal-100">
                        <span className="font-semibold bg-white/20 px-2 py-0.5 rounded">Code: {referralCode || '...'}</span>
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,59.6,29.3C49,40.1,39.1,49.4,27.7,56.7C16.3,64,3.4,69.3,-10.5,70.9C-24.4,72.5,-39.3,70.4,-51.6,63.1C-63.9,55.8,-73.6,43.3,-79.8,29.3C-86,15.3,-88.7,-0.2,-84.3,-13.7C-79.9,-27.2,-68.4,-38.7,-56.3,-47.2C-44.2,-55.7,-31.5,-61.2,-18.2,-64.7C-4.9,-68.2,9,-69.7,22.9,-71.2L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            {/* Bought Products via Link Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <LinkIcon size={20} className="text-teal-600" />
                        Bought Product via Link
                    </h3>
                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search sales..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product Name</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Commission</th>
                                <th className="px-6 py-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading history...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{sale.product?.name || 'Unknown Product'}</div>
                                            <div className="text-xs text-gray-500">Order #{sale.orderId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {sale.customerName || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-teal-600">
                                            RM {sale.commissionAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                sale.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {sale.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No bought products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalespersonLayout>
    );
};

export default MyLinksPage;
