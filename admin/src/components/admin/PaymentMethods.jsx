import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CreditCard, Plus, Save, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const emptyMethod = () => ({
  provider: 'bkash',
  name: 'bKash',
  accountName: '',
  accountNumber: '',
  accountType: 'Personal',
  isActive: true
});

const providerNames = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  bank: 'Bank'
};

const PaymentMethods = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/content/settings')
      .then(({ data }) => setMethods(data.settings?.paymentMethods || []))
      .catch(requestError => setError(requestError.response?.data?.message || 'Unable to load payment accounts'))
      .finally(() => setLoading(false));
  }, []);

  const updateMethod = (index, field, value) => {
    setMethods(current => current.map((method, methodIndex) => (
      methodIndex === index ? { ...method, [field]: value } : method
    )));
    setMessage('');
  };

  const addMethod = () => {
    setMethods(current => [...current, emptyMethod()]);
    setMessage('');
  };

  const saveMethods = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put('/content/settings', {
        paymentMethods: methods.map(({ provider, name, accountName, accountNumber, accountType, isActive }) => ({
          provider,
          name: name.trim(),
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          accountType: accountType.trim(),
          isActive
        }))
      });
      setMethods(data.settings?.paymentMethods || []);
      setMessage(lang === 'bn' ? 'পেমেন্ট অ্যাকাউন্ট সংরক্ষণ হয়েছে' : 'Payment accounts saved');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save payment accounts');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <CreditCard className="h-5 w-5 text-rose-600" />
            {lang === 'bn' ? 'পেমেন্ট অ্যাকাউন্ট' : 'Payment Accounts'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {lang === 'bn' ? 'গ্রাহকের checkout-এ দেখানোর নম্বর ও ব্যাংক তথ্য পরিচালনা করুন।' : 'Manage the account details shown to customers at checkout.'}
          </p>
        </div>
        <button type="button" onClick={addMethod} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
          <Plus className="h-4 w-4" />
          {lang === 'bn' ? 'অ্যাকাউন্ট যোগ করুন' : 'Add account'}
        </button>
      </header>

      {message && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</p>}
      {error && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

      {loading ? (
        <p className="py-8 text-sm text-slate-500">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading payment accounts...'}</p>
      ) : (
        <form onSubmit={saveMethods} className="space-y-4">
          {methods.map((method, index) => (
            <section key={method._id || `new-${index}`} className="space-y-4 border-b border-slate-200 py-5 last:border-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  {lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment method'}
                  <select value={method.provider} onChange={event => updateMethod(index, 'provider', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                    {Object.entries(providerNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  {method.provider === 'bank' ? (lang === 'bn' ? 'ব্যাংকের নাম' : 'Bank name') : (lang === 'bn' ? 'প্রদর্শিত নাম' : 'Display name')}
                  <input required value={method.name || ''} onChange={event => updateMethod(index, 'name', event.target.value)} placeholder={providerNames[method.provider]} className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  {lang === 'bn' ? 'যার নামে অ্যাকাউন্ট' : 'Account holder name'}
                  <input value={method.accountName || ''} onChange={event => updateMethod(index, 'accountName', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  {lang === 'bn' ? 'যে নম্বরে/অ্যাকাউন্টে টাকা নেবেন' : 'Receiving number / account'}
                  <input required value={method.accountNumber || ''} onChange={event => updateMethod(index, 'accountNumber', event.target.value)} inputMode="text" className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  {lang === 'bn' ? 'অ্যাকাউন্টের ধরন' : 'Account type'}
                  <input value={method.accountType || ''} onChange={event => updateMethod(index, 'accountType', event.target.value)} placeholder={method.provider === 'bank' ? 'Savings / Current' : 'Personal / Merchant'} className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                </label>
                <div className="flex items-end justify-between gap-4">
                  <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={method.isActive !== false} onChange={event => updateMethod(index, 'isActive', event.target.checked)} className="h-4 w-4 accent-rose-600" />
                    {lang === 'bn' ? 'Checkout-এ দেখান' : 'Show at checkout'}
                  </label>
                  <button type="button" onClick={() => setMethods(current => current.filter((_, methodIndex) => methodIndex !== index))} aria-label={lang === 'bn' ? 'অ্যাকাউন্ট মুছুন' : 'Remove account'} title={lang === 'bn' ? 'অ্যাকাউন্ট মুছুন' : 'Remove account'} className="mb-1 rounded-lg p-2 text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          ))}

          {!methods.length && <p className="border-b border-slate-200 py-8 text-sm text-slate-500">{lang === 'bn' ? 'এখনও কোনো পেমেন্ট অ্যাকাউন্ট যোগ করা হয়নি।' : 'No payment accounts have been added.'}</p>}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-4 w-4" />
              {saving ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save accounts')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentMethods;