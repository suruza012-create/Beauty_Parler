import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ShoppingBag, Heart } from 'lucide-react';
import { apiGet } from '../utils/api';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/product')
      .then(({ products = [] }) => setProducts(products.map(product => ({
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        regPrice: product.price,
        rating: product.averageRating || 0,
        category: product.category === 'Haircare' ? 'Hair Care' : product.category === 'Skincare' ? 'Skin Care' : product.category,
        image: product.image
      }))))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase">Cosmetics Store</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">Original Cosmetics Products</h1>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-lg border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {['All', 'Skin Care', 'Hair Care', 'Makeup'].map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-2xl text-xs font-bold ${category === cat ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input type="text" placeholder="Search product..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold" />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {error && <p className="text-center text-rose-600 font-bold">{error}</p>}
        {loading && <p className="text-center text-slate-500 font-bold">Loading products...</p>}
        {!loading && !error && filtered.length === 0 && <p className="text-center text-slate-500 font-bold">No products available yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{p.brand}</span>
                  <h3 className="font-bold text-slate-900 text-xs line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> {p.rating}</div>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through">৳{p.regPrice}</span>
                  <div className="text-lg font-black text-purple-700">৳{p.price}</div>
                </div>
                <Link to={`/shop/${p.id}`} className="px-3.5 py-2 bg-purple-700 text-white text-xs font-bold rounded-2xl">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;