import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { apiPost } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', paymentMethod: 'cash' });

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center space-y-4 max-w-md w-full">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black">Order Placed Successfully!</h2>
          <p className="text-xs text-slate-500">অর্ডারটি গ্রহণ করা হয়েছে। শিগগিরই আপনার ঠিকানায় ডেলিভারি করা হবে।</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-purple-700 text-white font-bold text-xs rounded-2xl">View Order Status</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          if (!user) return setError('Please login before placing an order.');
          if (!items.length) return setError('Your cart is empty.');
          try {
            const paymentMethod = form.paymentMethod === 'mobile' ? 'bkash' : form.paymentMethod;
            const orderResult = await apiPost('/order', { items: items.map(item => ({ productId: item.productId, quantity: item.quantity })), deliveryAddress: form.address, phone: form.phone, paymentMethod });
            if (form.paymentMethod !== 'cash' && orderResult.order?._id) {
              await apiPost('/payment', { orderId: orderResult.order._id, amount: orderResult.order.totalAmount, method: paymentMethod });
            }
            clearCart();
            setSuccess(true);
          } catch (requestError) { setError(requestError.message); }
        }} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border border-purple-100">
          <h2 className="text-xl font-black text-slate-900">Delivery & Payment Details</h2>
          <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required />
          <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required />
          <textarea placeholder="Delivery Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required></textarea>
          <div className="space-y-2">
            <label className="text-xs font-bold">Payment Method</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <label className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-2"><input type="radio" name="pay" value="cash" checked={form.paymentMethod === 'cash'} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} /> Cash on Delivery</label>
              <label className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-2"><input type="radio" name="pay" value="mobile" checked={form.paymentMethod === 'mobile'} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} /> bKash / Nagad</label>
            </div>
          </div>
          {error && <p className="text-xs font-bold text-rose-600 bg-rose-50 rounded-xl p-3">{error}</p>}
          <button type="submit" className="w-full py-4 bg-purple-700 text-white font-black text-xs rounded-2xl shadow-lg">Confirm Order</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;