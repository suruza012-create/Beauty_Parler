import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Settings as SettingsIcon, Globe, Mail, Phone, MapPin, 
  Share2, Save, Clock, DollarSign, Bell, Shield, 
  Upload, Sparkles, CheckCircle2, Building, Percent
} from 'lucide-react';

const Settings = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');

  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const [settings, setSettings] = useState({
    // General
    siteName: 'Beauty Parlour',
    tagline: 'Enhancing Your Natural Beauty',
    contactEmail: 'info@beauty.com',
    phone: '+880123456789',
    address: 'Dhaka, Bangladesh',
    
    // Business Hours
    openTime: '10:00',
    closeTime: '20:00',
    weeklyOff: 'Tuesday',
    
    // Payment & Tax
    currency: '৳ (BDT)',
    vatPercent: '5',
    advanceBookingPercent: '20',
    
    // Social
    facebook: 'https://facebook.com/beauty',
    instagram: 'https://instagram.com/beauty',
    whatsapp: '+880123456789',

    // Notifications
    emailAlerts: true,
    smsAlerts: true
  });

  useEffect(() => {
    api.get('/content/settings').then(({ data }) => {
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    }).catch(error => setSaveError(error.response?.data?.message || 'Unable to load settings'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    try {
      await api.put('/content/settings', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Unable to save settings');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Unable to change password');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-purple-50/50 to-pink-50/40 min-h-screen text-slate-800 space-y-6 font-sans max-w-7xl mx-auto">
      
      {/* ১. কালারফুল হেডার */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 z-10">
          <div className="p-3.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl shadow-lg shadow-pink-500/30">
            <SettingsIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {lang === 'bn' ? 'সিস্টেম সেটিংস' : 'System Settings'}
              </h1>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <p className="text-xs text-purple-200/80 font-medium mt-0.5">
              {lang === 'bn' ? 'পার্লারের তথ্য, কাজের সময়, পেমেন্ট ও সোশাল লিংক ম্যানেজ করুন' : 'Manage system configurations, operating hours & payment terms'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="z-10 px-4 py-2 bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            {lang === 'bn' ? 'সেটিংস সফলভাবে সেভ হয়েছে!' : 'Settings Saved Successfully!'}
          </div>
        )}
        {saveError && <p className="z-10 px-4 py-2 bg-rose-500 text-white rounded-2xl text-xs font-bold">{saveError}</p>}
      </div>

      {/* ২. ট্যাব ন্যাভিগেশন */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-100">
        {[
          { id: 'general', en: 'General Info', bn: 'সাধারণ তথ্য', icon: Building },
          { id: 'business', en: 'Business Hours', bn: 'কাজের সময়', icon: Clock },
          { id: 'payment', en: 'Payment & Tax', bn: 'পেমেন্ট ও ট্যাক্স', icon: DollarSign },
          { id: 'social', en: 'Social Links', bn: 'সোশ্যাল মিডিয়া', icon: Share2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {lang === 'bn' ? tab.bn : tab.en}
            </button>
          );
        })}
      </div>

      {/* ৩. সেটিং ফরম সেকশন */}
      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-purple-100 shadow-xl space-y-6">
        
        {/* TAB 1: GENERAL INFO */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-purple-100 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" /> {lang === 'bn' ? 'সাধারণ তথ্য ও ব্র্যান্ডিং' : 'General & Branding'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'সাইট নাম *' : 'Site Name *'}</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'ট্যাগলাইন / স্লোগান' : 'Tagline / Slogan'}</label>
                <input 
                  type="text" 
                  value={settings.tagline}
                  onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'যোগাযোগের ইমেইল *' : 'Contact Email *'}</label>
                <input 
                  type="email" 
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'ফোন নম্বর *' : 'Phone Number *'}</label>
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'ঠিকানা *' : 'Full Address *'}</label>
                <textarea 
                  rows="2"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS HOURS */}
        {activeTab === 'business' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-purple-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" /> {lang === 'bn' ? 'পার্লার খোলার সময় ও বন্ধের দিন' : 'Operating Schedule'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'খোলার সময় (Opening Time)' : 'Opening Time'}</label>
                <input 
                  type="time" 
                  value={settings.openTime}
                  onChange={(e) => setSettings({...settings, openTime: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'বন্ধের সময় (Closing Time)' : 'Closing Time'}</label>
                <input 
                  type="time" 
                  value={settings.closeTime}
                  onChange={(e) => setSettings({...settings, closeTime: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'সাপ্তাহিক বন্ধের দিন' : 'Weekly Off Day'}</label>
                <select 
                  value={settings.weeklyOff}
                  onChange={(e) => setSettings({...settings, weeklyOff: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 font-bold cursor-pointer"
                >
                  <option value="None">None (No Off Day)</option>
                  <option value="Friday">Friday (শুক্রবার)</option>
                  <option value="Sunday">Sunday (রবিবার)</option>
                  <option value="Tuesday">Tuesday (মঙ্গলবার)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & TAX */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-purple-100 pb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" /> {lang === 'bn' ? 'পেমেন্ট, ট্যাক্স ও এডভান্স রেট' : 'Payment & Pricing Terms'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'মুদ্রা (Currency Symbol)' : 'Currency Symbol'}</label>
                <input 
                  type="text" 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none font-bold text-purple-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'ভ্যাট / ট্যাক্স (%)' : 'VAT / Tax (%)'}</label>
                <input 
                  type="number" 
                  value={settings.vatPercent}
                  onChange={(e) => setSettings({...settings, vatPercent: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{lang === 'bn' ? 'বুকিং এডভান্স (%)' : 'Advance Booking (%)'}</label>
                <input 
                  type="number" 
                  value={settings.advanceBookingPercent}
                  onChange={(e) => setSettings({...settings, advanceBookingPercent: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL LINKS */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-purple-100 pb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" /> {lang === 'bn' ? 'সোশ্যাল মিডিয়া পেজ লিংক' : 'Social Media Links'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Facebook URL</label>
                <input 
                  type="text" 
                  value={settings.facebook}
                  onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instagram URL</label>
                <input 
                  type="text" 
                  value={settings.instagram}
                  onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">WhatsApp Business Number</label>
                <input 
                  type="text" 
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                  className="w-full p-3 bg-purple-50/30 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ৪. সেভ বাটন */}
        <div className="pt-4 border-t border-purple-100 flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-purple-500/30 hover:scale-105 transition-all cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" />
            {lang === 'bn' ? 'সেটিংস সেভ করুন' : 'Save Settings'}
          </button>
        </div>

      </form>

      <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xl space-y-4">
        <h2 className="font-black text-slate-900">Change Admin Password</h2>
        <input required type="password" minLength="6" placeholder="Current password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
        <input required type="password" minLength="6" placeholder="New password (minimum 6 characters)" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
        <button type="submit" className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Change Password</button>
      </form>

    </div>
  );
};

export default Settings;