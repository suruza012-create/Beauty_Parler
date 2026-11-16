import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/content/gallery')
      .then(({ gallery = [] }) => setImages(gallery.map(item => item.image)))
      .catch(requestError => setError(requestError.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-center text-slate-900">Photo Gallery</h1>
        {error && <p className="text-center text-rose-600 font-bold">{error}</p>}
        {!error && images.length === 0 && <p className="text-center text-slate-500 font-bold">No gallery images published yet.</p>}
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