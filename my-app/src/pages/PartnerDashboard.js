import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PartnerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/myproducts');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setFormData({ name: '', description: '', price: '', quantity: '' });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            alert('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setFormData({ name: product.name, description: product.description, price: product.price, quantity: product.quantity });
        setEditingId(product._id);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Partner Dashboard</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input name="name" value={formData.name} placeholder="Product Name" onChange={handleChange} className="border p-2 rounded" required />
                    <input name="price" value={formData.price} type="number" placeholder="Price" onChange={handleChange} className="border p-2 rounded" required />
                    <input name="quantity" value={formData.quantity} type="number" placeholder="Quantity" onChange={handleChange} className="border p-2 rounded" required />
                    <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="border p-2 rounded col-span-2" />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-2">{editingId ? 'Update' : 'Add'} Product</button>
                </form>
            </div>

            <h2 className="text-2xl font-semibold mb-4">My Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product._id} className="border p-4 rounded bg-white shadow">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-green-600 font-bold">${product.price}</p>
                        <p>Qty: {product.quantity}</p>
                        <button onClick={() => handleEdit(product)} className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded">Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartnerDashboard;
