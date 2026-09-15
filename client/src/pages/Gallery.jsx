import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Gallery = () => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80'
  ];
  const [images, setImages] = useState([]);

  useEffect(() => {
    apiGet('/content/gallery').then(({ gallery = [] }) => {
      setImages(gallery.length ? gallery.map(item => item.image) : fallbackImages);
    }).catch(() => setImages(fallbackImages));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-center text-slate-900">Photo Gallery</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="Gallery" 
              className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-all" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;