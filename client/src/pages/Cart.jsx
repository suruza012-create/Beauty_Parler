import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, total } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Shopping Cart</h1>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100 space-y-4">
          {items.length === 0 && <p className="text-center text-slate-500 font-bold">Your cart is empty.</p>}
          {items.map(item => (
            <div key={item.productId} className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-xs text-purple-700 font-black">৳{item.price}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-rose-500 hover:text-rose-700 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="pt-4 flex items-center justify-between">
            <span className="font-bold text-slate-700">Total Price:</span>
            <span className="text-2xl font-black text-purple-700">৳{total}</span>
          </div>
          <Link to="/checkout" className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;