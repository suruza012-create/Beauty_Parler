import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        <Link to="/blog" className="text-xs font-bold text-purple-700">← Back to Blog</Link>
        <h1 className="text-2xl font-black text-slate-900">১০টি সহজ উপায়ে বাড়ান ত্বকের উজ্জ্বলতা</h1>
        <p className="text-xs text-slate-600 leading-relaxed">এখানে বিস্তারিত ব্লগ কনটেন্ট থাকবে...</p>
      </div>
    </div>
  );
};

export default BlogDetails;