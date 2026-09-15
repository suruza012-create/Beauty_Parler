import React from 'react';
import { X, Star, ShoppingBag } from 'lucide-react';

const QuickViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4 items-center">
          <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-2xl" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-pink-600 uppercase">{product.category || 'Cosmetic'}</span>
            <h3 className="text-base font-black text-slate-900">{product.name}</h3>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" /> {product.rating || '4.9'}
            </div>
            <div className="text-lg font-black text-purple-700">৳{product.price}</div>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {product.description || 'প্রিমিয়াম কোয়ালিটির আসল প্রোডাক্ট যা আপনাকে দিবে নিখুঁত বিউটি কেয়ারের নিশ্চয়তা।'}
        </p>

        <button 
          onClick={onClose} 
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Close View
        </button>
      </div>
    </div>
  );
};

export default QuickViewModal;