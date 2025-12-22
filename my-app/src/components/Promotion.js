import React, { useState } from 'react';

const Promotions = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Frozen Gyoza (Pork)', price: '12.50', img: 'https://images.unsplash.com/photo-1563245339-6b2e5a9ad548?w=200', link: 'https://shopee.com/product1', clicks: 45 },
    { id: 2, name: 'Premium XO Sauce', price: '18.00', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200', link: 'https://lazada.com/product2', clicks: 12 }
  ]);

  const [newItem, setNewItem] = useState({ name: '', price: '', img: '', link: '' });

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, { ...newItem, id: Date.now(), clicks: 0 }]);
    setNewItem({ name: '', price: '', img: '', link: '' });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Promotion Hub</h2>
          <p className="text-slate-500 font-medium">Curate items for your customers to click and buy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form to Add New Item */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit sticky top-24">
          <h3 className="font-black text-lg text-slate-800 mb-6 uppercase tracking-widest">Add Featured SKU</h3>
          <form onSubmit={addItem} className="space-y-4">
            <input 
              placeholder="Product Name" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
            <input 
              placeholder="Marketplace Link (Shopee/Lazada)" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={newItem.link}
              onChange={(e) => setNewItem({...newItem, link: e.target.value})}
              required
            />
            <input 
              placeholder="Image URL" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={newItem.img}
              onChange={(e) => setNewItem({...newItem, img: e.target.value})}
            />
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform">
              PUBLISH TO STORE
            </button>
          </form>
        </div>

        {/* The Grid of Items */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden relative">
                <img src={item.img || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest">
                  {item.clicks} Clicks
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-black text-slate-800 text-xl mb-2">{item.name}</h4>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-indigo-600 font-black text-lg">${item.price}</span>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-2 bg-slate-900 text-white text-xs font-black rounded-xl uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                  >
                    View on Shop →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;