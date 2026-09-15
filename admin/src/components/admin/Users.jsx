import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Users, Search, Eye, CheckCircle2, Plus, 
  Phone, Mail, Calendar, Award, UserCheck, UserX,
  Sparkles, X
} from 'lucide-react';

const UsersList = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // প্রোফাইল দেখার মোডাল state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [formError, setFormError] = useState('');

  // রেজিস্টার্ড কাস্টমার ডেটা
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Smriti Roy",
      email: "smriti@gmail.com",
      phone: "+880 1712-345678",
      role: "Customer",
      memberType: "VIP Gold",
      joinedDate: "3/12/2026",
      totalOrders: 8,
      totalSpent: 12500,
      status: "Active",
      avatarBg: "bg-gradient-to-tr from-pink-500 to-rose-500"
    },
    {
      id: 2,
      name: "Farhana Chowdhury",
      email: "farhana@yahoo.com",
      phone: "+880 1819-987654",
      role: "Customer",
      memberType: "Regular",
      joinedDate: "5/18/2026",
      totalOrders: 3,
      totalSpent: 4200,
      status: "Active",
      avatarBg: "bg-gradient-to-tr from-purple-500 to-indigo-500"
    },
    {
      id: 3,
      name: "Riya Islam",
      email: "riya.islam@gmail.com",
      phone: "+880 1911-223344",
      role: "Customer",
      memberType: "Regular",
      joinedDate: "7/2/2026",
      totalOrders: 1,
      totalSpent: 1500,
      status: "Active",
      avatarBg: "bg-gradient-to-tr from-blue-500 to-cyan-500"
    }
  ]);

  useEffect(() => {
    api.get('/auth/users').then(({ data }) => {
      setUsers((data.users || []).map(user => ({
        ...user,
        id: user._id || user.id,
        joinedDate: user.createdAt?.slice(0, 10),
        memberType: 'Regular',
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0,
        status: user.isActive === false ? 'Blocked' : 'Active',
        avatarBg: 'bg-gradient-to-tr from-pink-500 to-rose-500'
      })));
    }).catch(() => {});
  }, []);

  // ফিল্টারিং
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.phone.includes(searchTerm);
  });

  const toggleUserStatus = async (id) => {
    const user = users.find(item => item.id === id);
    if (!user) return;
    try {
      await api.put(`/auth/users/${id}/status`, { isActive: user.status !== 'Active' });
      setUsers(prev => prev.map(item => item.id === id ? { ...item, status: item.status === 'Active' ? 'Blocked' : 'Active' } : item));
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to update customer status');
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      const { data } = await api.post('/auth/users', formData);
      const user = data.user;
      setUsers(prev => [{
        ...user,
        id: user.id || user._id,
        joinedDate: user.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        memberType: 'Regular',
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0,
        status: 'Active',
        avatarBg: 'bg-gradient-to-tr from-pink-500 to-rose-500'
      }, ...prev]);
      setFormData({ name: '', email: '', password: '', phone: '', address: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to create customer');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-purple-50/50 to-pink-50/40 min-h-screen text-slate-800 space-y-6 font-sans max-w-7xl mx-auto">
      
      {/* ১. কালারফুল হেডার */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 z-10">
          <div className="p-3.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl shadow-lg shadow-pink-500/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {lang === 'bn' ? 'রেজিস্টার্ড কাস্টমার লিস্ট' : 'Registered Customer Database'}
              </h1>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <p className="text-xs text-purple-200/80 font-medium mt-0.5">
              {lang === 'bn' ? 'পার্লারের কাস্টমার তথ্য, ফোন নম্বর ও হিস্ট্রি ম্যানেজ করুন' : 'View active customer database, contact details & orders'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setFormError(''); setIsAddModalOpen(true); }}
          className="z-10 flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-400 text-white rounded-xl text-xs font-black shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {lang === 'bn' ? 'নতুন ক্লায়েন্ট' : 'Add Client'}
        </button>
      </div>

      {/* ২. ভাইব্রেন্ট কাউন্টার কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-100 uppercase">{lang === 'bn' ? 'মোট কাস্টমার' : 'Total Customers'}</p>
            <h3 className="text-3xl font-black mt-1">{users.length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Users className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-pink-100 uppercase">{lang === 'bn' ? 'ভিআইপি কাস্টমার' : 'VIP Members'}</p>
            <h3 className="text-3xl font-black mt-1">{users.filter(u => u.memberType.includes('VIP')).length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Award className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-100 uppercase">{lang === 'bn' ? 'অ্যাক্টিভ একাউন্ট' : 'Active Accounts'}</p>
            <h3 className="text-3xl font-black mt-1">{users.filter(u => u.status === 'Active').length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><UserCheck className="w-6 h-6" /></div>
        </div>
      </div>

      {/* ৩. সার্চ বক্স */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-purple-100 shadow-xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
          <input 
            type="text" 
            placeholder={lang === 'bn' ? 'নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name, email or phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ৪. গ্লসি ইউজার টেবিল */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-purple-100">
                <th className="p-4">{lang === 'bn' ? 'কাস্টমার নাম' : 'Customer'}</th>
                <th className="p-4">{lang === 'bn' ? 'ইমেইল ও ফোন' : 'Contact'}</th>
                <th className="p-4">{lang === 'bn' ? 'মেম্বারশিপ' : 'Membership'}</th>
                <th className="p-4">{lang === 'bn' ? 'মোট কেনাকাটা' : 'Total Spent'}</th>
                <th className="p-4">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-4 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 text-xs font-medium text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                  
                  {/* Avatar & Name */}
                  <td className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${user.avatarBg} text-white font-black rounded-2xl flex items-center justify-center text-xs shadow-md shadow-purple-500/20`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{user.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-500" /> Joined: {user.joinedDate}
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-slate-600"><Mail className="w-3 h-3 text-purple-600" /> {user.email}</span>
                      <span className="flex items-center gap-1.5 text-slate-500 font-mono"><Phone className="w-3 h-3 text-emerald-600" /> {user.phone}</span>
                    </div>
                  </td>

                  {/* VIP / Regular Badge */}
                  <td className="p-4">
                    {user.memberType.includes('VIP') ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-[10px] font-black shadow-md shadow-amber-500/20 flex items-center gap-1 w-max">
                        <Award className="w-3 h-3" /> {user.memberType}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-bold w-max">
                        {user.memberType}
                      </span>
                    )}
                  </td>

                  {/* Spent */}
                  <td className="p-4">
                    <div className="font-black text-purple-700 text-sm">৳{user.totalSpent}</div>
                    <div className="text-[10px] text-slate-400">{user.totalOrders} Orders</div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {user.status === 'Active' ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[10px] font-black flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-[10px] font-black flex items-center gap-1 w-max">
                        <UserX className="w-3 h-3 text-rose-600" /> Blocked
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          user.status === 'Active' 
                            ? 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white' 
                            : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white'
                        }`}
                        title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                      >
                        {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৫. কাস্টমার ডিটেইলস মোডাল */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <h3 className="font-black text-base">{lang === 'bn' ? 'কাস্টমার প্রোফাইল' : 'Customer Profile'}</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-purple-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <div className={`w-12 h-12 ${selectedUser.avatarBg} text-white font-black rounded-2xl flex items-center justify-center text-base shadow-md`}>
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{selectedUser.name}</h4>
                  <p className="text-purple-600 font-bold">{selectedUser.memberType}</p>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-400">Email:</span> <span className="font-bold text-slate-800">{selectedUser.email}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-400">Phone:</span> <span className="font-bold text-slate-800 font-mono">{selectedUser.phone}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-400">Total Spent:</span> <span className="font-black text-purple-700">৳{selectedUser.totalSpent}</span></div>
                <div className="flex justify-between py-1"><span className="text-slate-400">Total Orders:</span> <span className="font-bold text-slate-800">{selectedUser.totalOrders} Bookings</span></div>
              </div>

              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-purple-500/20 cursor-pointer hover:opacity-95 transition-all mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateUser} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{lang === 'bn' ? 'নতুন ক্লায়েন্ট যোগ করুন' : 'Add New Client'}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>
            {formError && <p className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">{formError}</p>}
            <input required placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
            <input required type="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
            <input required minLength={6} type="password" placeholder="Temporary password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
            <input placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
            <input placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black">{lang === 'bn' ? 'ক্লায়েন্ট সংরক্ষণ করুন' : 'Save Client'}</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default UsersList;