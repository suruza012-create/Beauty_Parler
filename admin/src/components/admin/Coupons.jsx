import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Ticket, Search, Plus, Edit2, Trash2, Eye, 
  Copy, Check, Percent, Tag, Calendar, Users, 
  X, CheckCircle2, AlertCircle, Sparkles, Download
} from 'lucide-react';

const Coupons = () => {
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');

  // Sample Coupons Data
  const [coupons, setCoupons] = useState([]);
  const [loadError, setLoadError] = useState('');

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);
  const [viewCoupon, setViewCoupon] = useState(null);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: '',
    minSpend: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: '',
    description: ''
  });

  // Complete Bilingual Dictionary
  const t = {
    bn: {
      title: 'কুপন ও ভাউচার ম্যানেজমেন্ট',
      subtitle: 'প্রমোশনাল কুপন কোড তৈরি করুন এবং ইউজেস ট্র্যাক করুন।',
      addCoupon: 'নতুন কুপন যুক্ত করুন',
      editCoupon: 'কুপন আপডেট করুন',
      searchPlaceholder: 'কুপন কোড দিয়ে খুঁজুন...',
      all: 'সব কুপন',
      active: 'অ্যাক্টিভ',
      expired: 'মেয়াদউত্তীর্ণ',
      totalCoupons: 'মোট কুপন',
      activeCoupons: 'চলতি কুপন',
      totalRedeemed: 'মোট রিডিম করা কুপন',
      save: 'সংরক্ষণ করুন',
      publish: 'কুপন তৈরি করুন',
      cancel: 'বাতিল',
      delete: 'ডিলিট',
      exportCSV: 'এক্সপোর্ট CSV',
      confirmDelete: 'কুপনটি ডিলিট করতে চান?',
      noData: 'কোনো কুপন পাওয়া যায়নি।',
      codeLabel: 'কুপন কোড',
      codePlaceholder: 'যেমন: SAVE20',
      generateCode: 'অটো জেনারেট',
      typeLabel: 'ডিসকাউন্টের ধরন',
      percentage: 'পার্সেন্টেজ (%)',
      fixed: 'ফ্ল্যাট টাকা (৳)',
      valueLabel: 'ডিসকাউন্টের পরিমাণ',
      minSpendLabel: 'সর্বনিম্ন খরচ (৳)',
      maxDiscountLabel: 'সর্বোচ্চ ছাড় (৳)',
      expiryLabel: 'মেয়াদ শেষের তারিখ',
      limitLabel: 'মোট ইউজেস লিমিট (জন)',
      descLabel: 'কুপনের সংক্ষিপ্ত বিবরণ',
      descPlaceholder: 'কুপনের শর্তাবলী ও বিবরণ লিখুন...',
      usedText: 'ব্যবহার করা হয়েছে',
      copyCode: 'কোড কপি করুন'
    },
    en: {
      title: 'Coupons & Vouchers',
      subtitle: 'Create promotional coupon codes and track their redemptions.',
      addCoupon: 'Add New Coupon',
      editCoupon: 'Edit Coupon',
      searchPlaceholder: 'Search coupon code...',
      all: 'All Coupons',
      active: 'Active',
      expired: 'Expired',
      totalCoupons: 'Total Coupons',
      activeCoupons: 'Active Coupons',
      totalRedeemed: 'Total Redeemed',
      save: 'Save Changes',
      publish: 'Create Coupon',
      cancel: 'Cancel',
      delete: 'Delete',
      exportCSV: 'Export CSV',
      confirmDelete: 'Are you sure you want to delete this coupon?',
      noData: 'No coupons found.',
      codeLabel: 'Coupon Code',
      codePlaceholder: 'e.g. SAVE20',
      generateCode: 'Auto Generate',
      typeLabel: 'Discount Type',
      percentage: 'Percentage (%)',
      fixed: 'Fixed Amount (৳)',
      valueLabel: 'Discount Value',
      minSpendLabel: 'Minimum Spend (৳)',
      maxDiscountLabel: 'Maximum Discount (৳)',
      expiryLabel: 'Expiry Date',
      limitLabel: 'Total Usage Limit (People)',
      descLabel: 'Coupon Description',
      descPlaceholder: 'Write terms and conditions...',
      usedText: 'Used',
      copyCode: 'Copy Code'
    }
  };

  const currentT = t[lang] || t.en;

  const loadCoupons = async () => {
    const { data } = await api.get('/coupon/manage');
    setCoupons((data.coupons || []).map(coupon => ({
      ...coupon,
      id: coupon._id || coupon.id,
      minSpend: coupon.minOrder,
      expiryDate: coupon.validTo?.slice(0, 10),
      status: coupon.isActive === false || new Date(coupon.validTo) < new Date() ? 'Expired' : 'Active',
      discountType: coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed'
    })));
  };

  useEffect(() => {
    loadCoupons().catch(error => setLoadError(error.response?.data?.message || error.message));
  }, []);

  // Handlers
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateAutoCode = () => {
    const random = 'PROMO' + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, code: random }));
  };

  const handleExportCSV = () => {
    const headers = ['ID,Code,Type,Value,MinSpend,Expiry,Status\n'];
    const rows = coupons.map(c => `${c.id},"${c.code}",${c.discountType},${c.discountValue},${c.minSpend},${c.expiryDate},${c.status}`);
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coupons-list.csv';
    a.click();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/coupon/${deleteId}`);
      setCoupons(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  const handleOpenEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minSpend: coupon.minSpend,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      description: coupon.description
    });
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType.toLowerCase(),
      discountValue: Number(formData.discountValue),
      minOrder: Number(formData.minSpend),
      maxDiscount: Number(formData.maxDiscount || formData.discountValue),
      validFrom: new Date().toISOString(),
      validTo: formData.expiryDate,
      usageLimit: Number(formData.usageLimit),
      description: formData.description,
      isActive: true
    };
    try {
    if (editCoupon) {
      await api.put(`/coupon/${editCoupon.id}`, payload);
      setEditCoupon(null);
    } else {
      await api.post('/coupon', payload);
      setIsAddModalOpen(false);
    }
    await loadCoupons();
    setLoadError('');
    } catch (error) {
      console.error('Coupon save failed:', error);
    }
  };

  const filteredCoupons = coupons.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const totalUsed = coupons.reduce((a, b) => a + b.usedCount, 0);

  return (
    <div className="p-6 bg-slate-100/80 min-h-screen text-slate-800 space-y-6 font-sans">
      {loadError && <p className="text-sm font-bold text-rose-600">{loadError}</p>}
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
              <Ticket className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-white">{currentT.title}</h1>
          </div>
          <p className="text-xs text-indigo-200/80 mt-1 font-medium">{currentT.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold border border-indigo-500/30 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            {currentT.exportCSV}
          </button>
          <button 
            onClick={() => {
              setFormData({ code: '', discountType: 'Percentage', discountValue: '', minSpend: '', maxDiscount: '', expiryDate: '', usageLimit: '', description: '' });
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {currentT.addCoupon}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalCoupons}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{coupons.length}</h3>
          </div>
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-200">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.activeCoupons}</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {coupons.filter(c => c.status === 'Active').length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalRedeemed}</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{totalUsed}</h3>
          </div>
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-200">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentT.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
        >
          <option value="All">{currentT.all}</option>
          <option value="Active">{currentT.active}</option>
          <option value="Expired">{currentT.expired}</option>
        </select>
      </div>

      {/* Coupons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Top Row: Code & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl tracking-wider">
                    {coupon.code}
                  </span>
                  <button 
                    onClick={() => handleCopy(coupon.code)}
                    title={currentT.copyCode}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {copiedCode === coupon.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {coupon.status === 'Active' ? currentT.active : currentT.expired}
                </span>
              </div>

              {/* Offer Details */}
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {coupon.discountType === 'Percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {lang === 'bn' ? coupon.descriptionBn || coupon.description : coupon.description}
                </p>
              </div>

              {/* Progress & Validity */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-600 text-[11px]">
                  <span>{currentT.usedText}: {coupon.usedCount} / {coupon.usageLimit}</span>
                  <span>{Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {coupon.expiryDate}
                  </span>
                  <span>Min: ৳{coupon.minSpend}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-1 border-t border-slate-100">
                <button 
                  onClick={() => setViewCoupon(coupon)}
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleOpenEdit(coupon)}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeleteId(coupon.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">
            {currentT.noData}
          </div>
        )}
      </div>

      {/* View Coupon Modal */}
      {viewCoupon && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">{viewCoupon.code}</h3>
              <button onClick={() => setViewCoupon(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-semibold">
                {lang === 'bn' ? viewCoupon.descriptionBn || viewCoupon.description : viewCoupon.description}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">{currentT.typeLabel}</span>
                  <span className="font-bold text-slate-800">{viewCoupon.discountType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">{currentT.valueLabel}</span>
                  <span className="font-bold text-indigo-600 text-sm">
                    {viewCoupon.discountType === 'Percentage' ? `${viewCoupon.discountValue}%` : `৳${viewCoupon.discountValue}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">{currentT.minSpendLabel}</span>
                  <span className="font-bold text-slate-800">৳{viewCoupon.minSpend}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">{currentT.maxDiscountLabel}</span>
                  <span className="font-bold text-slate-800">৳{viewCoupon.maxDiscount}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setViewCoupon(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              {currentT.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {(isAddModalOpen || editCoupon) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editCoupon ? currentT.editCoupon : currentT.addCoupon}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditCoupon(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">{currentT.codeLabel}</label>
                  <button 
                    type="button" 
                    onClick={generateAutoCode}
                    className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {currentT.generateCode}
                  </button>
                </div>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder={currentT.codePlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.typeLabel}</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Percentage">{currentT.percentage}</option>
                    <option value="Fixed">{currentT.fixed}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.valueLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="20" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.minSpendLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    placeholder="1000" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.maxDiscountLabel}</label>
                  <input 
                    type="number" 
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="500" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.expiryLabel}</label>
                  <input 
                    type="date" 
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.limitLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100" 
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.descLabel}</label>
                <textarea 
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={currentT.descPlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditCoupon(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  {currentT.cancel}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700"
                >
                  {editCoupon ? currentT.save : currentT.publish}
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

export default Coupons;