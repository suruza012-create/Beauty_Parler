import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6 border border-purple-100">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-purple-100 text-purple-700 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Forgot Password?</h2>
          <p className="text-xs text-slate-500 font-medium">
            আপনার অ্যাকাউন্টের ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠিয়ে দেব।
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              একটি রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে! অনুগ্রহ করে ইনবক্স চেক করুন।
            </p>
            <Link 
              to="/login"
              className="inline-block px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-2xl transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600"
                  required 
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;