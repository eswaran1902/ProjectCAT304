import React from 'react';

const Marketplace = ({ products }) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 py-24 px-6 text-center text-white">
        <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase italic">Marketplace</h1>
        <p className="text-slate-400 text-lg font-medium italic">Warehouse Fresh Inventory</p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">The warehouse is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img src={product.img || 'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase">
                    {product.tag}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight flex-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-4 pt-6 border-t border-slate-50">
                  <span className="text-2xl font-black text-slate-900">RM{Number(product.price).toFixed(2)}</span>
                  <a href={product.link} target="_blank" rel="noreferrer" className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black hover:bg-indigo-600 transition-all text-center">
                    VIEW ITEM
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;