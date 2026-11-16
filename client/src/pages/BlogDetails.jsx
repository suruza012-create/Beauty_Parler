import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet } from '../utils/api';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/blog/${id}`)
      .then(({ blog: row }) => setBlog(row))
      .catch(requestError => setError(requestError.message));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        <Link to="/blog" className="text-xs font-bold text-purple-700">← Back to Blog</Link>
        {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
        {!blog && !error && <p className="text-sm font-bold text-slate-500">Loading article...</p>}
        {blog && <>
          <h1 className="text-2xl font-black text-slate-900">{blog.title}</h1>
          <p className="text-xs text-slate-600 leading-relaxed">{blog.content || blog.excerpt}</p>
        </>}
      </div>
    </div>
  );
};

export default BlogDetails;