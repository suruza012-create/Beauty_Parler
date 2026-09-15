import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag, Menu, X, Calendar } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Glow&Grace
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-purple-600 transition-colors">Services</Link>
            <Link to="/shop" className="hover:text-purple-600 transition-colors">Cosmetics</Link>
            <Link to="/gallery" className="hover:text-purple-600 transition-colors">Gallery</Link>
            <Link to="/blog" className="hover:text-purple-600 transition-colors">Blog</Link>
            <Link to="/about" className="hover:text-purple-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="p-2.5 bg-slate-100 hover:bg-purple-50 text-slate-700 rounded-2xl transition-all relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
            </Link>
            <button 
              onClick={() => navigate('/booking')} 
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Now
            </button>
            <Link to="/login" className="text-xs font-bold text-purple-700 hover:underline">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-6 py-4 space-y-3 text-xs font-bold text-slate-700">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-1">Home</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block py-1">Services</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-1">Cosmetics</Link>
          <Link to="/booking" onClick={() => setIsOpen(false)} className="block py-1 text-pink-600">Book Appointment</Link>
          <Link to="/gallery" onClick={() => setIsOpen(false)} className="block py-1">Gallery</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="block py-1">Blog</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block py-1">About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-1">Contact</Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-purple-700">Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="text-pink-600">Register</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;