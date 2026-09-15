import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Star, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { apiGet } from '../utils/api';

const Services = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Facial & Skin', 'Hair Care', 'Makeup', 'Nail & Body', 'Spa & Massage'];

  useEffect(() => {
    apiGet('/service')
      .then(({ services = [] }) => setAllServices(services.map(service => ({
        id: service._id,
        title: service.name,
        category: service.category === 'Hair' ? 'Hair Care' : service.category === 'Skin' ? 'Facial & Skin' : service.category,
        price: service.price,
        oldPrice: service.price + (service.discount ? Math.round(service.price * service.discount / 100) : 0),
        rating: service.averageRating || 0,
        reviews: service.totalReviews || 0,
        duration: service.duration,
        description: service.description,
        image: service.image
      }))))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = allServices.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-pink-600 uppercase tracking-widest bg-pink-100 px-3 py-1 rounded-full">
            Our Offerings
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">Beauty Parlour Services</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            আপনার পছন্দের সার্ভিসটি বেছে নিন এবং সহজেই অনলাইনে বুকিং দিন
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-purple-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

        </div>

        {/* Services Grid */}
        {error && <p className="text-center text-rose-600 font-bold">{error}</p>}
        {loading && <p className="text-center text-slate-500 font-bold">Loading services...</p>}
        {!loading && !error && filteredServices.length === 0 && <p className="text-center text-slate-500 font-bold">No services available yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl">
                    {service.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-500" /> {service.rating} ({service.reviews})</span>
                    <span className="flex items-center gap-1 text-purple-600"><Clock className="w-4 h-4" /> {service.duration}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">{service.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-xs text-slate-400 line-through">৳{service.oldPrice}</span>
                  <div className="text-xl font-black text-purple-700">৳{service.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/services/${service.id}`} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all">
                    Details
                  </Link>
                  <Link to="/booking" state={{ service: service.title }} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black rounded-2xl shadow-md hover:scale-105 transition-all">
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Services;