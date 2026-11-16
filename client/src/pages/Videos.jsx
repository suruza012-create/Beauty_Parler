import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/content/videos')
      .then(({ videos: rows = [] }) => setVideos(rows))
      .catch(requestError => setError(requestError.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6 text-center">
        <h1 className="text-3xl font-black text-slate-900">Beauty Tutorials & Demos</h1>
        {error && <p className="text-rose-600 font-bold">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.length === 0 && <p className="md:col-span-2 text-slate-500 font-bold">No videos published yet.</p>}
          {videos.map(video => <div key={video._id} className="bg-white p-4 rounded-3xl shadow-md space-y-2">
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden"><iframe title={video.title} src={video.url} className="w-full h-full" allowFullScreen /></div>
            <h3 className="text-xs font-bold text-slate-900">{video.title}</h3>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Videos;