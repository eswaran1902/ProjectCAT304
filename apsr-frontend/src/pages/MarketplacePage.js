import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Info, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const MarketplacePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { addToCart, getCartCount } = useCart();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Public endpoint
                const res = await axios.get('http://localhost:5001/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAction = (product) => {
        if (user) {
            addToCart(product);
            // Optional: Show toast or feedback
        } else {
            setIsAuthModalOpen(true);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                                APSR Market
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                                <ShoppingCart className="text-gray-600 hover:text-indigo-600 transition-colors" size={24} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                        {getCartCount()}
                                    </span>
                                )}
                            </div>
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm" title={user.name}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header / Search */}
            <div className="bg-white border-b border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Discover Premium Products
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                        Explore our curated marketplace of high-quality digital and physical goods.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none shadow-sm transition-all text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-5 top-5 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading marketplace...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col h-full">
                                {/* Image Placeholder */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden group-hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                                        {product.category ? (
                                            <span className="font-bold text-3xl uppercase tracking-widest opacity-20">{product.category}</span>
                                        ) : (
                                            <TrendingUp size={48} className="opacity-20" />
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
                                        RM {product.price?.toFixed(2)}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4 flex-1">
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">
                                            {product.category || 'General'}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {product.description || 'No description available for this product.'}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 mt-auto">
                                        <button
                                            onClick={() => handleAction(product)}
                                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default MarketplacePage;
