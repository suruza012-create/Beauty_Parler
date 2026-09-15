import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const loadMessages = () => api.get('/content/contact').then(({ data }) => setMessages(data.messages || [])).catch(error => setError(error.response?.data?.message || 'Unable to load messages'));
  useEffect(() => { loadMessages(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/content/contact/${id}`, { status });
      setMessages(prev => prev.map(message => message._id === id ? { ...message, status } : message));
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update message'); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-3xl"><h1 className="text-2xl font-black flex items-center gap-2"><Mail /> Contact Messages</h1><p className="text-xs text-slate-300 mt-1">Messages submitted from the public website.</p></div>
      {error && <p className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold">{error}</p>}
      <div className="space-y-3">{messages.length === 0 && <p className="text-slate-500 text-sm">No contact messages yet.</p>}{messages.map(message => <div key={message._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-black text-slate-900">{message.name}</h2><p className="text-xs text-purple-600">{message.email}</p></div><span className="text-[10px] uppercase font-black text-slate-500">{message.status}</span></div><p className="text-sm text-slate-600 mt-3">{message.message}</p>{message.status !== 'resolved' && <button onClick={() => updateStatus(message._id, 'resolved')} className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Mark resolved</button>}</div>)}</div>
    </div>
  );
};

export default ContactMessages;
