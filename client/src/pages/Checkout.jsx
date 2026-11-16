import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { apiGet, apiPost } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [gatewayEnabled, setGatewayEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', paymentMethod: 'cash', senderNumber: '', transactionId: '' });
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    apiGet('/content/settings')
      .then(data => setPaymentMethods((data.settings?.paymentMethods || []).filter(method => method.isActive !== false)))
      .catch(() => setPaymentMethods([]));
      apiGet('/payment/config')
        .then(data => setGatewayEnabled(Boolean(data.sslcommerzEnabled)))
        .catch(() => setGatewayEnabled(false));
  }, []);

  const selectedPaymentMethod = paymentMethods.find(method => String(method._id) === form.paymentMethod);
      const isGatewaySelected = form.paymentMethod === 'sslcommerz';

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
          setSubmitting(true);
          try {
            if (selectedPaymentMethod && !form.transactionId.trim()) {
              return setError('পেমেন্ট করার পর Transaction ID লিখুন।');
            }
            if (selectedPaymentMethod && ['bkash', 'nagad', 'rocket'].includes(selectedPaymentMethod.provider) && !form.senderNumber.trim()) {
              return setError('যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি লিখুন।');
            }
            const paymentMethod = isGatewaySelected ? 'sslcommerz' : (selectedPaymentMethod?.provider || 'cash');
            const orderResult = await apiPost('/order', { items: items.map(item => ({ productId: item.productId, quantity: item.quantity })), deliveryAddress: form.address, phone: form.phone, paymentMethod });
            if (isGatewaySelected && orderResult.order?._id) {
              const paymentResult = await apiPost('/payment/sslcommerz/initiate', { orderId: orderResult.order._id });
              window.location.assign(paymentResult.gatewayUrl);
              return;
            }
            if (selectedPaymentMethod && orderResult.order?._id) {
              await apiPost('/payment', {
                orderId: orderResult.order._id,
                amount: orderResult.order.totalAmount,
                method: paymentMethod,
                mobileNumber: form.senderNumber,
                transactionId: form.transactionId.trim()
              });
            }
            clearCart();
            setSuccess(true);
          } catch (requestError) { setError(requestError.message); }
          finally { setSubmitting(false); }
        }} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border border-purple-100">
          <h2 className="text-xl font-black text-slate-900">Delivery & Payment Details</h2>
          <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required />
          <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required />
          <textarea placeholder="Delivery Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" required></textarea>
          <div className="space-y-2">
            <label className="text-xs font-bold">Payment Method</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <label className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-2"><input type="radio" name="pay" value="cash" checked={form.paymentMethod === 'cash'} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} /> Cash on Delivery</label>
              {gatewayEnabled && (
                <label className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-2">
                  <input type="radio" name="pay" value="sslcommerz" checked={isGatewaySelected} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} />
                  Online payment (bKash, cards, bank)
                </label>
              )}
              {paymentMethods.map(method => (
                <label key={method._id} className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-2">
                  <input type="radio" name="pay" value={method._id} checked={form.paymentMethod === String(method._id)} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} />
                  {method.name}
                </label>
              ))}
            </div>
          </div>
          {selectedPaymentMethod && (
            <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
              <p className="font-bold text-slate-900">{selectedPaymentMethod.name} {selectedPaymentMethod.provider === 'bank' ? 'bank transfer' : 'payment'}: {selectedPaymentMethod.accountNumber}</p>
              {selectedPaymentMethod.accountName && <p className="text-slate-700">Account name: {selectedPaymentMethod.accountName}</p>}
              {selectedPaymentMethod.accountType && <p className="text-slate-700">Account type: {selectedPaymentMethod.accountType}</p>}
              <p className="text-xs text-slate-700">এই অ্যাকাউন্টে টাকা পাঠিয়ে Transaction ID দিন। পেমেন্ট যাচাই না হওয়া পর্যন্ত অর্ডার pending থাকবে।</p>
              {selectedPaymentMethod.provider !== 'bank' && (
                <input type="tel" placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন" value={form.senderNumber} onChange={e => setForm({ ...form, senderNumber: e.target.value })} className="w-full rounded-lg border border-rose-200 bg-white p-3 text-xs" required />
              )}
              <input type="text" placeholder="Transaction ID / Reference" value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })} className="w-full rounded-lg border border-rose-200 bg-white p-3 text-xs" required />
            </div>
          )}
          {error && <p className="text-xs font-bold text-rose-600 bg-rose-50 rounded-xl p-3">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full py-4 bg-purple-700 text-white font-black text-xs rounded-2xl shadow-lg disabled:opacity-60">{submitting ? 'Processing...' : 'Confirm Order'}</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;