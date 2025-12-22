import React, { useState } from 'react';

const Promotions = ({ products, setProducts, deleteProduct }) => {
  const [newItem, setNewItem] = useState({ name: '', price: '', img: '', link: '', category: 'Frozen' });

  const addItem = (e) => {
    e.preventDefault();
    const productToAdd = { 
      ...newItem, 
      id: Date.now(), 
      clicks: 0, 
      tag: 'New', 
      price: parseFloat(newItem.price || 0) 
    };
    setProducts([...products, productToAdd]);
    setNewItem({ name: '', price: '', img: '', link: '', category: 'Frozen' });
    alert("Item Published!");
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase italic tracking-tight">Promotions Hub</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <h3 className="font-black text-lg mb-6 uppercase tracking-widest text-slate-800">Add SKU</h3>
          <form onSubmit={addItem} className="space-y-4">
            <input placeholder="Product Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" 
                   value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
            <input placeholder="Price" type="number" step="0.01" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" 
                   value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
            <input placeholder="Marketplace Link" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" 
                   value={newItem.link} onChange={(e) => setNewItem({...newItem, link: e.target.value})} required />
            <input placeholder="Image URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" 
                   value={newItem.img} onChange={(e) => setNewItem({...newItem, img: e.target.value})} />
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">PUBLISH TO MARKET</button>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col group relative transition-all hover:shadow-xl">
              {/* DELETE BUTTON: Appears on hover */}
              <button 
                onClick={() => deleteProduct(item.id)}
                className="absolute top-4 right-4 z-10 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                ×
              </button>

              <img src={item.img || 'https://via.placeholder.com/200'} alt="" className="h-40 w-full object-cover" />
              <div className="p-6">
                <h4 className="font-black text-slate-800 text-xl">{item.name}</h4>
                <p className="text-indigo-600 font-black mt-2">RM{Number(item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;