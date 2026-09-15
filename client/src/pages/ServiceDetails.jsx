import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle2, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Single Dummy Service Data
  const service = {
    id: id || 1,
    title: 'Bridal Glow Facial & Spa',
    category: 'Facial & Skin',
    price: 2500,
    oldPrice: 3000,
    rating: 4.9,
    reviews: 128,
    duration: '90 Mins',
    description: 'আমাদের স্পেশাল ব্রাইডাল গ্লো ফেসিয়ালের মাধ্যমে আপনার ত্বকের মরা কোষ দূর করে প্রাকৃতিক উজ্জ্বলতা ফুটিয়ে তোলা হয়। এতে ব্যবহার করা হয় শতভাগ অরগানিক উপাদান যা যেকোনো ধরনের ত্বকের জন্য নিরাপদ।',
    features: [
      'গভীর ত্বক পরিষ্কারকরণ (Deep Cleansing)',
      'গোল্ড স্ক্রাব এক্সফোলিয়েশন (Gold Scrub)',
      'ডিটক্স কাদা মাস্ক (Detox Mud Mask)',
      'রিলাক্সিং ফেসিয়াল মাসাজ (Face Massage)',
      'সানস্ক্রিন ও হাইড্রেশন সিরাম (Moisturizer & Serum)'
    ],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
  };

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