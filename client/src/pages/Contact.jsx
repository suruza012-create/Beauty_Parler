import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { apiGet, apiPost } from '../utils/api';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    apiGet('/content/settings')
      .then(({ settings: data }) => setSettings(data))
      .catch(requestError => setSettingsError(requestError.message));
  }, []);

  const submitMessage = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      await apiPost('/content/contact', form);
      setStatus('Message sent successfully.');
      setForm({ name: '', email: '', message: '' });
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-black text-center text-slate-900">Contact Us</h1>
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-xs font-bold text-slate-700">
            {settingsError && <p className="text-rose-600">{settingsError}</p>}
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-600" /> {settings?.address}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-pink-600" /> {settings?.phone}</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-pink-600" /> {settings?.contactEmail}</p>
          </div>
          <form onSubmit={submitMessage} className="space-y-3">
            <input required type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" />
            <input required type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" />
            <textarea required placeholder="Message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" rows="3"></textarea>
            <button className="w-full py-3 bg-purple-700 text-white font-black text-xs rounded-2xl">Send Message</button>
            {status && <p className="text-xs text-emerald-600 font-bold">{status}</p>}
            {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;