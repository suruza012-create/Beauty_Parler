import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // পাথটি প্রোজেক্ট অনুযায়ী চেক করুন

const Login = () => {
  const { login, loading, lang, setLang } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // অনুবাদ অবজেক্ট
  const t = {
    bn: {
      title: '💅 অ্যাডমিন লগইন',
      subtitle: 'বিউটি পার্লার ম্যানেজমেন্ট প্যানেলে স্বাগতম',
      email: 'ইমেইল এড্রেস',
      password: 'পাসওয়ার্ড',
      btn: 'লগইন করুন',
      errorHeading: 'ভুল হয়েছে!',
      showPass: 'পাসওয়ার্ড দেখান',
      footer: 'নিরাপদ অ্যাডমিন অ্যাক্সেস সিস্টেম',
      helperTitle: '🔑 ডেমো লগইন তথ্য:',
      loadingText: 'যাচাই করা হচ্ছে...'
    },
    en: {
      title: '💅 Admin Login',
      subtitle: 'Welcome to Beauty Parlour Management Panel',
      email: 'Email Address',
      password: 'Password',
      btn: 'Sign In',
      errorHeading: 'Error!',
      showPass: 'Show Password',
      footer: 'Secure Admin Access System',
      helperTitle: '🔑 Demo Credentials:',
      loadingText: 'Authenticating...'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(lang === 'bn' ? 'সবগুলো ঘর পূরণ করুন!' : 'Please fill in all fields!');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin/dashboard'); // সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট করবে
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-screen h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-900 px-4 font-sans relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* ল্যাঙ্গুয়েজ সুইচার টপ-রাইট কোণায় */}
      <div className="absolute top-6 right-6 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 flex gap-1 z-10">
        <button
          onClick={() => setLang('bn')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
            lang === 'bn' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          বাংলা
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
            lang === 'en' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        {/* লোগো ও হেডার */}
        <div className="text-center space-y-2">
          <span className="text-5xl drop-shadow-lg inline-block animate-bounce duration-1000">👑</span>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 tracking-wide">
            {t[lang].title}
          </h2>
          <p className="text-slate-400 text-xs font-medium">{t[lang].subtitle}</p>
        </div>

        {/* এরর এলার্ট বক্স */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-2xl flex items-start gap-2.5 shadow-inner">
            <span>⚠️</span>
            <div>
              <p className="font-bold text-rose-200 text-sm">{t[lang].errorHeading}</p>
              <p className="mt-0.5 opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* মেইন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
              {t[lang].email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-inner"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
              {t[lang].password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-inner"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* লগইন বাটন উইথ কালারফুল লোডিং স্পিনার */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-indigo-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t[lang].loadingText}</span>
              </>
            ) : (
              t[lang].btn
            )}
          </button>
        </form>

        {/* ডেভেলপার হেল্পার গাইড যাতে টেস্ট করতে সুবিধা হয় */}
        <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-rose-400">{t[lang].helperTitle}</p>
          <p>📧 Email: <span className="text-slate-200 select-all font-mono">admin@parlour.com</span></p>
          <p>🔑 Password: <span className="text-slate-200 select-all font-mono">password</span></p>
        </div>

        <p className="text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
          🛡️ {t[lang].footer}
        </p>

      </div>
    </div>
  );
};

export default Login;