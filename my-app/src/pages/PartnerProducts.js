import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PartnerProducts = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '', category: 'General' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products/myproducts');
            setProducts(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        }
        setLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setFormData({ name: '', description: '', price: '', quantity: '', category: 'General' });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.msg || 'Error saving product');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category || 'General'
        });
        setEditingId(product._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            setError('Error deleting product');
        }
    };

    const handleCancelInfo = () => {
        setFormData({ name: '', description: '', price: '', quantity: '', category: 'General' });
        setEditingId(null);
    };

    return (
        <div>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="flex gap-8">
                {/* Form Section */}
                <div className="w-1/3">
                    <div className="bg-white p-6 rounded shadow sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                    <input name="price" value={formData.price} type="number" onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Qty</label>
                                    <input name="quantity" value={formData.quantity} type="number" onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="General">General</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Services">Services</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows="3" />
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                                    {editingId ? 'Update' : 'Add'} Product
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancelInfo} className="bg-gray-300 text-gray-700 px-4 rounded hover:bg-gray-400 transition">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="w-2/3">
                    <h2 className="text-xl font-semibold mb-4">Product List ({products.length})</h2>
                    {loading ? <p>Loading...</p> : (
                        <div className="grid grid-cols-1 gap-4">
                            {products.map(product => (
                                <div key={product._id} className="border p-4 rounded bg-white shadow flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-green-600 font-bold">${product.price}</span>
                                            <span className="text-gray-600">Stock: {product.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleEdit(product)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && <p className="text-gray-500 italic">No products found. Start adding some!</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerProducts;
