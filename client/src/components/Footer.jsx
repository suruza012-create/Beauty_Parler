import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, MapPin, Phone, Mail, Clock,
} from 'lucide-react';
import { apiGet, apiPost } from '../utils/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/content/settings')
      .then(({ settings: data }) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await apiPost('/content/contact', {
        name: 'Newsletter Subscriber',
        email: trimmedEmail,
        message: 'Newsletter subscription request.'
      });
      setStatus('Thanks! You are subscribed.');
      setEmail('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-white pt-16 pb-8 border-t border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-pink-500 to-purple-500 text-white rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {settings?.siteName || 'Glow&Grace'}
              </span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {settings?.tagline || 'Experience world-class beauty parlour services and premium cosmetics products tailored for your unique style and elegance.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href={settings?.facebook || '#'} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-pink-600 rounded-2xl text-white transition-all">facebook</a>
              <a href={settings?.instagram || '#'} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-pink-600 rounded-2xl text-white transition-all">instagram</a>
              <a href={settings?.whatsapp || '#'} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-pink-600 rounded-2xl text-white transition-all">WhatsApp</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-pink-400 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-purple-200/80 font-medium">
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Cosmetics Shop</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Beauty Tips & Blog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-pink-400 uppercase tracking-wider">Contact & Hours</h4>
            <ul className="space-y-2.5 text-xs text-purple-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>{settings?.address || 'House 42, Road 11, Dhanmondi, Dhaka'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{settings?.phone || '+880 1234 567 890'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{settings?.contactEmail || 'info@glowandgrace.com'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings?.openTime && settings?.closeTime ? `Open Everyday: ${settings.openTime} - ${settings.closeTime}` : 'Open Everyday: 10:00 AM - 08:00 PM'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-pink-400 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-purple-200/80">Subscribe to receive beauty tips, discount coupons, and event alerts!</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email..." 
                  className="w-full p-3 bg-white/10 border border-purple-800 rounded-2xl text-xs text-white placeholder-purple-300 focus:outline-none focus:border-pink-500"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white hover:scale-105 transition-all">
                  →
                </button>
              </div>
              {status && <p className="text-[11px] text-emerald-400 font-bold">{status}</p>}
              {error && <p className="text-[11px] text-rose-400 font-bold">{error}</p>}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-300/70 gap-3">
          <p>© {new Date().getFullYear()} {settings?.siteName || 'Glow&Grace Beauty Parlour'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Cancellation</Link>
          </div>
          <p className="flex items-center gap-1">Crafted with care for beauty & wellness.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;