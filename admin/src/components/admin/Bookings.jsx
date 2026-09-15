import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Plus, Edit2, Trash2, Search, X, Check, Calendar, 
  Phone, MessageCircle, UserCheck, Printer, DollarSign, Clock, AlertCircle 
} from 'lucide-react';

const Bookings = () => {
  // Outlet Context / AuthContext থেকে গ্লোবাল ল্যাঙ্গুয়েজ
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');

  // Available Services Catalog for Auto Price Match
  const [serviceCatalog, setServiceCatalog] = useState([]);

  // Beautician Roster List
  const staffList = ['Sharmin Sultana', 'Rifat Arju', 'Meherunnesa', 'Unassigned'];

  // Enhanced Bookings State
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      clientName: 'Sabrina Khan', 
      phone: '01700000000', 
      serviceId: 's1', 
      serviceName: 'Bridal Makeup', 
      price: 12000, 
      time: '02:00 PM', 
      date: '2026-07-24', 
      staff: 'Sharmin Sultana',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      notes: 'Sensitive skin, requested organic products.'
    },
    { 
      id: 2, 
      clientName: 'Sumi Akter', 
      phone: '01800000000', 
      serviceId: 's3', 
      serviceName: 'Hair Spa & Cut', 
      price: 1800, 
      time: '12:00 PM', 
      date: '2026-07-25', 
      staff: 'Rifat Arju',
      paymentStatus: 'UNPAID',
      status: 'PENDING',
      notes: ''
    },
  ]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  
  const [currentBooking, setCurrentBooking] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  const [serviceLoadError, setServiceLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form Fields State
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    serviceId: '',
    serviceName: '',
    price: 0,
    time: '12:00 PM',
    date: '',
    staff: 'Unassigned',
    paymentStatus: 'UNPAID',
    status: 'CONFIRMED',
    notes: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Translations
  const t = {
    bn: {
      bannerTitle: 'বুকিং ম্যানেজমেন্ট প্যানেল',
      bannerSub: 'পার্লারের সকল অ্যাপয়েন্টমেন্ট ও রিকোয়েস্ট পরিচালনা করুন',
      addBtn: '+ নতুন বুকিং',
      totalBookings: 'মোট বুকিং',
      confirmedBookings: 'কনফার্মড',
      pendingBookings: 'পেন্ডিং',
      totalRevenue: 'সম্ভাব্য আয়',
      searchPlaceholder: 'নাম, সার্ভিস বা ফোন নম্বর সার্চ করুন...',
      colCustomer: 'কাস্টমার ও ফোন',
      colService: 'সার্ভিস ও মূল্য',
      colDateTime: 'তারিখ ও সময়',
      colStaff: 'দায়িত্বপ্রাপ্ত স্টাফ',
      colPayment: 'পেমেন্ট',
      colStatus: 'স্ট্যাটাস',
      colActions: 'অ্যাকশন',
      modalAdd: 'নতুন বুকিং যুক্ত করুন',
      modalEdit: 'বুকিং আপডেট করুন',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল',
      deleteTitle: 'বুকিংটি মুছে ফেলতে চান?',
      deleteDesc: 'এই ডাটাটি স্থায়ীভাবে ডিলিট হয়ে যাবে।',
      confirmDelete: 'হ্যাঁ, ডিলিট করুন',
      noData: 'কোনো বুকিং রেকর্ড পাওয়া যায়নি',
      filterAll: 'সকল',
      filterConfirmed: 'কনফার্মড',
      filterPending: 'পেন্ডিং',
      filterCancelled: 'বাতিলকৃত',
      notesLabel: 'বিশেষ নোট / রিকোয়েস্ট (ঐচ্ছিক)',
      printMemo: 'ক্যাশ মেমো / ইনভয়েস'
    },
    en: {
      bannerTitle: 'Booking Management Panel',
      bannerSub: 'Manage all parlour booking appointments & requests',
      addBtn: '+ New Booking',
      totalBookings: 'Total Bookings',
      confirmedBookings: 'Confirmed',
      pendingBookings: 'Pending',
      totalRevenue: 'Expected Revenue',
      searchPlaceholder: 'Search name, service, or phone...',
      colCustomer: 'CUSTOMER & PHONE',
      colService: 'SERVICE & PRICE',
      colDateTime: 'DATE & TIME',
      colStaff: 'ASSIGNED STAFF',
      colPayment: 'PAYMENT',
      colStatus: 'STATUS',
      colActions: 'ACTIONS',
      modalAdd: 'Add New Booking',
      modalEdit: 'Edit Booking',
      save: 'Save Booking',
      cancel: 'Cancel',
      deleteTitle: 'Delete Booking?',
      deleteDesc: 'This booking record will be permanently deleted.',
      confirmDelete: 'Yes, Delete',
      noData: 'No booking records found',
      filterAll: 'ALL',
      filterConfirmed: 'CONFIRMED',
      filterPending: 'PENDING',
      filterCancelled: 'CANCELLED',
      notesLabel: 'Special Notes / Request (Optional)',
      printMemo: 'Cash Memo / Invoice'
    }
  };

  const currentT = t[lang] || t.bn;

  useEffect(() => {
    api.get('/service').then(({ data }) => {
      setServiceCatalog((data.services || []).map(service => ({
        id: service._id,
        name: service.name,
        price: service.price
      })));
      if (!data.services?.length) setServiceLoadError(lang === 'bn' ? 'আগে Services page থেকে অন্তত একটি service যোগ করুন।' : 'Add at least one service from the Services page first.');
    }).catch((error) => setServiceLoadError(error.response?.data?.message || 'Unable to load services'));

    api.get('/booking').then(({ data }) => {
      const rows = data.bookings || data.data || [];
      setBookings(rows.map(booking => ({
        ...booking,
        id: booking._id || booking.id,
        clientName: booking.customerName || booking.customer?.name || booking.user?.name || 'Guest',
        serviceName: booking.serviceName || booking.service?.name || 'Service',
        date: booking.bookingDate || booking.date,
        time: booking.bookingTime || booking.time,
        status: String(booking.status || 'PENDING').toUpperCase(),
        paymentStatus: booking.paymentStatus || 'UNPAID'
      })));
    }).catch(() => {});
  }, []);

  // Calculate Quick Stats
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const totalCount = safeBookings.length;
  const confirmedCount = safeBookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingCount = safeBookings.filter(b => b.status === 'PENDING').length;
  const totalRev = safeBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  // Auto Price Match
  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedService = serviceCatalog.find(s => s.id === selectedId);
    if (selectedService) {
      setFormData({
        ...formData,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price
      });
    } else {
      setFormData({ ...formData, serviceId: '', serviceName: '', price: 0 });
    }
  };

  const openAddModal = () => {
    setCurrentBooking(null);
    setFormData({ 
      clientName: '', 
      phone: '', 
      serviceId: '', 
      serviceName: '', 
      price: 0, 
      time: '12:00 PM', 
      date: new Date().toISOString().split('T')[0], 
      staff: 'Unassigned',
      paymentStatus: 'UNPAID',
      status: 'CONFIRMED',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (booking) => {
    setCurrentBooking(booking);
    setFormData({ ...booking });
    setIsModalOpen(true);
  };

  const openInvoiceModal = (booking) => {
    setInvoiceData(booking);
    setIsInvoiceOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName || (!formData.serviceName && !formData.serviceId)) {
      showToast(lang === 'bn' ? 'সকল প্রয়োজনীয় তথ্য প্রদান করুন' : 'Please fill required fields');
      return;
    }

    const payload = {
      customerName: formData.clientName,
      serviceId: formData.serviceId,
      serviceName: formData.serviceName,
      price: Number(formData.price),
      staff: formData.staff,
      bookingDate: formData.date,
      bookingTime: formData.time,
      status: formData.status,
      note: formData.notes
    };
    try {
    setSaving(true);
    if (currentBooking) {
      await api.put(`/booking/${currentBooking.id}`, payload);
      setBookings(prev => Array.isArray(prev) ? prev.map(b => b.id === currentBooking.id ? { ...formData, id: b.id } : b) : []);
      showToast(lang === 'bn' ? 'বুকিং সফলভাবে আপডেট হয়েছে' : 'Booking updated successfully');
    } else {
      const response = await api.post('/booking', payload);
      const newEntry = { ...formData, id: Date.now() };
      setBookings(prev => Array.isArray(prev) ? [{ ...(response.data?.booking || newEntry), ...formData, id: response.data?.booking?._id || newEntry.id }, ...prev] : [newEntry]);
      showToast(lang === 'bn' ? 'নতুন বুকিং যুক্ত হয়েছে' : 'New booking added');
    }
    setIsModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || (lang === 'bn' ? 'বুকিং সংরক্ষণ ব্যর্থ হয়েছে' : 'Booking save failed'));
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/booking/${deleteTargetId}`);
      setBookings(prev => Array.isArray(prev) ? prev.filter(b => b.id !== deleteTargetId) : []);
      setIsDeleteModalOpen(false);
      showToast(lang === 'bn' ? 'বুকিং মুছে ফেলা হয়েছে' : 'Booking deleted successfully');
    } catch (error) {
      showToast(error.response?.data?.message || (lang === 'bn' ? 'ডিলিট ব্যর্থ হয়েছে' : 'Delete failed'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe Filtering
  const filteredBookings = safeBookings.filter(b => {
    const matchesSearch = 
      (b.clientName && b.clientName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (b.serviceName && b.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.phone && b.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen text-slate-800 space-y-6 relative font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-2xl p-6 shadow-md text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </span>
            <h1 className="text-2xl font-black tracking-wide text-white">{currentT.bannerTitle}</h1>
          </div>
          <p className="text-xs text-rose-100 font-medium">{currentT.bannerSub}</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-2.5 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {currentT.addBtn}
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{currentT.totalBookings}</p>
            <h3 className="text-lg font-bold text-slate-800">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{currentT.confirmedBookings}</p>
            <h3 className="text-lg font-bold text-slate-800">{confirmedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{currentT.pendingBookings}</p>
            <h3 className="text-lg font-bold text-slate-800">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{currentT.totalRevenue}</p>
            <h3 className="text-lg font-bold text-slate-800">৳ {totalRev}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentT.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 border-2 border-rose-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700"
          />
          <Search className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { key: 'ALL', label: currentT.filterAll },
            { key: 'CONFIRMED', label: currentT.filterConfirmed },
            { key: 'PENDING', label: currentT.filterPending },
            { key: 'CANCELLED', label: currentT.filterCancelled }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st.key ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-5">{currentT.colCustomer}</th>
                <th className="py-4 px-5">{currentT.colService}</th>
                <th className="py-4 px-5">{currentT.colDateTime}</th>
                <th className="py-4 px-5">{currentT.colStaff}</th>
                <th className="py-4 px-5">{currentT.colPayment}</th>
                <th className="py-4 px-5">{currentT.colStatus}</th>
                <th className="py-4 px-5 text-right">{currentT.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer & Phone */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800">{b.clientName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {b.phone}
                      </div>
                      {b.notes && (
                        <div className="text-[11px] text-amber-600 font-normal italic mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {b.notes}
                        </div>
                      )}
                    </td>

                    {/* Service & Price */}
                    <td className="py-4 px-5">
                      <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                        {b.serviceName}
                      </span>
                      <div className="text-xs font-bold text-pink-600 mt-1">৳ {b.price}</div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-700">{b.date}</div>
                      <div className="text-slate-400">{b.time}</div>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-4 px-5 text-xs">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-1 rounded-md">
                        <UserCheck className="w-3.5 h-3.5 text-rose-500" />
                        {b.staff || 'Unassigned'}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider ${
                        b.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status */}
                    <td className="py-4 px-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {b.status === 'CONFIRMED' ? (lang === 'bn' ? 'কনফার্মড' : 'CONFIRMED') :
                         b.status === 'PENDING' ? (lang === 'bn' ? 'পেন্ডিং' : 'PENDING') :
                         (lang === 'bn' ? 'বাতিল' : 'CANCELLED')}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Print Invoice Memo */}
                        <button
                          onClick={() => openInvoiceModal(b)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Print Memo"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* WhatsApp Direct Chat */}
                        {b.phone && (
                          <a
                            href={`https://wa.me/88${b.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-all shadow-sm"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => triggerDeleteModal(b.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                    {currentT.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                {currentBooking ? currentT.modalEdit : currentT.modalAdd}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'কাস্টমারের নাম' : 'Customer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {lang === 'bn' ? 'সার্ভিস নির্বাচন করুন' : 'Select Service'}
                </label>
                <select
                  value={formData.serviceId}
                  onChange={handleServiceChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="">{lang === 'bn' ? '-- সিলেক্ট সার্ভিস --' : '-- Select Service --'}</option>
                  {serviceCatalog.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (৳ {s.price})
                    </option>
                  ))}
                </select>
                {serviceLoadError && <p className="mt-1 text-[11px] font-bold text-rose-600">{serviceLoadError}</p>}
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value, serviceId: '' })}
                  placeholder={lang === 'bn' ? 'অথবা নতুন service-এর নাম লিখুন' : 'Or type a new service name'}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'তারিখ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'সময়' : 'Time'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'স্টাফ অ্যাসাইন করুন' : 'Assign Staff'}
                  </label>
                  <select
                    value={formData.staff}
                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    {staffList.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="ADVANCE">ADVANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {lang === 'bn' ? 'বুকিং স্ট্যাটাস' : 'Booking Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {currentT.notesLabel}
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Sensitive Skin / Wants Organic Face Pack"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {currentT.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving || (!serviceCatalog.length && !formData.serviceName.trim())}
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
                >
                  {saving ? 'Saving...' : currentT.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Printable Modal */}
      {isInvoiceOpen && invoiceData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-rose-600">💇‍♀️ BEAUTY PARLOUR</h2>
                <p className="text-xs text-slate-400">Booking Cash Memo & Invoice</p>
              </div>
              <button onClick={() => setIsInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600 print:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase">Customer Details</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{invoiceData.clientName}</p>
                <p className="text-slate-500">{invoiceData.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-semibold uppercase">Appointment Info</p>
                <p className="font-bold text-slate-800 mt-0.5">{invoiceData.date}</p>
                <p className="text-slate-500">{invoiceData.time}</p>
              </div>
            </div>

            {/* Service Memo Table */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Service</th>
                    <th className="p-3">Staff</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-800">{invoiceData.serviceName}</td>
                    <td className="p-3 text-slate-600">{invoiceData.staff}</td>
                    <td className="p-3 text-right font-bold text-rose-600">৳ {invoiceData.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Status: </span>
                <span className="font-bold text-emerald-600">{invoiceData.paymentStatus}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-bold text-sm">Total: </span>
                <span className="text-lg font-black text-rose-600">৳ {invoiceData.price}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t print:hidden">
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Memo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5 border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{currentT.deleteTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentT.deleteDesc}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {currentT.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                {currentT.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bookings;