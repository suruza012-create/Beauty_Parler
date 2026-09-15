import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { apiGet } from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    apiGet(`/product/${id}`).then(({ product: row }) => setProduct({
      ...row,
      id: row._id,
      regPrice: row.price,
      rating: row.averageRating || 0
    })).catch(requestError => setError(requestError.message));
  }, [id]);

  if (error) return <p className="p-10 text-center text-rose-600 font-bold">{error}</p>;
  if (!product) return <p className="p-10 text-center text-slate-500 font-bold">Loading product...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600"><ArrowLeft className="w-4 h-4" /> Back to Shop</Link>
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-2xl" />
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-pink-600 uppercase">{product.brand}</span>
              <h1 className="text-2xl font-black text-slate-900">{product.name}</h1>
              <p className="text-xs text-slate-600">{product.description}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 line-through">৳{product.regPrice}</span>
                <div className="text-2xl font-black text-purple-700">৳{product.price}</div>
              </div>
              <Link to="/cart" onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image })} className="px-6 py-3 bg-purple-700 text-white font-black text-xs rounded-2xl flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;