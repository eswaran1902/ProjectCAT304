import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SalespersonLayout from '../../components/layouts/SalespersonLayout';
import { Search, Copy, Check, MessageCircle, Send } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const CatalogPage = () => {
    const { user } = useContext(AuthContext); // Get current user for referral code
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getReferralLink = (productId) => {
        // Use user's referral code or ID
        const refCode = user?.referralCode || user?._id || 'unknown';
        return `http://localhost:3000/marketplace?ref=${refCode}&product=${productId}`;
    };

    const handleCopy = (id) => {
        const link = getReferralLink(id);
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleWhatsApp = (product) => {
        const link = getReferralLink(product._id);
        const text = `Check out this amazing product: ${product.name}! Buy here: ${link}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleTelegram = (product) => {
        const link = getReferralLink(product._id);
        const text = `Check out ${product.name}! ${link}`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <SalespersonLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
                <p className="text-gray-500 mt-1">Browse approved products and generate tracking links.</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg mb-8">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by product name..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-500">Loading catalog...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500">No products available.</p>
                ) : (
                    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="text-gray-400 font-bold text-2xl opacity-20">{product.category || 'Product'}</div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm z-10">
                                    RM {product.price?.toFixed(2)}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description || 'No description'}</p>
                                </div>

                                <div className="bg-teal-50 rounded-lg p-3 mb-4 flex justify-between items-center">
                                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Commission</span>
                                    <div className="text-right">
                                        <div className="font-bold text-teal-700">
                                            {product.commissionType === 'percentage' ? `${product.commissionRate}%` : `RM ${product.commissionRate}`}
                                        </div>
                                        <div className="text-[10px] text-teal-600">
                                            {product.commissionType === 'percentage'
                                                ? `~ RM ${((product.price * product.commissionRate) / 100).toFixed(2)}`
                                                : 'Flat Rate'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    <button
                                        onClick={() => handleCopy(product._id)}
                                        className={`col-span-3 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${copiedId === product._id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-900 text-white hover:bg-black'
                                            }`}
                                    >
                                        {copiedId === product._id ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedId === product._id ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <button
                                        onClick={() => handleWhatsApp(product)}
                                        className="col-span-1 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                        title="Share on WhatsApp"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleTelegram(product)}
                                        className="col-span-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                        title="Share on Telegram"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </SalespersonLayout>
    );
};

export default CatalogPage;
