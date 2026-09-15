import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, Award, Users } from 'lucide-react';
import { apiGet } from '../utils/api';

const About = () => {
  const [settings, setSettings] = useState(null);
  useEffect(() => { apiGet('/content/settings').then(({ settings: data }) => setSettings(data)).catch(() => {}); }, []);
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-pink-600 uppercase bg-pink-100 px-3 py-1 rounded-full">
            About Glow&Grace
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">{settings?.tagline || 'Your Beauty, Our Passion'}</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            {settings?.siteName || 'Glow&Grace Beauty Parlour'} provides trusted beauty care services and original cosmetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 space-y-2">
            <Users className="w-8 h-8 text-purple-600 mx-auto" />
            <h3 className="font-black text-xl">5000+</h3>
            <p className="text-xs text-slate-500">Happy Clients</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 space-y-2">
            <Award className="w-8 h-8 text-pink-600 mx-auto" />
            <h3 className="font-black text-xl">100%</h3>
            <p className="text-xs text-slate-500">Authentic Products</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 space-y-2">
            <Heart className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-black text-xl">5 Years</h3>
            <p className="text-xs text-slate-500">Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;