import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Calendar, Users, DollarSign, Scissors, UserCheck, 
  Star, AlertTriangle, PlusCircle, Tag, Gift, Sparkles 
} from 'lucide-react';

const Dashboard = () => {
  const context = useOutletContext();
  const lang = Array.isArray(context) ? context[0] : (context?.lang || 'bn');
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ bookings: 0, users: 0, revenue: 0, services: 0, staff: 0 });
  const [safePopular, setSafePopular] = useState([]);
  const [safeBookings, setSafeBookings] = useState([]);
  const [safeUpcoming, setSafeUpcoming] = useState([]);
  const [safeReviews, setSafeReviews] = useState([]);
  const [safeStock, setSafeStock] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/booking'),
      api.get('/auth/users'),
      api.get('/service'),
      api.get('/staff'),
      api.get('/report/dashboard'),
      api.get('/review'),
      api.get('/product')
    ]).then(([bookingRes, userRes, serviceRes, staffRes, reportRes, reviewRes, productRes]) => {
      const bookings = bookingRes.data?.bookings || [];
      const services = serviceRes.data?.services || [];
      const today = new Date().toISOString().slice(0, 10);
      const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      const upcoming = bookings
        .filter(booking => booking.bookingDate >= today && !['cancelled', 'completed'].includes(booking.status))
        .sort((a, b) => `${a.bookingDate} ${a.bookingTime}`.localeCompare(`${b.bookingDate} ${b.bookingTime}`))
        .slice(0, 5);
      const counts = bookings.reduce((result, booking) => {
        const serviceName = booking.serviceId?.name || 'Service';
        result[serviceName] = (result[serviceName] || 0) + 1;
        return result;
      }, {});
      setSafePopular(Object.entries(counts)
        .map(([name, count]) => ({ name, bookings: `${count} Bookings` }))
        .sort((a, b) => Number.parseInt(b.bookings, 10) - Number.parseInt(a.bookings, 10))
        .slice(0, 5));
      setSafeBookings(recent.map(booking => ({
        client: booking.customerName || booking.userId?.name || 'Guest',
        service: booking.serviceId?.name || 'Service',
        time: booking.bookingTime || '',
        status: String(booking.status || 'pending').toUpperCase()
      })));
      setSafeUpcoming(upcoming.map(booking => ({
        name: booking.customerName || booking.userId?.name || 'Guest',
        service: booking.serviceId?.name || 'Service',
        time: `${booking.bookingDate} ${booking.bookingTime}`,
        status: String(booking.status || 'pending').replace(/\b\w/g, character => character.toUpperCase())
      })));
      setSafeReviews((reviewRes.data?.reviews || []).slice(0, 5).map(review => ({
        name: review.userId?.name || 'Client',
        rating: review.rating,
        date: review.createdAt?.slice(0, 10) || '',
        comment: review.comment
      })));
      setSafeStock((productRes.data?.products || [])
        .filter(product => product.stock <= 5)
        .map(product => ({ name: product.name, stock: product.stock })));
      setMetrics({
        bookings: bookings.filter(booking => booking.bookingDate === today).length,
        users: userRes.data?.count || userRes.data?.users?.length || 0,
        revenue: reportRes.data?.stats?.totalRevenue || 0,
        services: services.length,
        staff: staffRes.data?.count || staffRes.data?.staff?.length || 0
      });
    }).catch(requestError => setError(requestError.response?.data?.message || requestError.message));
  }, []);

  // Translations Dictionary
  const t = {
    bn: {
      welcome: 'স্বাগতম, অ্যাডমিন! 👋',
      subtitle: 'আজকে আপনার পার্লারে কী কী ঘটছে তার এক নজরে সার্বিক আপডেট।',
      todaysBookings: 'আজকের বুকিং',
      totalCustomers: 'মোট কাস্টমার',
      totalRevenue: 'মোট রেভিনিউ',
      totalServices: 'মোট সার্ভিস',
      staffOnline: 'অনলাইন স্টাফ',
      bookingsOverview: 'সাপ্তাহিক বুকিং চিত্র',
      revenueOverview: 'মাসিক আয় বিশ্লেষণ',
      upcomingAppointments: 'আসন্ন অ্যাপয়েন্টমেন্ট',
      popularServices: 'জনপ্রিয় সার্ভিস',
      recentBookings: 'সাম্প্রতিক বুকিং ফিড',
      recentReviews: 'সাম্প্রতিক রিভিউ ও রেটিং',
      lowStockProducts: 'কম স্টকের প্রোডাক্টস (Warning)',
      quickActions: 'কুইক অ্যাকশন নেভিগেশন',
      addBooking: 'নতুন বুকিং',
      addService: 'নতুন সার্ভিস',
      createOffer: 'স্পেশাল অফার',
      createCoupon: 'কুপন কোড',
      viewAll: 'সব দেখুন',
      outOf: 'জনের মধ্যে',
      fromYesterday: 'গতকাল থেকে',
      fromLastMonth: 'গত মাস থেকে',
      noData: 'কোনো ডাটা পাওয়া যায়নি'
    },
    en: {
      welcome: 'Welcome back, Admin! 👋',
      subtitle: "Here's what's happening with your salon today.",
      todaysBookings: "Today's Bookings",
      totalCustomers: 'Total Customers',
      totalRevenue: 'Total Revenue',
      totalServices: 'Total Services',
      staffOnline: 'Staff Online',
      bookingsOverview: 'Bookings Overview',
      revenueOverview: 'Revenue Overview',
      upcomingAppointments: 'Upcoming Appointments',
      popularServices: 'Popular Services',
      recentBookings: 'Recent Bookings Feed',
      recentReviews: 'Recent Reviews & Ratings',
      lowStockProducts: 'Low Stock Products (Warning)',
      quickActions: 'Quick Navigation Actions',
      addBooking: 'Add Booking',
      addService: 'Add Service',
      createOffer: 'Create Offer',
      createCoupon: 'Create Coupon',
      viewAll: 'View All',
      outOf: 'out of',
      fromYesterday: 'from yesterday',
      fromLastMonth: 'from last month',
      noData: 'No data found'
    }
  };

  const currentT = t[lang] || t.bn;

  return (
    <div className="p-6 bg-slate-100/70 min-h-screen text-slate-800 space-y-6 font-sans">
      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
      
      {/* Top Welcome Banner with Gradient */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">{currentT.welcome}</h1>
          <p className="text-xs text-rose-200/80 mt-1 font-medium">{currentT.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-rose-500/20 backdrop-blur-md text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-400" /> Live Overview
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.todaysBookings}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.bookings}</h3>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
              +12% {currentT.fromYesterday}
            </span>
          </div>
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-md shadow-rose-200">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalCustomers}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.users}</h3>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
              +15% {currentT.fromLastMonth}
            </span>
          </div>
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalRevenue}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">৳ {metrics.revenue.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
              +20% {currentT.fromLastMonth}
            </span>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.totalServices}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.services}</h3>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
              +4 new
            </span>
          </div>
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-200">
            <Scissors className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">{currentT.staffOnline}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.staff}</h3>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
              {currentT.outOf} 12
            </span>
          </div>
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-200">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Navigation Action Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{currentT.quickActions}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            onClick={() => navigate('/admin/bookings')}
            className="p-3.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-rose-200 active:scale-95 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {currentT.addBooking}
          </button>
          <button 
            onClick={() => navigate('/admin/services')}
            className="p-3.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-blue-200 active:scale-95 shadow-sm"
          >
            <Scissors className="w-4 h-4" />
            {currentT.addService}
          </button>
          <button 
            onClick={() => navigate('/admin/offers')}
            className="p-3.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-purple-200 active:scale-95 shadow-sm"
          >
            <Gift className="w-4 h-4" />
            {currentT.createOffer}
          </button>
          <button 
            onClick={() => navigate('/admin/coupons')}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-emerald-200 active:scale-95 shadow-sm"
          >
            <Tag className="w-4 h-4" />
            {currentT.createCoupon}
          </button>
        </div>
      </div>

      {/* Middle Grid: Charts & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bookings Overview Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.bookingsOverview}</h3>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">This Week</span>
          </div>
          <div className="h-44 bg-gradient-to-b from-rose-50 to-slate-50 rounded-xl p-4 flex items-end justify-between border border-rose-100/80">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  style={{ height: `${(idx + 3) * 11}px` }} 
                  className="w-3 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-300 shadow-sm"
                />
                <span className="text-[10px] font-bold text-slate-500">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.revenueOverview}</h3>
            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">This Month</span>
          </div>
          <div className="h-44 bg-slate-50 rounded-xl p-4 flex items-end justify-around border border-slate-200/60">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  style={{ height: `${(idx + 2) * 22}px` }} 
                  className="w-7 bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-md transition-all shadow-sm"
                />
                <span className="text-[10px] font-bold text-slate-500">{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments Feed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.upcomingAppointments}</h3>
            <button onClick={() => navigate('/admin/bookings')} className="text-xs text-rose-600 font-bold hover:underline">
              {currentT.viewAll}
            </button>
          </div>
          <div className="space-y-2.5">
            {safeUpcoming.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{item.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 font-bold block">{item.time}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Popular Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.popularServices}</h3>
            <button onClick={() => navigate('/admin/services')} className="text-xs text-rose-600 font-bold hover:underline">
              {currentT.viewAll}
            </button>
          </div>
          <div className="space-y-2.5">
            {safePopular.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                <span className="font-semibold text-slate-700">{s.name}</span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md text-[10px] border border-rose-100">
                  {s.bookings}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Feed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.recentBookings}</h3>
            <button onClick={() => navigate('/admin/bookings')} className="text-xs text-rose-600 font-bold hover:underline">
              {currentT.viewAll}
            </button>
          </div>
          <div className="space-y-2">
            {safeBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-none">
                <div>
                  <p className="font-bold text-slate-800">{b.client}</p>
                  <p className="text-[10px] text-slate-500">{b.service}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.recentReviews}</h3>
            <span className="text-xs text-slate-400 font-medium">Rating Feed</span>
          </div>
          <div className="space-y-3">
            {safeReviews.map((r, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{r.name}</span>
                  <span className="flex items-center text-amber-600 font-bold text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {r.rating}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] italic line-clamp-2">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">{currentT.lowStockProducts}</h3>
            <button onClick={() => navigate('/admin/products')} className="text-xs text-rose-600 font-bold hover:underline">
              {currentT.viewAll}
            </button>
          </div>
          <div className="space-y-3">
            {safeStock.map((p, i) => (
              <div key={i} className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    {p.name}
                  </span>
                  <span className="text-rose-700 font-bold text-[11px]">Stock: {p.stock}</span>
                </div>
                <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(p.stock / p.total) * 100}%` }} className="bg-rose-600 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;