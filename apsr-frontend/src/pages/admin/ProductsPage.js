import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Package, Search, Plus, ExternalLink, RefreshCw, Trash2, Filter, Wand2, Image as ImageIcon } from 'lucide-react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // New Product State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Software', // Default
        price: '',
        commissionRate: '',
        commissionType: 'percentage',
        description: '',
        imageUrl: '' // Added image URL
    });

    // AI Handlers
    const [generating, setGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        if (!formData.name) return alert('Please enter a product name first.');
        setGenerating(true);
        try {
            const res = await axios.post('http://localhost:5001/api/ai/generate-description', {
                productName: formData.name,
                category: formData.category,
                currentDescription: formData.description
            });
            setFormData(prev => ({ ...prev, description: res.data.description }));
        } catch (err) {
            console.error(err);
            alert('Failed to generate description');
        } finally {
            setGenerating(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const [imageFile, setImageFile] = useState(null);

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('commissionRate', formData.commissionRate);
        data.append('commissionType', formData.commissionType);
        data.append('description', formData.description);
        data.append('imageUrl', formData.imageUrl || ''); // Send URL if it exists
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            // Axios automatically sets Content-Type to multipart/form-data with boundary when data is FormData
            // We explicitly add the token to ensure it's present
            console.log('Sending FormData...', Object.fromEntries(data));
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/products', data, {
                headers: {
                    'x-auth-token': token
                }
            });
            setProducts([res.data, ...products]); // Add to top
            setShowModal(false);
            setFormData({ name: '', category: 'Software', price: '', commissionRate: '', commissionType: 'percentage', description: '' });
            setImageFile(null);
            alert("Product added successfully!");
        } catch (err) {
            console.error('Add Product Failed:', err);
            if (err.response) {
                console.error('Server Responded:', err.response.data);
                alert(`Failed to add product: ${err.response.data.msg || err.response.statusText}`);
            } else {
                alert('Failed to add product: Network Error');
            }
        }
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... (rest of render)

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-500 mt-1">Manage catalog and commission rules.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add Product</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                <input name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500" placeholder="e.g. CRM Gold Plan" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (MYR)</label>
                                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500 bg-white">
                                        <option>Software</option>
                                        <option>Services</option>
                                        <option>Hardware</option>
                                        <option>Digital Goods</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Commission Type</label>
                                    <select name="commissionType" value={formData.commissionType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500 bg-white">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (RM)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                                    <input type="number" name="commissionRate" required value={formData.commissionRate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500" placeholder="10" />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>

                                <div className="mb-3">
                                    <input
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500 text-sm"
                                        placeholder="Paste image URL here..."
                                    />
                                    <div className="text-center text-xs text-gray-400 my-1 font-bold">- OR -</div>
                                </div>

                                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        accept="image/*"
                                    />
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                                        <p className="text-sm text-gray-500 font-medium">{imageFile ? imageFile.name : 'Click to upload image'}</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF max 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                                    Description
                                    <button
                                        type="button"
                                        onClick={handleGenerateDescription}
                                        disabled={generating}
                                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                                    >
                                        <Wand2 size={12} /> {generating ? 'Generating...' : 'Auto-Generate'}
                                    </button>
                                </label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-teal-500" rows="3" placeholder="Brief details..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">Save Product</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Product Details</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Commission</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found.</td></tr>
                        ) : (
                            products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.category || 'General'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        RM {product.price?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-bold">
                                            {product.commissionType === 'percentage' ? `${product.commissionRate}%` : `RM ${product.commissionRate}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default ProductsPage;
