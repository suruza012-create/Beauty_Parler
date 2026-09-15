import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { apiGet, apiPost } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const preSelectedService = location.state?.service || '';

  const [formData, setFormData] = useState({
    service: preSelectedService || 'Bridal Glow Facial & Spa',
    date: location.state?.date || '',
    time: '11:00 AM',
    name: '',
    phone: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGet('/service').then(({ services: rows = [] }) => {
      setServices(rows);
      if (!preSelectedService && rows[0]) {
        setFormData(prev => ({ ...prev, service: rows[0].name }));
      }
    }).catch(err => setError(err.message));
  }, [preSelectedService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('Please login before booking an appointment.');
      return;
    }
    const selectedService = services.find(service => service.name === formData.service);
    if (!selectedService) {
      setError('Please select an available service.');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/booking', {
        serviceId: selectedService._id,
        bookingDate: formData.date,
        bookingTime: formData.time,
        note: `${formData.name} | ${formData.phone} | ${formData.notes}`
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Booking Confirmed!</h2>
          <p className="text-xs text-slate-500 font-medium">
            ধন্যবাদ **{formData.name}**! আপনার বুকিং সফল হয়েছে। আমরা শীঘ্রই কল করে কনফার্ম করব।
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-purple-700 text-white font-black text-xs rounded-2xl shadow-md hover:bg-purple-800 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-purple-100 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">Appointment</span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Book Your Parlour Slot</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Service</label>
              <select 
                value={formData.service} 
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600"
                required
              >
                {services.map(service => <option key={service._id} value={service.name}>{service.name} (৳{service.price})</option>)}
              </select>
            </div>

            {error && <p className="text-xs font-bold text-rose-600 bg-rose-50 rounded-xl p-3">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                <select 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600"
                >
                  <option>10:00 AM</option>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:30 PM</option>
                  <option>06:30 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Special Notes (Optional)</label>
              <textarea 
                rows="3" 
                placeholder="Any special preferences or requests..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              {loading ? 'Saving Booking...' : 'Confirm Appointment Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;