import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, ShoppingBag, ArrowRight, Star, 
  CheckCircle2, Clock, MapPin, Phone, ShieldCheck, 
  Heart, Eye, Award, Gift, ChevronRight, UserCheck
} from 'lucide-react';
import { apiGet } from '../utils/api';

const Home = () => {
  const navigate = useNavigate();

  // Quick Booking Form State
  const [bookingService, setBookingService] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Dummy Featured Services
  const fallbackFeaturedServices = [
    {
      id: 1,
      title: 'Bridal Glow Facial & Spa',
      category: 'Facial & Skin',
      price: 2500,
      oldPrice: 3000,
      rating: 4.9,
      reviews: 128,
      duration: '90 Mins',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'
    },
    {
      id: 2,
      title: 'Keratin Hair Rebonding & Therapy',
      category: 'Hair Care',
      price: 4500,
      oldPrice: 5500,
      rating: 4.8,
      reviews: 95,
      duration: '120 Mins',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80'
    },
    {
      id: 3,
      title: 'HD Reception Makeup Package',
      category: 'Makeup',
      price: 6000,
      oldPrice: 7500,
      rating: 5.0,
      reviews: 210,
      duration: '150 Mins',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80'
    },
    {
      id: 4,
      title: 'Pedicure & Manicure Deluxe Spa',
      category: 'Nail & Body',
      price: 1800,
      oldPrice: 2200,
      rating: 4.7,
      reviews: 64,
      duration: '60 Mins',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80'
    }
  ];

  // Dummy Featured Products
  const fallbackFeaturedProducts = [
    {
      id: 101,
      name: "L'Oreal Professional Hair Spa Cream 500ml",
      brand: "L'Oréal Paris",
      price: 950,
      regularPrice: 1200,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80'
    },
    {
      id: 102,
      name: "Matte Liquid Lipstick - Ruby Red",
      brand: "MAC",
      price: 1250,
      regularPrice: 1500,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80'
    },
    {
      id: 103,
      name: "Bridal Glow Facial Kit Gold 24K",
      brand: "Lotus",
      price: 2400,
      regularPrice: 2800,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=80'
    },
    {
      id: 104,
      name: "Skin Brightening Vitamin C Serum 30ml",
      brand: "The Ordinary",
      price: 1100,
      regularPrice: 1350,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'
    }
  ];

  useEffect(() => {
    Promise.all([apiGet('/service'), apiGet('/product')]).then(([serviceData, productData]) => {
      const services = (serviceData.services || []).map(service => ({
        id: service._id,
        title: service.name,
        category: service.category,
        price: service.price,
        oldPrice: service.price,
        rating: service.averageRating || 0,
        reviews: service.totalReviews || 0,
        duration: service.duration,
        image: service.image
      }));
      const products = (productData.products || []).map(product => ({
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        regularPrice: product.price,
        rating: product.averageRating || 0,
        image: product.image
      }));
      setFeaturedServices(services.length ? services.slice(0, 4) : fallbackFeaturedServices);
      setFeaturedProducts(products.length ? products.slice(0, 4) : fallbackFeaturedProducts);
    }).catch(() => {
      setFeaturedServices(fallbackFeaturedServices);
      setFeaturedProducts(fallbackFeaturedProducts);
    });
  }, []);

  // Customer Reviews
  const reviews = [
    {
      id: 1,
      name: "Sultana Razia",
      role: "Bridal Package Client",
      comment: "Glow&Grace-এর ফেসিয়াল এবং ব্রাইডাল মেকআপ সার্ভিস অসাধারণ ছিল! পার্লারের পরিবেশ খুব সুন্দর এবং বিউটিশিয়ানদের ব্যবহার অনেক ভালো।",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
    },
    {
      id: 2,
      name: "Anika Rahman",
      role: "Regular Customer",
      comment: "এদের হেয়ার স্পা ট্রিমেন্ট নেওয়ার পর চুল অনেক সিল্কি হয়েছে। এছাড়া অনলাইন থেকে কেনা লোরিয়েল স্পা ক্রিমটি ১ দিনেই ডেলিভারি পেয়েছি!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80"
    },
    {
      id: 3,
      name: "Farhana Nusrat",
      role: "Makeup Client",
      comment: "অনলাইনে অ্যাপয়েন্টমেন্ট বুক করে গিয়েছিলাম, কোনো ওয়েট করতে হয়নি। সার্ভিস কোয়ালিটি অত্যন্ত প্রফেশনাল।",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80"
    }
  ];

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    navigate('/booking', { state: { service: bookingService, date: bookingDate } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans space-y-16 pb-16">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white overflow-hidden py-20 lg:py-28">
        
        {/* Background Decorative Glowing Orbs */}
        <div className="absolute left-10 top-10 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-pink-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              Premium Parlour & Cosmetics Shop
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Enhance Your <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                Natural Beauty
              </span> & Elegance
            </h1>

            <p className="text-sm sm:text-base text-purple-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              অভিজ্ঞ বিউটিশিয়ানদের ছোঁয়ায় নিজেকে সাজিয়ে তুলুন একদম নতুন রূপে। বুক করুন অনলাইন অ্যাপয়েন্টমেন্ট অথবা অর্ডার করুন অরিজিনাল কসমেটিকস।
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/booking"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                Browse Cosmetics
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-900/60 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-pink-400">100%</h4>
                <p className="text-[11px] text-purple-200/70 font-semibold">Authentic Brands</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-amber-400">5,000+</h4>
                <p className="text-[11px] text-purple-200/70 font-semibold">Happy Clients</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-emerald-400">4.9 ★</h4>
                <p className="text-[11px] text-purple-200/70 font-semibold">Client Rating</p>
              </div>
            </div>

          </div>

          {/* Right Hero Image Collage */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" 
                alt="Beauty Parlour Service" 
                className="rounded-3xl shadow-2xl border-4 border-white/10 object-cover w-full h-[380px] sm:h-[460px]"
              />
              {/* Floating Discount Tag */}
              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-purple-100 hidden sm:flex items-center gap-3">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                  <Gift className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h5 className="font-black text-sm">20% Special Discount</h5>
                  <p className="text-xs text-slate-500 font-medium">On First Online Booking</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. QUICK APPOINTMENT WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-purple-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Quick Online Booking</h3>
                <p className="text-xs text-slate-500 font-medium">সহজেই আপনার পছন্দের তারিখ ও সার্ভিস বুকিং করুন</p>
              </div>
            </div>

            <form onSubmit={handleQuickBookingSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <select 
                value={bookingService}
                onChange={(e) => setBookingService(e.target.value)}
                className="w-full sm:w-60 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600 cursor-pointer"
                required
              >
                <option value="">Select Service...</option>
                <option value="Bridal Glow Facial">Bridal Glow Facial</option>
                <option value="Keratin Hair Rebonding">Keratin Hair Rebonding</option>
                <option value="HD Reception Makeup">HD Reception Makeup</option>
                <option value="Pedicure & Manicure Spa">Pedicure & Manicure Spa</option>
              </select>

              <input 
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full sm:w-44 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600 cursor-pointer"
                required
              />

              <button 
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-500/20 whitespace-nowrap cursor-pointer transition-all"
              >
                Continue Booking
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
              Our Expertises
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Popular Parlour Services
            </h2>
          </div>
          <Link 
            to="/services" 
            className="text-xs font-black text-purple-700 hover:text-pink-600 flex items-center gap-1 group transition-all"
          >
            View All Services <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl">
                    {service.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {service.rating} ({service.reviews})
                    </span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <Clock className="w-3.5 h-3.5" /> {service.duration}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {service.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100/80 flex items-center justify-between mt-3">
                <div>
                  <span className="text-xs text-slate-400 line-through">৳{service.oldPrice}</span>
                  <div className="text-lg font-black text-purple-700">৳{service.price}</div>
                </div>

                <Link 
                  to="/booking"
                  state={{ service: service.title }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black rounded-2xl shadow-md transition-all"
                >
                  Book Now
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <span className="px-3.5 py-1.5 bg-pink-500 text-white rounded-full text-xs font-black tracking-widest uppercase">
              Limited Time Offer
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">
              Get 25% Flat Off On <br />
              All Facial & Spa Packages!
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
              আপনার ত্বকের উজ্জ্বলতা ফিরিয়ে আনতে আজই বুকিং করুন স্পেশাল ডিটক্স ফেসিয়াল সার্ভিস।
            </p>
            <div className="pt-2">
              <Link 
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all"
              >
                Claim Offer Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="z-10">
            <img 
              src="https://images.unsplash.com/photo-1512290900673-70023421528b?w=600&q=80" 
              alt="Facial Spa Offer" 
              className="w-72 h-72 object-cover rounded-3xl border-4 border-white/20 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 5. FEATURED COSMETICS PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-purple-700 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
              Authentic Beauty Products
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Best Selling Cosmetics
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="text-xs font-black text-purple-700 hover:text-pink-600 flex items-center gap-1 group transition-all"
          >
            Visit Cosmetics Shop <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 right-3 bg-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md">
                    -{Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                  <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {product.rating}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100/80 flex items-center justify-between mt-3">
                <div>
                  <span className="text-xs text-slate-400 line-through">৳{product.regularPrice}</span>
                  <div className="text-lg font-black text-purple-700">৳{product.price}</div>
                </div>

                <button 
                  onClick={() => navigate('/cart')}
                  className="p-2.5 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-2xl transition-all cursor-pointer shadow-sm"
                  title="Add to Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="bg-gradient-to-b from-purple-50/50 to-pink-50/30 py-16 border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black text-pink-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">What Our Clients Say</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">হাজারো সন্তুষ্ট কাস্টমারের অভিজ্ঞতা ও মতামত</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{rev.name}</h4>
                    <p className="text-[10px] text-purple-600 font-semibold">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;