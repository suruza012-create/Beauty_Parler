import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/blog')
      .then(({ blogs: rows = [] }) => setBlogs(rows.map(blog => ({
        id: blog._id,
        title: blog.title,
        category: blog.category,
        desc: blog.excerpt,
        image: blog.image
      }))))
      .catch(requestError => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-center text-slate-900">Beauty Tips & Articles</h1>
        {loading && <p className="text-center text-slate-500 font-bold">Loading articles...</p>}
        {error && <p className="text-center text-rose-600 font-bold">{error}</p>}
        {!loading && !error && blogs.length === 0 && <p className="text-center text-slate-500 font-bold">No articles published yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map(b => (
            <div key={b.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-purple-100 p-4 space-y-3">
              <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded-2xl" />
              <span className="text-[10px] font-bold text-pink-600 uppercase bg-pink-50 px-2.5 py-1 rounded-full">{b.category}</span>
              <h3 className="font-black text-sm text-slate-900">{b.title}</h3>
              <p className="text-xs text-slate-500">{b.desc}</p>
              <Link to={`/blog/${b.id}`} className="text-xs font-bold text-purple-700 inline-block">Read More →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;