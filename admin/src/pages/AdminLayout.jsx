import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext'; // আপনার AuthContext ফোল্ডারের সঠিক পাথ

const AdminContent = () => {
  // গ্লোবাল AuthContext থেকে ল্যাঙ্গুয়েজ এবং লগআউট ফাংশন নেওয়া হলো
  const { user, lang, setLang, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/admin/login', { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  // ল্যাঙ্গুয়েজ লোকাল স্টোরেজে সিঙ্ক রাখা
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // সব অপশনসহ কমপ্লিট অনুবাদ অবজেক্ট
  const t = {
    bn: {
      brand: '💇‍♀️ বিউটি পার্লার',
      dashboard: '📊 ড্যাশবোর্ড',
      bookings: '📅 বুকিং সমূহ',
      services: '💅 সার্ভিস তালিকা',
      coupons: '🏷️ কুপন কোড',
      offers: '🎁 স্পেশাল অফার',
      staff: '👩‍💼 স্টাফ মেম্বার',
      blogs: '✍️ ব্লগ সমূহ',
      orders: '📦 অর্ডার তালিকা',
      products: '💄 প্রোডাক্টস',
      users: '👥 ইউজার লিস্ট',
      settings: '⚙️ সেটিংস',
      paymentMethods: '💳 পেমেন্ট নম্বর',
      contactMessages: '✉️ মেসেজ সমূহ',
      footer: 'অ্যাডমিন প্যানেল',
      logout: 'লগআউট',
      online: 'সার্ভার অনলাইন',
    },
    en: {
      brand: '💇‍♀️ Beauty Parlour',
      dashboard: '📊 Dashboard',
      bookings: '📅 Bookings',
      services: '💅 Services List',
      coupons: '🏷️ Coupon Codes',
      offers: '🎁 Special Offers',
      staff: '👩‍💼 Staff Members',
      blogs: '✍️ Blogs',
      orders: '📦 Orders List',
      products: '💄 Products',
      users: '👥 Users List',
      settings: '⚙️ Settings',
      paymentMethods: '💳 Payment Accounts',
      contactMessages: '✉️ Contact Messages',
      content: '🖼️ Gallery & Videos',
      footer: 'Admin Panel',
      logout: 'Logout',
      online: 'Server Online',
    }
  };

  const menuItems = [
    { name: t[lang].dashboard, path: '/admin/dashboard' },
    { name: t[lang].bookings, path: '/admin/bookings' },
    { name: t[lang].services, path: '/admin/services' },
    { name: t[lang].coupons, path: '/admin/coupons' },
    { name: t[lang].offers, path: '/admin/offers' },
    { name: t[lang].staff, path: '/admin/staff' },
    { name: t[lang].blogs, path: '/admin/blogs' },
    { name: t[lang].orders, path: '/admin/orders' },
    { name: t[lang].products, path: '/admin/products' },
    { name: t[lang].users, path: '/admin/users' },
    { name: t[lang].settings, path: '/admin/settings' },
    { name: t[lang].paymentMethods, path: '/admin/payment-methods' },
    { name: t[lang].contactMessages, path: '/admin/contact-messages' },
    { name: t[lang].content, path: '/admin/content' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* বাম পাশের স্ক্রোলবল সাইডবার */}
      <div className="w-64 bg-slate-900 text-white flex flex-col justify-between h-full">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-5 text-xl font-bold border-b border-slate-800 tracking-wider flex items-center gap-2 sticky top-0 bg-slate-900 z-10">
            <span>{t[lang].brand}</span>
          </div>
          <nav className="mt-4 px-4 space-y-1 pb-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* বটম লগআউট */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm bg-slate-900">
          <span className="text-slate-400">{t[lang].footer}</span>
          <button 
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            {t[lang].logout}
          </button>
        </div>
      </div>

      {/* ডান পাশের মূল কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* টপ বার */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.name || 'Panel'}
          </h2>
          
          <div className="flex items-center gap-6">
            {/* ল্যাঙ্গুয়েজ সুইচার */}
            <div className="bg-gray-100 p-1 rounded-lg flex gap-1 border border-gray-200">
              <button
                onClick={() => setLang('bn')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'bn' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'en' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                English
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600">{t[lang].online}</span>
            </div>
          </div>
        </header>

        {/* ডাইনামিক কন্টেন্ট এরিয়া */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet context={[lang]} />
        </main>
      </div>
    </div>
  );
};

// মেইন লেআউট যা AuthProvider দিয়ে পুরো ড্যাশবোর্ডকে র্যাপ করে রাখবে
const AdminLayout = () => {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
};

export default AdminLayout;