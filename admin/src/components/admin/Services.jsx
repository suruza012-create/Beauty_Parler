import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Scissors, Search, Plus, Edit2, Trash2, Eye, 
  Download, Star, Clock, Layers, DollarSign, X, CheckCircle2, Sparkles 
} from 'lucide-react';

const Services = () => {
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');

  const [services, setServices] = useState([]);
  const [loadError, setLoadError] = useState('');

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewService, setViewService] = useState(null);
  const [editService, setEditService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makeup',
    duration: '60 min',
    price: '',
    originalPrice: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200'
  });
  const [imageFile, setImageFile] = useState(null);

  // Multilingual Categories List
  const categoriesList = [
    { id: 'All', en: 'All', bn: 'সব ক্যাটাগরি' },
    { id: 'Makeup', en: 'Makeup', bn: 'মেকআপ' },
    { id: 'Bridal', en: 'Bridal', bn: 'ব্রাইডাল' },
    { id: 'Hair Care', en: 'Hair Care', bn: 'হেয়ার কেয়ার' },
    { id: 'Skin Care', en: 'Skin Care', bn: 'স্কিন কেয়ার' }
  ];

  // Language Dictionary (With Dynamic Form Fields)
  const t = {
    bn: {
      title: 'সার্ভিস তালিকা ও মূল্য',
      subtitle: 'পার্লারের সব সার্ভিস, ডিসকাউন্ট, টাইম এবং বিউটিশিয়ান অ্যাসাইনমেন্ট নিয়ন্ত্রণ করুন।',
      addService: 'নতুন সার্ভিস যোগ করুন',
      editService: 'সার্ভিস এডিট করুন',
      searchPlaceholder: 'সার্ভিসের নাম বা ক্যাটাগরি খুঁজুন...',
      totalServices: 'মোট সার্ভিস',
      activeServices: 'অ্যাক্টিভ সার্ভিস',
      topRated: 'সেরা রেটেড সার্ভিস',
      avgPrice: 'গড় প্রাইস',
      serviceName: 'সার্ভিস ও বিবরণ',
      category: 'ক্যাটাগরি',
      duration: 'সময়কাল',
      price: 'মূল্য (৳)',
      staff: 'বিউটিশিয়ান',
      rating: 'রেটিং',
      status: 'স্ট্যাটাস',
      actions: 'অ্যাকশন',
      exportCSV: 'এক্সপোর্ট CSV',
      homeServiceBadge: 'হোম সার্ভিস',
      itemsText: 'টি সার্ভিস',
      activeText: 'টি সক্রিয়',
      confirmDeleteTitle: 'সার্ভিসটি ডিলিট করতে চান?',
      confirmDeleteSub: 'ডিলিট করলে এই সার্ভিসের তথ্য পুনরুদ্ধার করা যাবে না।',
      cancel: 'বাতিল',
      delete: 'ডিলিট করুন',
      save: 'সংরক্ষণ করুন',
      add: 'যোগ করুন',
      noData: 'কোনো সার্ভিস পাওয়া যায়নি।',
      // Form Specific Translations
      serviceNameLabel: 'সার্ভিসের নাম',
      serviceNamePlaceholder: 'যেমন: Bridal Makeup',
      categoryLabel: 'ক্যাটাগরি',
      durationLabel: 'সময়কাল',
      durationPlaceholder: 'যেমন: 60 min',
      offerPriceLabel: 'অফার প্রাইজ (৳)',
      originalPriceLabel: 'মূল প্রাইজ (৳)',
      descriptionLabel: 'সার্ভিস বিবরণ',
      descriptionPlaceholder: 'সার্ভিসের বিস্তারিত বিবরণ লিখুন...'
    },
    en: {
      title: 'Services & Pricing Catalog',
      subtitle: 'Manage all parlor services, pricing, discounts, duration and assigned staff.',
      addService: 'Add New Service',
      editService: 'Edit Service',
      searchPlaceholder: 'Search service or category...',
      totalServices: 'Total Services',
      activeServices: 'Active Services',
      topRated: 'Top Rated Service',
      avgPrice: 'Avg Price',
      serviceName: 'Service Name',
      category: 'Category',
      duration: 'Duration',
      price: 'Price (৳)',
      staff: 'Assigned Staff',
      rating: 'Rating',
      status: 'Status',
      actions: 'Actions',
      exportCSV: 'Export CSV',
      homeServiceBadge: 'Home Service',
      itemsText: 'Items',
      activeText: 'Active',
      confirmDeleteTitle: 'Delete this service?',
      confirmDeleteSub: 'Once deleted, this service data cannot be recovered.',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save Changes',
      add: 'Add Service',
      noData: 'No services found.',
      // Form Specific Translations
      serviceNameLabel: 'Service Name',
      serviceNamePlaceholder: 'e.g. Bridal Makeup',
      categoryLabel: 'Category',
      durationLabel: 'Duration',
      durationPlaceholder: 'e.g. 60 min',
      offerPriceLabel: 'Offer Price (৳)',
      originalPriceLabel: 'Original Price (৳)',
      descriptionLabel: 'Service Description',
      descriptionPlaceholder: 'Write detailed service description...'
    }
  };

  const currentT = t[lang] || t.en;

  const loadServices = async () => {
    const response = await api.get('/service/manage');
    const rows = response.data?.services || [];
    setServices(rows.map(item => ({
      ...item,
      id: item._id || item.id,
      category: item.category === 'Hair' ? 'Hair Care' : item.category === 'Skin' ? 'Skin Care' : item.category,
      status: item.isAvailable === false ? 'Inactive' : 'Active',
      originalPrice: item.discount && item.discount < 100 ? Math.round(item.price / (1 - item.discount / 100)) : item.price,
      rating: item.averageRating || 0,
      reviewsCount: item.totalReviews || 0,
      assignedStaff: Array.isArray(item.assignedStaff) ? item.assignedStaff : [],
      discount: item.discount ? `${item.discount}% OFF` : ''
    })));
  };

  useEffect(() => {
    loadServices().catch(error => setLoadError(error.response?.data?.message || error.message));
  }, []);

  // Toggle Active/Inactive Status
  const toggleStatus = async (id) => {
    const service = services.find(item => item.id === id);
    if (!service) return;
    try {
      await api.put(`/service/${id}`, { isAvailable: service.status !== 'Active' });
      await loadServices();
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = ['ID,Name,Category,Price,Duration,Status\n'];
    const rows = services.map(s => `${s.id},"${s.name}","${s.category}",${s.price},"${s.duration}",${s.status}`);
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'services-list.csv';
    a.click();
  };

  // Delete Service Functionality
  const handleDelete = async () => {
    try {
      await api.delete(`/service/${deleteServiceId}`);
      setServices(prev => prev.filter(s => s.id !== deleteServiceId));
      setDeleteServiceId(null);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (service) => {
    setEditService(service);
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      originalPrice: service.originalPrice || service.price,
      description: service.description,
      image: service.image
    });
  };

  // Save Add/Edit
  const handleSaveForm = async (e) => {
    e.preventDefault();
    const categoryMap = {
      'Hair Care': 'Hair',
      'Skin Care': 'Skin',
      Makeup: 'Makeup',
      Bridal: 'Bridal'
    };
    const price = Number(formData.price);
    const originalPrice = Number(formData.originalPrice || formData.price);
    const payload = {
        name: formData.name,
        category: categoryMap[formData.category] || 'Other',
        duration: formData.duration,
        price,
        discount: originalPrice > price ? Math.min(99, Math.round((1 - price / originalPrice) * 100)) : 0,
        description: formData.description,
        image: formData.image?.trim() || 'default-service.jpg',
        isAvailable: true
      };
    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadResponse = await api.post('/upload', uploadData);
        payload.image = uploadResponse.data.url;
      }
      if (editService) {
        await api.put(`/service/${editService.id}`, payload);
        setEditService(null);
      } else {
        await api.post('/service', payload);
        setIsAddModalOpen(false);
      }
      await loadServices();
      setImageFile(null);
    } catch (error) {
      const message = error.response?.data?.message || (lang === 'bn' ? 'সার্ভিস সংরক্ষণ ব্যর্থ হয়েছে' : 'Service save failed');
      console.error('Service save failed:', error);
      showToast(message);
    }
  };

  // Filter Services Logic
  const filteredServices = services.filter(service => {
    const nameMatch = (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (service.nameBn || '').toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = selectedCategory === 'All' || service.category === selectedCategory;
    return nameMatch && catMatch;
  });

  return (
    <div className="p-6 bg-slate-100/80 min-h-screen text-slate-800 space-y-6 font-sans">
    {loadError && <p className="text-sm font-bold text-rose-600">{loadError}</p>}
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30">
              <Scissors className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-white">{currentT.title}</h1>
          </div>
          <p className="text-xs text-rose-200/80 mt-1 font-medium">{currentT.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            {currentT.exportCSV}
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', category: 'Makeup', duration: '60 min', price: '', originalPrice: '', description: '', image: '' });
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {currentT.addService}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalServices}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {services.length} {currentT.itemsText}
            </h3>
          </div>
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-200">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.activeServices}</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {services.filter(s => s.status === 'Active').length} {currentT.activeText}
            </h3>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.topRated}</p>
            <h3 className="text-base font-black text-slate-900 mt-1 flex items-center gap-1">
              {lang === 'bn' ? 'ব্রাইডাল গ্লো' : 'Bridal Glow'} <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" /> 5.0
            </h3>
          </div>
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-200">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.avgPrice}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">৳ ৪,৩২৫</h3>
          </div>
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-md shadow-rose-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Multilingual Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentT.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Services Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 min-w-[230px]">{currentT.serviceName}</th>
                <th className="p-4 min-w-[120px]">{currentT.category}</th>
                <th className="p-4 min-w-[110px]">{currentT.duration}</th>
                <th className="p-4 min-w-[130px]">{currentT.price}</th>
                <th className="p-4 min-w-[110px]">{currentT.staff}</th>
                <th className="p-4 min-w-[100px]">{currentT.rating}</th>
                <th className="p-4 min-w-[100px]">{currentT.status}</th>
                <th className="p-4 pr-6 min-w-[120px] text-center">{currentT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredServices.length > 0 ? (
                filteredServices.map((service,i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Name & Image */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs whitespace-nowrap">
                            {lang === 'bn' ? service.nameBn || service.name : service.name}
                          </h4>
                          {service.homeService && (
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[9px] font-bold mt-1 inline-block">
                              {currentT.homeServiceBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-[10px] border border-slate-200">
                        {lang === 'bn' ? service.categoryBn || service.category : service.category}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-slate-600 font-semibold text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {lang === 'bn' ? service.durationBn || service.duration : service.duration}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-rose-600 text-xs">৳{service.price}</span>
                          {service.originalPrice > service.price && (
                            <span className="line-through text-slate-400 text-[10px]">৳{service.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {service.discount}
                        </span>
                      </div>
                    </td>

                    {/* Assigned Staff */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center -space-x-1.5">
                        {(Array.isArray(service.assignedStaff) ? service.assignedStaff : []).map((staff, idx) => (
                          <div 
                            key={idx} 
                            title={staff}
                            className="w-6 h-6 rounded-full bg-rose-500 text-white border-2 border-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                          >
                            {staff.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{service.rating}</span>
                        <span className="text-[10px] text-slate-400">({service.reviewsCount})</span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleStatus(service.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          service.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        {service.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setViewService(service)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(service)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteServiceId(service.id)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                    {currentT.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Details Modal */}
      {viewService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="relative">
              <img src={viewService.image} alt={viewService.name} className="w-full h-44 object-cover" />
              <button 
                onClick={() => setViewService(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-md border border-rose-100">
                  {lang === 'bn' ? viewService.categoryBn || viewService.category : viewService.category}
                </span>
                <span className="flex items-center text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {viewService.rating} ({viewService.reviewsCount} Reviews)
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {lang === 'bn' ? viewService.nameBn || viewService.name : viewService.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'bn' ? viewService.descriptionBn || viewService.description : viewService.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">{currentT.price}</span>
                  <span className="text-lg font-black text-rose-600">৳{viewService.price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">{currentT.duration}</span>
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? viewService.durationBn || viewService.duration : viewService.duration}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setViewService(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
              >
                {currentT.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Add / Edit Service Modal */}
      {(isAddModalOpen || editService) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editService ? currentT.editService : currentT.addService}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditService(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.serviceNameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={currentT.serviceNamePlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Service Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.categoryLabel}</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                  >
                    <option value="Makeup">Makeup</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.durationLabel}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder={currentT.durationPlaceholder} 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.offerPriceLabel}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.originalPriceLabel}</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="3000" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.descriptionLabel}</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={currentT.descriptionPlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditService(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  {currentT.cancel}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all"
                >
                  {editService ? currentT.save : currentT.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteServiceId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{currentT.confirmDeleteTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentT.confirmDeleteSub}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteServiceId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex-1"
              >
                {currentT.cancel}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex-1 shadow-md shadow-rose-200"
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

export default Services;