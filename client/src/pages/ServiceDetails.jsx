import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle2, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';
import { apiGet } from '../utils/api';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/service/${id}`)
      .then(({ service: row }) => setService({
        id: row._id,
        title: row.name,
        category: row.category === 'Hair' ? 'Hair Care' : row.category === 'Skin' ? 'Facial & Skin' : row.category,
        price: row.price,
        oldPrice: row.discount ? Math.round(row.price / (1 - row.discount / 100)) : row.price,
        rating: row.averageRating || 0,
        reviews: row.totalReviews || 0,
        duration: row.duration,
        description: row.description,
        features: row.features || [],
        image: row.image
      }))
      .catch(requestError => setError(requestError.message));
  }, [id]);

  if (error) return <p className="p-10 text-center text-rose-600 font-bold">{error}</p>;
  if (!service) return <p className="p-10 text-center text-slate-500 font-bold">Loading service...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Image */}
          <div className="space-y-4">
            <img src={service.image} alt={service.title} className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md" />
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-purple-50 p-3 rounded-2xl">
              <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-500" /> {service.rating} ({service.reviews} Reviews)</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-purple-600"><Clock className="w-4 h-4" /> {service.duration}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 font-bold text-[11px] rounded-full uppercase tracking-wider">
                {service.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{service.title}</h1>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{service.description}</p>

              {/* Included Features */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase">What's Included:</h4>
                <ul className="space-y-2">
                  {service.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Booking Button */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 line-through">৳{service.oldPrice}</span>
                <div className="text-2xl font-black text-purple-700">৳{service.price}</div>
              </div>
              <Link
                to="/booking"
                state={{ service: service.title }}
                className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;