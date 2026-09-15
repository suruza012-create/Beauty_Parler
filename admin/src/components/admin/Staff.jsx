import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Users, UserCheck, Clock, Award, Search, Plus, Edit2, 
  Trash2, Eye, Download, Phone, MessageSquare, Star, 
  DollarSign, CheckCircle2, AlertCircle, X, Calendar, ShieldCheck, Briefcase
} from 'lucide-react';

const Staff = () => {
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');

  // Initial Staff Members Data
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: 'Sharmin Sultana',
      nameBn: 'শারমিন সুলতানা',
      role: 'Senior Makeup Artist',
      roleBn: 'সিনিয়র মেকআপ আর্টিস্ট',
      phone: '01711111111',
      email: 'sharmin@beauty.com',
      shift: 'Morning',
      shiftBn: 'সকাল',
      status: 'Available', // Available, Working, On Leave
      rating: 4.9,
      reviewsCount: 64,
      monthlyServicesCount: 42,
      totalEarned: 85000,
      commissionRate: 15, // 15%
      salaryType: 'Base + Commission',
      joiningDate: '2024-03-15',
      emergencyContact: '01700000000',
      expertise: ['Bridal Makeup', 'Party Makeup', 'HD Makeup'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Rifat Araju',
      nameBn: 'রিফাত আরজু',
      role: 'Hair Stylist & Specialist',
      roleBn: 'হেয়ার স্টাইলিস্ট',
      phone: '01822222222',
      email: 'rifat@beauty.com',
      shift: 'Full Day',
      shiftBn: 'ফুল ডে',
      status: 'Working',
      rating: 4.8,
      reviewsCount: 48,
      monthlyServicesCount: 38,
      totalEarned: 62000,
      commissionRate: 12,
      salaryType: 'Base + Commission',
      joiningDate: '2024-06-01',
      emergencyContact: '01800000000',
      expertise: ['Hair Spa', 'Hair Cut', 'Keratin Treatment'],
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 3,
      name: 'Meherunnesa',
      nameBn: 'মেহেরুন্নেসা',
      role: 'Skin & Facial Specialist',
      roleBn: 'স্কিন স্পেশালিস্ট',
      phone: '01933333333',
      email: 'meher@beauty.com',
      shift: 'Evening',
      shiftBn: 'বিকাল',
      status: 'On Leave',
      rating: 4.7,
      reviewsCount: 35,
      monthlyServicesCount: 29,
      totalEarned: 48000,
      commissionRate: 10,
      salaryType: 'Fixed Salary',
      joiningDate: '2025-01-10',
      emergencyContact: '01900000000',
      expertise: ['Gold Facial', 'Hydra Facial', 'Skin Care'],
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewStaff, setViewStaff] = useState(null);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Makeup Artist',
    phone: '',
    email: '',
    password: '',
    shift: 'Morning',
    commissionRate: 10,
    salaryType: 'Base + Commission',
    emergencyContact: '',
    expertise: 'Bridal Makeup, Party Makeup',
    image: ''
  });

  // Translation Dictionary
  const t = {
    bn: {
      title: 'স্টাফ ও বিউটিশিয়ান টিম',
      subtitle: 'পার্লারের সকল কর্মী, শিফট, পারফরম্যান্স ও কমিশন ব্যবস্থাপনা করুন।',
      addStaff: 'নতুন স্টাফ যোগ করুন',
      editStaff: 'স্টাফ আপডেট করুন',
      searchPlaceholder: 'স্টাফের নাম, ফোন বা রোল খুঁজুন...',
      all: 'সব',
      totalStaff: 'মোট স্টাফ',
      onDuty: 'ডিউটিতে আছেন',
      available: 'উপলব্ধ (Free)',
      working: 'কর্মরত (Busy)',
      onLeave: 'ছুটিতে আছেন',
      totalPayout: 'চলতি মাসের সার্ভিস সেলস',
      staffName: 'স্টাফের নাম ও ছবি',
      role: 'পদবী / রোল',
      phone: 'মোবাইল নম্বর',
      shift: 'শিফট',
      status: 'স্ট্যাটাস',
      actions: 'অ্যাকশন',
      exportCSV: 'এক্সপোর্ট CSV',
      confirmDelete: 'স্টাফ মেম্বারটিকে ডিলিট করতে চান?',
      confirmDeleteSub: 'ডিলিট করলে উক্ত স্টাফের সকল রেকর্ড মুছে যাবে।',
      cancel: 'বাতিল',
      delete: 'ডিলিট',
      save: 'সংরক্ষণ করুন',
      add: 'যোগ করুন',
      noData: 'কোনো স্টাফ পাওয়া যায়নি।',
      morning: 'সকাল',
      evening: 'বিকাল',
      fullDay: 'ফুল ডে',
      // Form Translation
      nameLabel: 'স্টাফের পুরো নাম',
      namePlaceholder: 'যেমন: শারমিন সুলতানা',
      roleLabel: 'পদবী / রোল',
      phoneLabel: 'ফোন নম্বর',
      emailLabel: 'ইমেইল এড্রেস',
      shiftLabel: 'ডিউটি শিফট',
      salaryTypeLabel: 'স্যালারি ক্যাটাগরি',
      commissionLabel: 'কমিশন হার (%)',
      emergencyContactLabel: 'ইমার্জেন্সি ফোন নম্বর',
      expertiseLabel: 'পারদর্শী সার্ভিসসমূহ (কমা দিয়ে লিখুন)',
      imageLabel: 'প্রোফাইল পিকচার ইউআরএল',
      performanceTitle: 'পারফরম্যান্স ও আর্নিং সংক্ষেপ',
      monthlyServices: 'কমপ্লিট সার্ভিস',
      ratingText: 'ক্লায়েন্ট রেটিং',
      expertiseTitle: 'বিশেষ পারদর্শিতা'
    },
    en: {
      title: 'Staff & Beautician Team',
      subtitle: 'Manage parlor staff members, duty shifts, earnings and performance.',
      addStaff: 'Add New Staff',
      editStaff: 'Edit Staff Profile',
      searchPlaceholder: 'Search by staff name, phone or role...',
      all: 'All',
      totalStaff: 'Total Staff',
      onDuty: 'On Duty',
      available: 'Available (Free)',
      working: 'Working (Busy)',
      onLeave: 'On Leave',
      totalPayout: 'Monthly Service Sales',
      staffName: 'Staff Member',
      role: 'Role / Designation',
      phone: 'Phone Number',
      shift: 'Shift',
      status: 'Status',
      actions: 'Actions',
      exportCSV: 'Export CSV',
      confirmDelete: 'Delete this staff member?',
      confirmDeleteSub: 'Once deleted, all records for this staff member will be removed.',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save Changes',
      add: 'Add Member',
      noData: 'No staff members found.',
      morning: 'Morning',
      evening: 'Evening',
      fullDay: 'Full Day',
      // Form Translation
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Sharmin Sultana',
      roleLabel: 'Role / Designation',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email Address',
      shiftLabel: 'Duty Shift',
      salaryTypeLabel: 'Salary Category',
      commissionLabel: 'Commission Rate (%)',
      emergencyContactLabel: 'Emergency Contact',
      expertiseLabel: 'Expertise Services (Comma separated)',
      imageLabel: 'Profile Image URL',
      performanceTitle: 'Performance & Earnings Summary',
      monthlyServices: 'Completed Services',
      ratingText: 'Client Rating',
      expertiseTitle: 'Special Expertise'
    }
  };

  const currentT = t[lang] || t.en;

  useEffect(() => {
    api.get('/staff').then(({ data }) => {
      setStaffList((data.staff || []).map(staff => ({
        ...staff,
        id: staff._id || staff.id,
        status: staff.isActive === false ? 'On Leave' : 'Available',
        expertise: Array.isArray(staff.expertise) ? staff.expertise : [],
        rating: Number(staff.rating) || 0,
        reviewsCount: Number(staff.reviewsCount) || 0,
        monthlyServicesCount: Number(staff.monthlyServicesCount) || 0,
        totalEarned: Number(staff.totalEarned) || 0,
        commissionRate: Number(staff.commissionRate) || 0
      })));
    }).catch(() => {});
  }, []);

  // Handlers
  const toggleStatus = (id) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Available' ? 'Working' : s.status === 'Working' ? 'On Leave' : 'Available';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Role,Phone,Shift,Status,Earned\n'];
    const rows = staffList.map(s => `${s.id},"${s.name}","${s.role}",${s.phone},${s.shift},${s.status},${s.totalEarned}`);
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff-list.csv';
    a.click();
  };

  const handleDelete = () => {
    api.delete(`/staff/${deleteId}`).then(() => {
      setStaffList(prev => prev.filter(s => s.id !== deleteId));
      setDeleteId(null);
    }).catch(() => {});
  };

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone || '');
      alert(`Phone copied: ${phone}`);
    } catch {
      alert(`Phone: ${phone}`);
    }
  };

  const handleOpenEdit = (staff) => {
    setEditStaff(staff);
    setFormData({
      name: staff.name || '',
      role: staff.role || 'beautician',
      phone: staff.phone || '',
      email: staff.email || '',
      password: '',
      shift: staff.shift || 'Morning',
      commissionRate: staff.commissionRate ?? 10,
      salaryType: staff.salaryType || 'Base + Commission',
      emergencyContact: staff.emergencyContact || '',
      expertise: Array.isArray(staff.expertise) ? staff.expertise.join(', ') : '',
      image: staff.image || ''
    });
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const duplicateStaff = staffList.some(staff => (
      staff.email?.toLowerCase() === normalizedEmail && staff.id !== editStaff?.id
    ));
    if (duplicateStaff) {
      alert('This email is already used by another staff member. Please use a different email.');
      return;
    }
    const expArr = formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : ['General Services'];
    let image = formData.image || 'default-staff.jpg';
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('file', imageFile);
      const uploadResponse = await api.post('/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      image = uploadResponse.data.url;
    }
    const payload = {
      name: formData.name,
      role: ['admin', 'manager', 'beautician', 'receptionist', 'accountant'].includes(formData.role)
        ? formData.role
        : 'beautician',
      phone: formData.phone,
      email: normalizedEmail,
      salary: 0,
      isActive: true,
      image,
      ...(formData.password ? { password: formData.password } : {})
    };

    try {
    if (editStaff) {
      await api.put(`/staff/${editStaff.id}`, { ...payload, password: undefined });
      setStaffList(prev => prev.map(s => s.id === editStaff.id ? {
        ...s,
        name: formData.name,
        nameBn: formData.name,
        role: formData.role,
        roleBn: formData.role,
        phone: formData.phone,
        email: formData.email,
        shift: formData.shift,
        shiftBn: formData.shift === 'Morning' ? 'সকাল' : formData.shift === 'Evening' ? 'বিকাল' : 'ফুল ডে',
        commissionRate: Number(formData.commissionRate),
        salaryType: formData.salaryType,
        emergencyContact: formData.emergencyContact,
        expertise: expArr,
        image
      } : s));
      setEditStaff(null);
    } else {
      const response = await api.post('/staff', payload);
      const newStaff = {
        id: response.data?.staff?.id || response.data?.staff?._id,
        name: formData.name,
        nameBn: formData.name,
        role: formData.role,
        roleBn: formData.role,
        phone: formData.phone,
        email: formData.email || 'staff@beauty.com',
        shift: formData.shift,
        shiftBn: formData.shift === 'Morning' ? 'সকাল' : formData.shift === 'Evening' ? 'বিকাল' : 'ফুল ডে',
        status: 'Available',
        rating: 5.0,
        reviewsCount: 1,
        monthlyServicesCount: 0,
        totalEarned: 0,
        commissionRate: Number(formData.commissionRate || 10),
        salaryType: formData.salaryType,
        joiningDate: new Date().toISOString().split('T')[0],
        emergencyContact: formData.emergencyContact || formData.phone,
        expertise: expArr,
        image
      };
      setStaffList(prev => [newStaff, ...prev]);
      setIsAddModalOpen(false);
    }
    } catch (error) {
      console.error('Staff save failed:', error);
      alert(error.response?.data?.message || 'Unable to save staff member');
    }
  };

  // Filter Logic
  const filteredStaff = staffList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.phone.includes(searchTerm);
    const matchShift = selectedShift === 'All' || s.shift === selectedShift;
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;
    return matchSearch && matchShift && matchStatus;
  });

  const totalEarnedSum = staffList.reduce((acc, curr) => acc + (Number(curr.totalEarned) || 0), 0);

  return (
    <div className="p-6 bg-slate-100/80 min-h-screen text-slate-800 space-y-6 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-white">{currentT.title}</h1>
          </div>
          <p className="text-xs text-amber-200/80 mt-1 font-medium">{currentT.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            {currentT.exportCSV}
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', role: 'Makeup Artist', phone: '', email: '', shift: 'Morning', commissionRate: 10, salaryType: 'Base + Commission', emergencyContact: '', expertise: 'Bridal Makeup', image: '' });
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {currentT.addStaff}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalStaff}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{staffList.length} Members</h3>
          </div>
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.available}</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {staffList.filter(s => s.status === 'Available').length} Free
            </h3>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.working}</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              {staffList.filter(s => s.status === 'Working').length} Busy
            </h3>
          </div>
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-200">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalPayout}</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">৳ {totalEarnedSum.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Shift Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Shift Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Morning', 'Evening', 'Full Day'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedShift(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedShift === s
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'All' ? currentT.all : s === 'Morning' ? currentT.morning : s === 'Evening' ? currentT.evening : currentT.fullDay}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="All">{currentT.all}</option>
            <option value="Available">{currentT.available}</option>
            <option value="Working">{currentT.working}</option>
            <option value="On Leave">{currentT.onLeave}</option>
          </select>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentT.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>

      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 min-w-[220px]">{currentT.staffName}</th>
                <th className="p-4 min-w-[160px]">{currentT.role}</th>
                <th className="p-4 min-w-[140px]">{currentT.phone}</th>
                <th className="p-4 min-w-[110px]">{currentT.shift}</th>
                <th className="p-4 min-w-[120px]">{currentT.status}</th>
                <th className="p-4 pr-6 min-w-[140px] text-center">{currentT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Staff Name & Photo */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={staff.image} 
                          alt={staff.name} 
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs whitespace-nowrap">
                            {lang === 'bn' ? staff.nameBn || staff.name : staff.name}
                          </h4>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {staff.rating} ({staff.reviewsCount})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-[10px] border border-slate-200">
                        {lang === 'bn' ? staff.roleBn || staff.role : staff.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 text-xs">{staff.phone}</span>
                    </td>

                    {/* Shift */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {lang === 'bn' ? staff.shiftBn || staff.shift : staff.shift}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleStatus(staff.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          staff.status === 'Available' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : staff.status === 'Working'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          staff.status === 'Available' ? 'bg-emerald-600' : staff.status === 'Working' ? 'bg-purple-600' : 'bg-rose-600'
                        }`} />
                        {staff.status === 'Available' ? currentT.available : staff.status === 'Working' ? currentT.working : currentT.onLeave}
                      </button>
                    </td>

                    {/* Quick Communication & Actions */}
                    <td className="p-4 pr-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Direct Call */}
                        <button
                          type="button"
                          onClick={() => copyPhone(staff.phone)}
                          title="Copy Staff Phone"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        {/* WhatsApp Message */}
                        <a 
                          href={`https://wa.me/88${staff.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Message"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Details View */}
                        <button 
                          onClick={() => setViewStaff(staff)}
                          title="View Profile"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button 
                          onClick={() => handleOpenEdit(staff)}
                          title="Edit Profile"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button 
                          onClick={() => setDeleteId(staff.id)}
                          title="Delete Member"
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
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    {currentT.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Profile View Modal */}
      {viewStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            
            {/* Header Banner */}
            <div className="relative p-6 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex items-center gap-4">
              <img src={viewStaff.image} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-amber-400" />
              <div>
                <h3 className="font-black text-lg text-white">
                  {lang === 'bn' ? viewStaff.nameBn || viewStaff.name : viewStaff.name}
                </h3>
                <p className="text-xs text-amber-200/90 font-medium">{viewStaff.role}</p>
                <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded mt-1 border border-amber-500/30">
                  Joined: {viewStaff.joiningDate}
                </span>
              </div>
              <button onClick={() => setViewStaff(null)} className="absolute top-3 right-3 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-5 space-y-4 text-xs">
              
              {/* Performance Stats */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">{currentT.performanceTitle}</h4>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">{currentT.monthlyServices}</span>
                    <span className="font-black text-slate-900 text-base">{viewStaff.monthlyServicesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">সার্ভিস সেলস ভ্যালু</span>
                    <span className="font-black text-amber-600 text-base">৳ {(Number(viewStaff.totalEarned) || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">কমিশন রেট</span>
                    <span className="font-bold text-slate-800">{viewStaff.commissionRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">{currentT.ratingText}</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {viewStaff.rating} ({viewStaff.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                <p className="text-slate-700"><strong>Email:</strong> {viewStaff.email}</p>
                <p className="text-slate-700"><strong>Emergency Contact:</strong> {viewStaff.emergencyContact}</p>
                <p className="text-slate-700"><strong>Salary Type:</strong> {viewStaff.salaryType}</p>
              </div>

              {/* Expertise List */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1.5">{currentT.expertiseTitle}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewStaff.expertise.map((exp, idx) => (
                    <span key={idx} className="bg-amber-50 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-md border border-amber-200">
                      ✓ {exp}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setViewStaff(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                {currentT.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {(isAddModalOpen || editStaff) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editStaff ? currentT.editStaff : currentT.addStaff}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditStaff(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.nameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name ?? ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={currentT.namePlaceholder} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.roleLabel}</label>
                  <select 
                    value={formData.role ?? ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Senior Makeup Artist">Senior Makeup Artist</option>
                    <option value="Hair Stylist & Specialist">Hair Stylist</option>
                    <option value="Skin & Facial Specialist">Skin Specialist</option>
                    <option value="Nail & Pedicure Expert">Nail Expert</option>
                  </select>
                </div>

                {!editStaff && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Login Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password ?? ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.phoneLabel}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01711111111" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.shiftLabel}</label>
                  <select 
                    value={formData.shift ?? ''}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.commissionLabel}</label>
                  <input 
                    type="number" 
                    value={formData.commissionRate ?? ''}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    placeholder="15" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.emailLabel}</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email ?? ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@beauty.com" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.emergencyContactLabel}</label>
                  <input 
                    type="text" 
                    value={formData.emergencyContact ?? ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="01700000000" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.expertiseLabel}</label>
                <input 
                  type="text" 
                  value={formData.expertise ?? ''}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="Bridal Makeup, Hair Spa, Hydra Facial" 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{currentT.imageLabel}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <input 
                  type="url" 
                  value={formData.image ?? ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditStaff(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  {currentT.cancel}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200"
                >
                  {editStaff ? currentT.save : currentT.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{currentT.confirmDelete}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentT.confirmDeleteSub}</p>
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

export default Staff;