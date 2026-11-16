import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { apiGet } from '../utils/api';
import { useCart } from '../context/CartContext';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState('checking');
  const orderId = searchParams.get('orderId');
  const callbackStatus = searchParams.get('status');

  useEffect(() => {
    if (callbackStatus !== 'success' || !orderId) {
      setState(callbackStatus === 'review' ? 'review' : callbackStatus === 'cancelled' ? 'cancelled' : 'failed');
      return;
    }

    apiGet(`/order/${orderId}`)
      .then(({ order }) => {
        if (order?.paymentStatus === 'paid') {
          clearCart();
          setState('success');
        } else {
          setState('review');
        }
      })
      .catch(() => setState('review'));
  }, [callbackStatus, clearCart, orderId]);

  const content = {
    checking: { icon: Clock3, title: 'Checking your payment', text: 'Please wait while we confirm your order status.', color: 'text-amber-600' },
    success: { icon: CheckCircle2, title: 'Payment confirmed', text: 'Your order has been paid successfully.', color: 'text-emerald-600' },
    review: { icon: Clock3, title: 'Payment under review', text: 'Your payment needs a little extra verification. The order will update after review.', color: 'text-amber-600' },
    cancelled: { icon: XCircle, title: 'Payment cancelled', text: 'No payment was confirmed. You can try again from your cart.', color: 'text-slate-600' },
    failed: { icon: XCircle, title: 'Payment not completed', text: 'We could not confirm the payment. Your order remains unpaid.', color: 'text-rose-600' }
  }[state];
  const Icon = content.icon;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md space-y-4 border-y border-slate-200 bg-white px-6 py-10 text-center">
        <Icon className={`mx-auto h-12 w-12 ${content.color}`} />
        <h1 className="text-2xl font-black text-slate-900">{content.title}</h1>
        <p className="text-sm leading-6 text-slate-600">{content.text}</p>
        {orderId && <p className="text-xs text-slate-400">Order reference: {orderId}</p>}
        {state !== 'checking' && (
          <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
            <Link to="/dashboard" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">View orders</Link>
            {state !== 'success' && <Link to="/cart" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Return to cart</Link>}
          </div>
        )}
      </section>
    </div>
  );
};

export default PaymentResult;