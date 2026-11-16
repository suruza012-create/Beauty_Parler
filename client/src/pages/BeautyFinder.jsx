import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Scissors, Sparkles, Sun } from 'lucide-react';
import { apiGet } from '../utils/api';

const preferences = [
  {
    id: 'skin',
    label: 'Fresh skin',
    bangla: 'ত্বকের যত্ন',
    description: 'Facials, hydration and a brighter-looking finish',
    icon: Sun,
    keywords: ['skin', 'facial', 'glow', 'hydra', 'clean', 'acne']
  },
  {
    id: 'hair',
    label: 'Healthy hair',
    bangla: 'চুলের যত্ন',
    description: 'Hair spa, repair and nourishing treatments',
    icon: Scissors,
    keywords: ['hair', 'scalp', 'repair', 'conditioning', 'smooth']
  },
  {
    id: 'occasion',
    label: 'A special occasion',
    bangla: 'বিশেষ দিনের সাজ',
    description: 'Bridal, party and event-ready services',
    icon: Sparkles,
    keywords: ['bridal', 'makeup', 'party', 'occasion', 'event']
  },
  {
    id: 'selfcare',
    label: 'A little self-care',
    bangla: 'নিজের জন্য একটু সময়',
    description: 'Relaxing spa, massage and nail care',
    icon: Heart,
    keywords: ['spa', 'massage', 'relax', 'nail', 'body', 'care']
  }
];

const BeautyFinder = () => {
  const [services, setServices] = useState([]);
  const [selectedPreference, setSelectedPreference] = useState('skin');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/service')
      .then(({ services: rows = [] }) => setServices(rows))
      .catch(requestError => setError(requestError.message || 'Services could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const recommendations = useMemo(() => {
    const preference = preferences.find(item => item.id === selectedPreference);
    if (!preference) return [];

    return services
      .map(service => {
        const searchableText = `${service.name || ''} ${service.category || ''} ${service.description || ''}`.toLowerCase();
        const score = preference.keywords.reduce((total, keyword) => total + (searchableText.includes(keyword) ? 1 : 0), 0);
        return { service, score };
      })
      .sort((first, second) => second.score - first.score || Number(second.service.isFeatured) - Number(first.service.isFeatured))
      .filter(item => item.score > 0)
      .slice(0, 3)
      .map(item => item.service);
  }, [selectedPreference, services]);

  const selected = preferences.find(item => item.id === selectedPreference);

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <header className="grid overflow-hidden rounded-3xl bg-slate-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-bold text-rose-200">
              <Sparkles className="h-4 w-4" /> A little help choosing
            </span>
            <h1 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl">Find a service that feels right for you.</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">Choose what you are looking for and explore matching services from Glow&amp;Grace.</p>
          </div>
          <div className="relative min-h-56 bg-rose-100 lg:min-h-80">
            <img
              src={recommendations[0]?.image || services[0]?.image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85'}
              alt={recommendations[0]?.name || 'Beauty service at Glow and Grace'}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">What would you like to focus on?</h2>
              <p className="mt-1 text-sm text-slate-500">আপনার পছন্দের একটি বিষয় বেছে নিন</p>
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Choose a service preference">
              {preferences.map(preference => {
                const Icon = preference.icon;
                const isSelected = selectedPreference === preference.id;
                return (
                  <button
                    key={preference.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedPreference(preference.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${isSelected ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <span className={`mt-0.5 rounded-lg p-2 ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">{preference.label}</span>
                      <span className="mt-1 block text-xs text-slate-500">{preference.bangla} · {preference.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="border-l-2 border-slate-300 pl-3 text-xs leading-5 text-slate-500">This is a preference-based guide, not medical advice. Our team can help you choose at your appointment.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs font-bold uppercase text-rose-600">Your matches</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">{selected?.label || 'Recommended services'}</h2>
              </div>
              <Link to="/services" className="hidden items-center gap-1 text-xs font-bold text-slate-700 hover:text-rose-600 sm:inline-flex">All services <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {loading && <p className="py-8 text-sm text-slate-500">Loading available services...</p>}
            {error && <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
            {!loading && !error && recommendations.length === 0 && (
              <div className="border-y border-slate-200 py-8">
                <p className="text-sm font-bold text-slate-800">No exact match yet.</p>
                <p className="mt-1 text-sm text-slate-500">Browse all services or ask us for a personal recommendation.</p>
                <Link to="/services" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-rose-700">Browse services <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}

            <div className="divide-y divide-slate-200">
              {recommendations.map(service => (
                <article key={service._id} className="grid gap-4 py-4 sm:grid-cols-[128px_1fr_auto] sm:items-center">
                  <img src={service.image} alt={service.name} className="aspect-[4/3] w-full rounded-lg object-cover sm:w-32" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-rose-700">{service.category} · {service.duration}</p>
                    <h3 className="mt-1 text-base font-extrabold text-slate-900">{service.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{service.description}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">৳{service.price}</p>
                  </div>
                  <Link to="/booking" state={{ service: service.name }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700">Book <ArrowRight className="h-4 w-4" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BeautyFinder;