import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CustomerMarketplace = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.product === product._id);
        if (existing) {
            setCart(cart.map(item => item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { product: product._id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty');

        // Calculate total
        const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        try {
            const res = await api.post('/orders', { products: cart, totalAmount });
            navigate(`/payment/${res.data._id}`);
        } catch (err) {
            alert('Order failed');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

            <div className="flex gap-8">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product._id} className="border p-4 rounded bg-white shadow">
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-600">{product.description}</p>
                            <p className="text-green-600 font-bold">${product.price}</p>
                            <p className="text-sm">Available: {product.quantity}</p>
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.quantity <= 0}
                                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-400"
                            >
                                {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="w-80 bg-white p-6 rounded shadow h-fit sticky top-4">
                    <h2 className="text-xl font-bold mb-4">Cart</h2>
                    {cart.length === 0 ? <p>Cart is empty</p> : (
                        <div>
                            {cart.map(item => (
                                <div key={item.product} className="flex justify-between mb-2 border-b pb-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t font-bold flex justify-between">
                                <span>Total:</span>
                                <span>${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full bg-green-600 text-white p-2 rounded mt-4">Place Order</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerMarketplace;
