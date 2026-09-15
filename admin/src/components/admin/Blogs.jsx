import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Sparkles, Plus, Trash2, Heart, MessageSquare, X,
  Link2, LogOut, PlusCircle, Share2, Send, Video
} from 'lucide-react';

// Safe SVG Brand Icons to avoid Lucide import errors
const FbIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IgIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YtIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Blogs = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');

  // Multi-Account Connected List State
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: [{ id: 'fb_1', username: 'Beauty Parlor Page' }],
    instagram: [{ id: 'ig_1', username: '@beautyparlor_official' }],
    tiktok: [{ id: 'tt_1', username: '@beautyparlor_bd' }],
    youtube: [{ id: 'yt_1', username: 'Beauty Parlor Channel' }]
  });

  const [activeLoginPlatform, setActiveLoginPlatform] = useState(null);
  const [loginCredentials, setLoginCredentials] = useState({ identifier: '', password: '' });

  // Feed Posts List
  const [blogsList, setBlogsList] = useState([
    {
      id: 1,
      title: 'Top 5 Bridal Makeup Trends 2026',
      titleBn: '২০২৬ সালের সেরা ৫টি ব্রাইডাল মেকআপ লুক',
      content: 'Check out full glass skin bridal glow makeup tutorial video!',
      contentBn: 'গ্লাস স্কিন ব্রাইডাল গ্লো মেকআপের সম্পূর্ণ ভিডিওটি দেখে নিন!',
      author: 'Sharmin Sultana',
      publishDate: '2026-07-22',
      mediaType: 'video', 
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-makeup-to-her-face-41584-large.mp4',
      likes: 124,
      isLiked: false,
      syncedPlatforms: ['Facebook', 'Instagram', 'TikTok'],
      comments: [
        { id: 101, user: 'Nusrat Jahan', text: 'অনেক সুন্দর ভিডিওটি!' }
      ],
      showCommentInput: false,
      newCommentText: ''
    }
  ]);

  useEffect(() => {
    api.get('/blog').then(({ data }) => {
      setBlogsList((data.blogs || []).map(blog => ({
        ...blog,
        id: blog._id || blog.id,
        publishDate: blog.publishDate || blog.createdAt?.slice(0, 10)
      })));
    }).catch(() => {});
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAccountsForPost, setSelectedAccountsForPost] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '', content: '', mediaType: 'image', selectedFile: null, previewUrl: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const filePreview = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        selectedFile: file,
        previewUrl: filePreview,
        mediaType: isVideo ? 'video' : 'image'
      }));
    }
  };

  const handleDirectLogin = (e) => {
    e.preventDefault();
    if (!loginCredentials.identifier || !loginCredentials.password) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে আইডি এবং পাসওয়ার্ড দিন!' : 'Please enter ID and Password!');
      return;
    }

    const newAccount = { id: `${activeLoginPlatform}_${Date.now()}`, username: loginCredentials.identifier };
    setSocialAccounts(prev => ({ ...prev, [activeLoginPlatform]: [...(prev[activeLoginPlatform] || []), newAccount] }));
    setLoginCredentials({ identifier: '', password: '' });
    setActiveLoginPlatform(null);
  };

  const handleLogoutAccount = (platform, accountId) => {
    setSocialAccounts(prev => ({ ...prev, [platform]: prev[platform].filter(acc => acc.id !== accountId) }));
  };

  const handleLikeToggle = (postId) => {
    setBlogsList(blogsList.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleCommentBox = (postId) => {
    setBlogsList(blogsList.map(post => {
      if (post.id === postId) {
        return { ...post, showCommentInput: !post.showCommentInput };
      }
      return post;
    }));
  };

  const handleAddComment = (postId) => {
    setBlogsList(blogsList.map(post => {
      if (post.id === postId && post.newCommentText.trim() !== '') {
        const newCmt = { id: Date.now(), user: 'You', text: post.newCommentText };
        return {
          ...post,
          comments: [...post.comments, newCmt],
          newCommentText: ''
        };
      }
      return post;
    }));
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.previewUrl) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে ফাইল সিলেক্ট করুন!' : 'Please select a file!');
      return;
    }

    const newPost = {
      id: Date.now(),
      title: formData.title,
      titleBn: formData.title,
      content: formData.content,
      contentBn: formData.content,
      author: 'Sharmin Sultana',
      publishDate: new Date().toISOString().split('T')[0],
      mediaType: formData.mediaType,
      mediaUrl: formData.previewUrl,
      likes: 0,
      isLiked: false,
      syncedPlatforms: selectedAccountsForPost,
      comments: [],
      showCommentInput: false,
      newCommentText: ''
    };

    try {
      const response = await api.post('/blog', {
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.content.slice(0, 300),
        image: newPost.mediaUrl,
        category: 'Beauty Tips',
        isPublished: true
      });
      setBlogsList(prev => [{ ...newPost, id: response.data?.blog?._id || newPost.id }, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Blog save failed:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen text-slate-800 space-y-6 font-sans max-w-5xl mx-auto">
      
      {/* 1. Connected Social Accounts Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-purple-500/5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {lang === 'bn' ? 'সোশ্যাল মিডিয়া কানেকশন হাব' : 'Social Media Connections Hub'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'bn' ? 'মাল্টিপল সোশ্যাল অ্যাকাউন্ট সিঙ্ক করুন' : 'Connect and sync multiple social platforms'}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-3 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {lang === 'bn' ? 'অটো-সিঙ্ক একটিভ' : 'Auto-Sync Active'}
          </span>
        </div>

        {/* Brand Styled Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          
          {/* Facebook Card */}
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FbIcon />
                <span className="font-bold text-xs tracking-wide">Facebook ({socialAccounts.facebook.length})</span>
              </div>
              <button 
                onClick={() => setActiveLoginPlatform('facebook')}
                className="text-[10px] font-bold bg-white/20 hover:bg-white text-white hover:text-blue-700 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer backdrop-blur-sm"
              >
                <PlusCircle className="w-3 h-3" /> {lang === 'bn' ? 'যোগ করুন' : 'Add'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {socialAccounts.facebook.map(acc => (
                <div key={acc.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 px-2 rounded-xl text-[10px] font-semibold border border-white/10">
                  <span className="truncate max-w-[100px]">{acc.username}</span>
                  <button onClick={() => handleLogoutAccount('facebook', acc.id)} className="text-rose-200 hover:text-rose-400 cursor-pointer">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram Card */}
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-rose-500/20 space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IgIcon />
                <span className="font-bold text-xs tracking-wide">Instagram ({socialAccounts.instagram.length})</span>
              </div>
              <button 
                onClick={() => setActiveLoginPlatform('instagram')}
                className="text-[10px] font-bold bg-white/20 hover:bg-white text-white hover:text-pink-600 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer backdrop-blur-sm"
              >
                <PlusCircle className="w-3 h-3" /> {lang === 'bn' ? 'যোগ করুন' : 'Add'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {socialAccounts.instagram.map(acc => (
                <div key={acc.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 px-2 rounded-xl text-[10px] font-semibold border border-white/10">
                  <span className="truncate max-w-[100px]">{acc.username}</span>
                  <button onClick={() => handleLogoutAccount('instagram', acc.id)} className="text-rose-200 hover:text-rose-400 cursor-pointer">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TikTok Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/20 space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-xs tracking-wide">TikTok ({socialAccounts.tiktok.length})</span>
              </div>
              <button 
                onClick={() => setActiveLoginPlatform('tiktok')}
                className="text-[10px] font-bold bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-slate-900 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer backdrop-blur-sm"
              >
                <PlusCircle className="w-3 h-3" /> {lang === 'bn' ? 'যোগ করুন' : 'Add'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {socialAccounts.tiktok.map(acc => (
                <div key={acc.id} className="flex items-center justify-between bg-slate-800/80 p-1.5 px-2 rounded-xl text-[10px] font-semibold border border-slate-700">
                  <span className="truncate max-w-[100px]">{acc.username}</span>
                  <button onClick={() => handleLogoutAccount('tiktok', acc.id)} className="text-rose-400 hover:text-rose-500 cursor-pointer">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Card */}
          <div className="p-3.5 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl shadow-lg shadow-red-500/20 space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <YtIcon />
                <span className="font-bold text-xs tracking-wide">YouTube ({socialAccounts.youtube.length})</span>
              </div>
              <button 
                onClick={() => setActiveLoginPlatform('youtube')}
                className="text-[10px] font-bold bg-white/20 hover:bg-white text-white hover:text-red-600 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer backdrop-blur-sm"
              >
                <PlusCircle className="w-3 h-3" /> {lang === 'bn' ? 'যোগ করুন' : 'Add'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {socialAccounts.youtube.map(acc => (
                <div key={acc.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 px-2 rounded-xl text-[10px] font-semibold border border-white/10">
                  <span className="truncate max-w-[100px]">{acc.username}</span>
                  <button onClick={() => handleLogoutAccount('youtube', acc.id)} className="text-rose-200 hover:text-rose-400 cursor-pointer">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Top Header / Create Post Action Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-5 rounded-3xl shadow-xl shadow-purple-600/15 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-amber-300 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {lang === 'bn' ? 'স্মার্ট সোশ্যাল শেয়ারিং' : 'Smart Social Sharing'}
            </h3>
            <p className="text-xs text-purple-100">
              {lang === 'bn' ? 'এক ক্লিকে সব আইডিতে আপনার সার্ভিস ভিডিও প্রকাশ করুন' : 'Broadcast your videos across all connected profiles'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-purple-700 rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          {lang === 'bn' ? 'পোস্ট করুন' : 'Create Post'}
        </button>
      </div>

      {/* 3. Feed List Display */}
      <div className="space-y-5">
        {blogsList.map((blog) => (
          <div key={blog.id} className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
            
            {/* Author Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold rounded-2xl flex items-center justify-center text-sm shadow-md shadow-purple-500/20">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{blog.author}</h4>
                  <span className="text-[10px] font-medium text-slate-400">{blog.publishDate}</span>
                </div>
              </div>
              <button onClick={() => setBlogsList(blogsList.filter(b => b.id !== blog.id))} className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Post Content */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">{lang === 'bn' ? blog.titleBn || blog.title : blog.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">{lang === 'bn' ? blog.contentBn || blog.content : blog.content}</p>
              </div>

              {/* Media View */}
              {blog.mediaUrl && (
                <div className="rounded-2xl overflow-hidden bg-black/95 border border-slate-200 shadow-inner max-h-[420px] flex items-center justify-center">
                  {blog.mediaType === 'video' ? (
                    <video 
                      src={blog.mediaUrl} 
                      controls 
                      preload="metadata"
                      className="w-full h-auto max-h-[420px] object-contain" 
                    />
                  ) : (
                    <img src={blog.mediaUrl} alt="" className="w-full h-auto max-h-[420px] object-cover" />
                  )}
                </div>
              )}

              {/* Synced Badges */}
              {blog.syncedPlatforms?.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">{lang === 'bn' ? 'অটো পোস্ট হয়েছে:' : 'Synced to:'}</span>
                  {blog.syncedPlatforms.map((acc, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-xl border border-purple-200/60 shadow-xs">
                      ✓ {acc}
                    </span>
                  ))}
                </div>
              )}

              {/* LIKE, COMMENT & SHARE BAR */}
              <div className="flex items-center justify-around border-t border-slate-100 pt-3 mt-2 text-xs font-bold text-slate-600">
                <button 
                  onClick={() => handleLikeToggle(blog.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    blog.isLiked ? 'text-rose-600 bg-rose-50 shadow-xs' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${blog.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{blog.likes} {lang === 'bn' ? 'লাইক' : 'Likes'}</span>
                </button>

                <button 
                  onClick={() => toggleCommentBox(blog.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>{blog.comments.length} {lang === 'bn' ? 'কমেন্ট' : 'Comments'}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-all">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>

              {/* COMMENT INPUT & LIST */}
              {blog.showCommentInput && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3 mt-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder={lang === 'bn' ? 'আপনার মন্তব্য লিখুন...' : 'Write a comment...'}
                      value={blog.newCommentText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlogsList(blogsList.map(b => b.id === blog.id ? { ...b, newCommentText: val } : b));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 shadow-xs"
                    />
                    <button 
                      onClick={() => handleAddComment(blog.id)}
                      className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer shadow-md shadow-purple-500/20 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {blog.comments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {blog.comments.map(cmt => (
                        <div key={cmt.id} className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs shadow-xs">
                          <span className="font-bold text-slate-900 block text-[11px]">{cmt.user}</span>
                          <span className="text-slate-600">{cmt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* 4. Login Modal */}
      {activeLoginPlatform && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase">
                {lang === 'bn' ? `${activeLoginPlatform} আইডি যোগ করুন` : `Add ${activeLoginPlatform} ID`}
              </h3>
              <button onClick={() => setActiveLoginPlatform(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'আইডি / ইমেইল / নম্বর' : 'ID / Email / Number'}
                </label>
                <input 
                  type="text" 
                  required
                  value={loginCredentials.identifier}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, identifier: e.target.value })}
                  placeholder="e.g. page_id or username"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <input 
                  type="password" 
                  required
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/20 cursor-pointer transition-all mt-2">
                {lang === 'bn' ? 'লগইন ও সিঙ্ক করুন' : 'Login & Sync'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create Post Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {lang === 'bn' ? 'নতুন পোস্ট ও অটো-পাবলিশ' : 'New Post & Auto-Publish'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'bn' ? 'টাইটেল' : 'Title'}</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'bn' ? 'বিবরণ' : 'Caption'}</label>
                <textarea 
                  rows="3"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'bn' ? 'ফাইল নির্বাচন করুন (ভিডিও/ছবি)' : 'Upload Media (Video/Image)'}</label>
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl cursor-pointer">
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 cursor-pointer">
                  {lang === 'bn' ? 'পাবলিশ করুন' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blogs;