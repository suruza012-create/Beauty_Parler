import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Sparkles, Search, Plus, Edit2, Trash2, Eye, 
  Download, Share2, Send, Clock, Users,
  Check, Star, Zap, DollarSign, X, Tag
} from 'lucide-react';

const Offers = () => {
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');

  // Sample Offers Data
  const [offers, setOffers] = useState([]);
  const [loadError, setLoadError] = useState('');

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewOffer, setViewOffer] = useState(null);
  const [editOffer, setEditOffer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [notifyOffer, setNotifyOffer] = useState(null);
  const [broadcastStatus, setBroadcastStatus] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Combo',
    targetAudience: 'All Clients',
    originalPrice: '',
    offerPrice: '',
    startDate: '',
    endDate: '',
    servicesIncluded: '',
    bannerUrl: '',
    description: ''
  });

  // Complete Bilingual Dictionary (Form Labels & Placeholders Included)
  const t = {
    bn: {
      title: 'অফার ও প্রমোশন হাব',
      subtitle: 'আকর্ষণীয় প্যাকেজ তৈরি, ব্যানার টিউন ও অফার ক্যাম্পেইন ট্র্যাক করুন।',
      addOffer: 'নতুন অফার যুক্ত করুন',
      editOffer: 'অফার আপডেট করুন',
      searchPlaceholder: 'অফারের নাম বা সার্ভিস খুঁজুন...',
      all: 'সব অফার',
      active: 'অ্যাক্টিভ',
      expired: 'মেয়াদউত্তীর্ণ',
      totalOffers: 'মোট অফার',
      activeOffers: 'চলতি অফার',
      totalBookings: 'মোট বুকিং',
      revenue: 'অর্জিত রেভিনিউ',
      featured: 'হোমপেজ ফিচার্ড',
      share: 'শেয়ার অফার',
      notify: 'নোটিফিকেশন পাঠান',
      save: 'সংরক্ষণ করুন',
      publish: 'অফার পাবলিশ করুন',
      cancel: 'বাতিল',
      delete: 'ডিলিট',
      exportCSV: 'এক্সপোর্ট CSV',
      confirmDelete: 'অফারটি ডিলিট করতে চান?',
      noData: 'কোনো অফার পাওয়া যায়নি।',
      // Form Specific Labels & Placeholders
      offerTitleLabel: 'অফারের নাম / টাইটেল',
      offerTitlePlaceholder: 'যেমন: Monsoon Glow Combo',
      categoryLabel: 'ক্যাটাগরি',
      targetAudienceLabel: 'টার্গেট কাস্টমার',
      allClients: 'সব কাস্টমার',
      vipClients: 'ভিআইপি কাস্টমার',
      newClients: 'নতুন কাস্টমার',
      originalPriceLabel: 'মূল প্রাইস (৳)',
      offerPriceLabel: 'অফার প্রাইস (৳)',
      startDateLabel: 'শুরুর তারিখ',
      endDateLabel: 'শেষের তারিখ (End Date)',
      servicesLabel: 'অন্তর্ভুক্ত সার্ভিসসমূহ (কমা দিয়ে লিখুন)',
      servicesPlaceholder: 'যেমন: Hydra Facial, Hair Spa, Threading',
      bannerUrlLabel: 'ব্যানার ইমেজ ইউআরএল (Banner Image URL)',
      descLabel: 'বিবরণ / শর্ট সংক্ষেপ',
      descPlaceholder: 'অফারের চমৎকার বিবরণ লিখুন...',
      broadcastTitle: 'ব্রডকাস্ট নোটিফিকেশন',
      broadcastMsg: 'কাস্টমারদের কাছে প্রমোশন নোটিফিকেশন পাঠাতে চান?',
      inAppOnly: 'এটি নির্বাচিত কাস্টমারদের অ্যাপের Notification তালিকায় যাবে। SMS ও ইমেইল পাঠানো কনফিগার করা নেই।',
      broadcastSent: 'নোটিফিকেশন পাঠানো হয়েছে',
      smsBlast: 'SMS পাঠাতে চান',
      emailBlast: 'ইমেইল প্রমোশন পাঠাতে চান',
      sendNow: 'পাঠান (Send Now)',
      bookedText: 'বুকিং'
    },
    en: {
      title: 'Offers & Promotions Hub',
      subtitle: 'Create promotional bundles, manage banners, and boost client bookings.',
      addOffer: 'Add New Offer',
      editOffer: 'Edit Offer',
      searchPlaceholder: 'Search offer title or service...',
      all: 'All Offers',
      active: 'Active',
      expired: 'Expired',
      totalOffers: 'Total Offers',
      activeOffers: 'Active Offers',
      totalBookings: 'Total Bookings',
      revenue: 'Est. Revenue',
      featured: 'Homepage Featured',
      share: 'Share Offer',
      notify: 'Send Broadcast',
      save: 'Save Changes',
      publish: 'Publish Offer',
      cancel: 'Cancel',
      delete: 'Delete',
      exportCSV: 'Export CSV',
      confirmDelete: 'Are you sure you want to delete this offer?',
      noData: 'No offers found.',
      // Form Specific Labels & Placeholders
      offerTitleLabel: 'Offer Name / Title',
      offerTitlePlaceholder: 'e.g. Monsoon Glow Combo',
      categoryLabel: 'Category',
      targetAudienceLabel: 'Target Customer',
      allClients: 'All Clients',
      vipClients: 'VIP Clients Only',
      newClients: 'New Clients',
      originalPriceLabel: 'Original Price (৳)',
      offerPriceLabel: 'Offer Price (৳)',
      startDateLabel: 'Start Date',
      endDateLabel: 'End Date',
      servicesLabel: 'Included Services (Comma separated)',
      servicesPlaceholder: 'e.g. Hydra Facial, Hair Spa, Threading',
      bannerUrlLabel: 'Banner Image URL',
      descLabel: 'Description / Short Summary',
      descPlaceholder: 'Write an attractive description...',
      broadcastTitle: 'Broadcast Notification',
      broadcastMsg: 'Do you want to send promotional notification to clients?',
      inAppOnly: 'This will appear in selected clients’ in-app notification list. SMS and email delivery are not configured.',
      broadcastSent: 'Notifications sent',
      smsBlast: 'Send SMS Blast',
      emailBlast: 'Send Email Newsletter',
      sendNow: 'Send Now',
      bookedText: 'Booked'
    }
  };

  const currentT = t[lang] || t.en;

  const loadOffers = async () => {
    const { data } = await api.get('/offer/manage');
    setOffers((data.offers || []).map(offer => ({
      ...offer,
      id: offer._id || offer.id,
      originalPrice: offer.originalPrice || 0,
      offerPrice: offer.offerPrice || 0,
      startDate: offer.validFrom?.slice(0, 10),
      endDate: offer.validTo?.slice(0, 10),
      servicesIncluded: offer.servicesIncluded || offer.terms?.split(',').map(value => value.trim()).filter(Boolean) || [],
      bannerUrl: offer.image || '',
      bookingsCount: 0,
      discountPercent: offer.originalPrice ? Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100) : 0,
      status: offer.isActive === false || new Date(offer.validTo) < new Date() ? 'Expired' : 'Active'
    })));
  };

  useEffect(() => {
    loadOffers().catch(error => setLoadError(error.response?.data?.message || error.message));
  }, []);

  // Handlers
  const toggleFeatured = async (id) => {
    const offer = offers.find(item => item.id === id);
    if (!offer) return;
    try {
      await api.put(`/offer/${id}`, { isFeatured: !offer.isFeatured });
      await loadOffers();
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  const toggleStatus = async (id) => {
    const offer = offers.find(item => item.id === id);
    if (!offer) return;
    try {
      await api.put(`/offer/${id}`, { isActive: offer.isActive === false || offer.status === 'Expired' });
      await loadOffers();
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  const handleShare = (offer) => {
    const shareText = `🎉 Special Offer: ${offer.title}\nNow only ৳${offer.offerPrice} (Was ৳${offer.originalPrice})!\nBook today!`;
    navigator.clipboard.writeText(shareText);
    setCopiedId(offer.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Title,Category,OriginalPrice,OfferPrice,Bookings,Status\n'];
    const rows = offers.map(o => `${o.id},"${o.title}",${o.category},${o.originalPrice},${o.offerPrice},${o.bookingsCount},${o.status}`);
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'offers-list.csv';
    a.click();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/offer/${deleteId}`);
      setOffers(prev => prev.filter(o => o.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    setBroadcastStatus('');
    try {
      const { data } = await api.post('/notification/broadcast', {
        title: notifyOffer.title,
        message: notifyOffer.description,
        audience: notifyOffer.targetAudience,
        relatedId: notifyOffer.id
      });
      setBroadcastStatus(`${currentT.broadcastSent}: ${data.createdCount || 0}`);
      setNotifyOffer(null);
    } catch (error) {
      setBroadcastStatus(error.response?.data?.message || error.message || 'Unable to send notification');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleOpenEdit = (offer) => {
    setEditOffer(offer);
    setFormData({
      title: offer.title,
      category: offer.category,
      targetAudience: offer.targetAudience,
      originalPrice: offer.originalPrice,
      offerPrice: offer.offerPrice,
      startDate: offer.startDate,
      endDate: offer.endDate,
      servicesIncluded: offer.servicesIncluded.join(', '),
      bannerUrl: offer.bannerUrl,
      description: offer.description
    });
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const orig = Number(formData.originalPrice);
    const off = Number(formData.offerPrice);
    const servicesArr = formData.servicesIncluded ? formData.servicesIncluded.split(',').map(s => s.trim()) : ['General Service'];
    const payload = {
      title: formData.title,
      description: formData.description,
      type: 'fixed',
      discountValue: Math.max(0, orig - off),
      originalPrice: orig,
      offerPrice: off,
      category: formData.category,
      targetAudience: formData.targetAudience,
      servicesIncluded: servicesArr,
      validFrom: formData.startDate,
      validTo: formData.endDate,
      image: formData.bannerUrl,
      terms: servicesArr.join(', '),
      isActive: true
    };

    try {
    if (editOffer) {
      await api.put(`/offer/${editOffer.id}`, payload);
      setEditOffer(null);
    } else {
      await api.post('/offer', payload);
      setIsAddModalOpen(false);
    }
    await loadOffers();
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  const filteredOffers = offers.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.servicesIncluded.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'All' || o.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalBookings = offers.reduce((a, b) => a + b.bookingsCount, 0);
  const totalRev = offers.reduce((a, b) => a + (b.bookingsCount * b.offerPrice), 0);

  return (
    <div className="p-6 bg-slate-100/80 min-h-screen text-slate-800 space-y-6 font-sans">
      {loadError && <p className="text-sm font-bold text-rose-600">{loadError}</p>}
      {broadcastStatus && <p className="text-sm font-bold text-purple-700">{broadcastStatus}</p>}
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30">
              <Sparkles className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-white">{currentT.title}</h1>
          </div>
          <p className="text-xs text-purple-200/80 mt-1 font-medium">{currentT.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-bold border border-purple-500/30 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            {currentT.exportCSV}
          </button>
          <button 
            onClick={() => {
              setFormData({ title: '', category: 'Combo', targetAudience: 'All Clients', originalPrice: '', offerPrice: '', startDate: '', endDate: '', servicesIncluded: '', bannerUrl: '', description: '' });
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {currentT.addOffer}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalOffers}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{offers.length}</h3>
          </div>
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-200">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.activeOffers}</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {offers.filter(o => o.status === 'Active').length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalBookings}</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{totalBookings}</h3>
          </div>
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.revenue}</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">৳ {totalRev.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-md shadow-rose-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Combo', 'Flash Deal', 'Seasonal', 'New Client'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? currentT.all : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
          >
            <option value="All">{currentT.all}</option>
            <option value="Active">{currentT.active}</option>
            <option value="Expired">{currentT.expired}</option>
          </select>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentT.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img 
                  src={offer.bannerUrl} 
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-md tracking-wider">
                  {offer.discountPercent}% OFF
                </span>

                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-lg border border-white/20">
                  {offer.category}
                </span>

                <button
                  onClick={() => toggleFeatured(offer.id)}
                  className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all ${
                    offer.isFeatured 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Star className={`w-3 h-3 ${offer.isFeatured ? 'fill-white' : ''}`} />
                  {offer.isFeatured ? currentT.featured : 'Mark Featured'}
                </button>

                <button 
                  onClick={() => toggleStatus(offer.id)}
                  className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    offer.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                  }`}
                >
                  {offer.status === 'Active' ? currentT.active : currentT.expired}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                    {lang === 'bn' ? offer.titleBn || offer.title : offer.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {lang === 'bn' ? offer.descriptionBn || offer.description : offer.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {offer.servicesIncluded.map((serv, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
                        ✓ {serv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-purple-700">৳{offer.offerPrice}</span>
                      <span className="text-xs text-slate-400 line-through ml-2 font-semibold">৳{offer.originalPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {offer.targetAudience}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {offer.endDate}
                    </span>
                    <span className="font-bold text-slate-700">
                      {offer.bookingsCount} {currentT.bookedText}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleShare(offer)}
                      title={currentT.share}
                      className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors relative"
                    >
                      {copiedId === offer.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    <button 
                      onClick={() => setNotifyOffer(offer)}
                      title={currentT.notify}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setViewOffer(offer)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(offer)}
                      className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteId(offer.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">
            {currentT.noData}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {notifyOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">{currentT.broadcastTitle}</h3>
              </div>
              <button onClick={() => setNotifyOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {currentT.broadcastMsg} <strong>"{notifyOffer.title}"</strong>
            </p>

            <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              {currentT.inAppOnly}
            </p>
            {broadcastStatus && <p role="alert" className="text-xs font-bold text-rose-600">{broadcastStatus}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setNotifyOffer(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                {currentT.cancel}
              </button>
              <button
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 hover:bg-purple-700 disabled:opacity-60"
              >
                {isBroadcasting ? '...' : currentT.sendNow}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fully Dynamic Add / Edit Offer Modal */}
      {(isAddModalOpen || editOffer) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editOffer ? currentT.editOffer : currentT.addOffer}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditOffer(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.offerTitleLabel}</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={currentT.offerTitlePlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.categoryLabel}</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  >
                    <option value="Combo">Combo</option>
                    <option value="Flash Deal">Flash Deal</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="New Client">New Client</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.targetAudienceLabel}</label>
                  <select 
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  >
                    <option value="All Clients">{currentT.allClients}</option>
                    <option value="VIP Clients">{currentT.vipClients}</option>
                    <option value="New Clients">{currentT.newClients}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.originalPriceLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4500" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.offerPriceLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                    placeholder="2499" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.startDateLabel}</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.endDateLabel}</label>
                  <input 
                    type="date" 
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.servicesLabel}</label>
                <input 
                  type="text" 
                  value={formData.servicesIncluded}
                  onChange={(e) => setFormData({ ...formData, servicesIncluded: e.target.value })}
                  placeholder={currentT.servicesPlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.bannerUrlLabel}</label>
                <input 
                  type="url" 
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.descLabel}</label>
                <textarea 
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={currentT.descPlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditOffer(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  {currentT.cancel}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 hover:bg-purple-700"
                >
                  {editOffer ? currentT.save : currentT.publish}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{currentT.confirmDelete}</h3>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 flex-1"
              >
                {currentT.cancel}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex-1 shadow-md shadow-rose-200"
              >
                {currentT.delete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Offers;