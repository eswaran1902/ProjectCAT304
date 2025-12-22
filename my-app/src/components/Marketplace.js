import React, { useState } from 'react';

const Marketplace = () => {
  // These represent the "Predictive SKUs" suggested by AI in your outline
  const [products] = useState([
    { id: 1, name: 'Handmade Frozen Gyoza', price: 12.50, category: 'Frozen', img: 'https://images.unsplash.com/photo-1563245339-6b2e5a9ad548?w=400', tag: 'High Margin' },
    { id: 2, name: 'Premium XO Chili Sauce', price: 18.00, category: 'Condiments', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', tag: 'Top Seller' },
    { id: 3, name: 'Traditional Fish Balls', price: 8.50, category: 'Frozen', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', tag: 'Low Refund' },
    { id: 4, name: 'Signature Mantou Buns', price: 6.00, category: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', tag: 'New' },
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - The starting point for Lead Generation */}
      <div className="bg-slate-900 py-24 px-6 text-center text-white">
        <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">Marketplace</h1>
        <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
          Authorized F&B Warehouse Distribution. Every purchase supports our local partner network.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Current Inventory</h2>
            <p className="text-slate-500 font-medium">Real-time availability from the warehouse.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-colors">Filter</button>
            <button className="px-6 py-3 bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-colors">Sort</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                  {product.tag}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-800 leading-tight">{product.name}</h3>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{product.category}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-6 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                  View Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="py-24 border-t border-slate-100 text-center">
        <div className="text-xl font-black text-slate-900 tracking-tighter mb-4">SYSTEM<span className="text-indigo-600">OS</span></div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Immutable Audit Trail Active</p>
      </footer>
    </div>
  );
};

export default Marketplace;