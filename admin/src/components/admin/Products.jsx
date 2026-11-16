import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Package, Plus, Search, Edit3, Trash2, Sparkles, 
  Layers, CheckCircle2, AlertTriangle, ShoppingBag, 
  Upload, X, Image as ImageIcon
} from 'lucide-react';

// ==========================================
// ১. প্রোডাক্ট অ্যাড ও এডিট মোডাল (Modal Component)
// ==========================================
const ProductModal = ({ isOpen, onClose, onSave, editProduct, lang = 'en' }) => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Skin Care',
    skinType: 'All Skin Types',
    regularPrice: '',
    salePrice: '',
    stock: '',
    sku: '',
    description: '',
    ingredients: '',
    status: 'Active'
  });

  // এডিট মোডে থাকলে পূর্বের ডেটা লোড করার ইফেক্ট
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        brand: editProduct.brand || '',
        category: editProduct.category || 'Skin Care',
        skinType: editProduct.skinType || 'All Skin Types',
        regularPrice: editProduct.regularPrice || '',
        salePrice: editProduct.salePrice || '',
        stock: editProduct.stock || '',
        sku: editProduct.sku || '',
        description: editProduct.description || '',
        ingredients: editProduct.ingredients || '',
        status: editProduct.status || 'Active'
      });
      setImages(editProduct.image ? [editProduct.image] : []);
    } else {
      // রিসেট ফরম
      setFormData({
        name: '', brand: '', category: 'Skin Care', skinType: 'All Skin Types',
        regularPrice: '', salePrice: '', stock: '', sku: '', description: '', ingredients: '', status: 'Active'
      });
      setImages([]);
    }
  }, [editProduct, isOpen]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, images, imageFiles: Array.from(document.querySelectorAll('input[type="file"]')).flatMap(input => Array.from(input.files || [])), id: editProduct ? editProduct.id : Date.now() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide">
                {editProduct 
                  ? (lang === 'bn' ? 'প্রোডাক্ট এডিট করুন' : 'Edit Product')
                  : (lang === 'bn' ? 'নতুন কসমেটিকস প্রোডাক্ট যোগ করুন' : 'Add New Cosmetic Product')}
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                {lang === 'bn' ? 'ছবি, প্রাইস এবং স্টক লেভেল পরিবর্তন করুন' : 'Update photos, pricing & inventory info'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-2xl text-purple-200 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs font-medium text-slate-700">
          
          {/* Images */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              {lang === 'bn' ? 'প্রোডাক্ট ছবি' : 'Product Images'}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-purple-200 aspect-square shadow-sm">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-100/50 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all gap-1 text-purple-600">
                  <Upload className="w-6 h-6 animate-pulse" />
                  <span className="text-[10px] font-bold">{lang === 'bn' ? 'ছবি দিন' : 'Upload'}</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">{lang === 'bn' ? 'প্রোডাক্টের নাম *' : 'Product Name *'}</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. L'Oreal Hair Spa Cream"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-purple-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">{lang === 'bn' ? 'ব্র্যান্ড নাম' : 'Brand Name'}</label>
              <input 
                type="text" 
                placeholder="e.g. L'Oréal Paris, MAC"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full p-3 bg-purple-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">{lang === 'bn' ? 'ক্যাটাগরি *' : 'Category *'}</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 bg-purple-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer font-bold"
              >
                <option value="Skin Care">Skin Care (স্কিন কেয়ার)</option>
                <option value="Hair Care">Hair Care (হেয়ার কেয়ার)</option>
                <option value="Makeup">Makeup & Cosmetics (মেকআপ)</option>
                <option value="Facial Kits">Facial Kits (ফেসিয়াল কিট)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">{lang === 'bn' ? 'স্কিন/হেয়ার টাইপ' : 'Suitable Type'}</label>
              <select 
                value={formData.skinType}
                onChange={(e) => setFormData({...formData, skinType: e.target.value})}
                className="w-full p-3 bg-purple-50/30 border border-slate-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
              >
                <option value="All Skin Types">All Skin Types</option>
                <option value="Oily Skin">Oily Skin</option>
                <option value="Dry Skin">Dry Skin</option>
                <option value="Damaged Hair">Damaged Hair</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-br from-purple-50 to-pink-50/50 p-4 rounded-3xl border border-purple-100">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">{lang === 'bn' ? 'রেগুলার প্রাইস (৳)' : 'Regular Price (৳)'}</label>
              <input 
                type="number" 
                placeholder="1200"
                value={formData.regularPrice}
                onChange={(e) => setFormData({...formData, regularPrice: e.target.value})}
                className="w-full p-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-purple-700">{lang === 'bn' ? 'অফার প্রাইজ (৳)' : 'Sale Price (৳)'}</label>
              <input 
                type="number" 
                placeholder="950"
                value={formData.salePrice}
                onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                className="w-full p-2.5 bg-white border border-purple-400 rounded-xl focus:outline-none font-black text-purple-700"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">{lang === 'bn' ? 'স্টক সংখ্যা' : 'Stock Qty'}</label>
              <input 
                type="number" 
                placeholder="25"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full p-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">{lang === 'bn' ? 'SKU কোড' : 'SKU Code'}</label>
              <input 
                type="text" 
                placeholder="SKU-8820"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full p-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none font-semibold uppercase"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button 
              type="submit"
              className="px-7 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editProduct 
                ? (lang === 'bn' ? 'আপডেট করুন' : 'Update Product') 
                : (lang === 'bn' ? 'প্রোডাক্ট সেভ করুন' : 'Save Product')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ==========================================
// ২. মূল প্রোডাক্টস পেজ (Products Main Component)
// ==========================================
const Products = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // এডিট অবজেক্ট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [products, setProducts] = useState([]);

  const [loadError, setLoadError] = useState('');
  const loadProducts = async () => {
    const { data } = await api.get('/product/manage');
    setProducts((data.products || []).map(product => ({
      ...product,
      id: product._id || product.id,
      sku: product.sku || product._id,
      category: product.category === 'Skincare' ? 'Skin Care'
        : product.category === 'Haircare' ? 'Hair Care'
          : product.category === 'Nailcare' ? 'Nail Care' : product.category,
      salePrice: product.price,
      regularPrice: product.discount && product.discount < 100
        ? Math.round(product.price / (1 - product.discount / 100))
        : product.price,
      image: product.images?.[0] || product.image || ''
    })));
  };

  useEffect(() => {
    loadProducts().catch(error => setLoadError(error.response?.data?.message || error.message));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.sku).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // নতুন প্রোডাক্ট অ্যাড বা আগেরটি আপডেট করার হ্যান্ডলার
  const handleSaveProduct = async (productData) => {
    try {
      let imgUrl = productData.images?.[0] || productData.image || 'default-product.jpg';
      if (productData.imageFiles?.[0]) {
        const uploadData = new FormData();
        uploadData.append('file', productData.imageFiles[0]);
        const uploadResponse = await api.post('/upload', uploadData);
        imgUrl = uploadResponse.data.url;
      }
      const categoryMap = {
        'Skin Care': 'Skincare',
        'Hair Care': 'Haircare',
        'Nail Care': 'Nailcare',
        Makeup: 'Makeup',
        'Facial Kits': 'Skincare'
      };
      const payload = {
        name: productData.name,
        brand: productData.brand,
        category: categoryMap[productData.category] || 'Other',
        description: productData.description || productData.name,
        price: Number(productData.salePrice || productData.regularPrice || 0),
        stock: Number(productData.stock || 0),
        image: imgUrl,
        weight: productData.skinType || '',
        discount: productData.regularPrice && productData.salePrice
          ? Math.min(99, Math.max(0, Math.round((1 - productData.salePrice / productData.regularPrice) * 100)))
          : 0
      };
      if (editingProduct) {
        await api.put(`/product/${editingProduct.id}`, payload);
      } else {
        await api.post('/product', payload);
      }
      await loadProducts();
      setLoadError('');
      setEditingProduct(null);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message);
    }
  };

  // এডিট বাটনে ক্লিকে মোডাল খোলা
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // নিউ প্রোডাক্ট বাটন
  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(lang === 'bn' ? 'প্রোডাক্টটি ডিলিট করতে চান?' : 'Delete this product?')) {
      api.delete(`/product/${id}`)
        .then(() => setProducts(previous => previous.filter(product => product.id !== id)))
        .catch(error => setLoadError(error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-purple-50/50 to-pink-50/40 min-h-screen text-slate-800 space-y-6 font-sans max-w-7xl mx-auto">
      {loadError && <p className="text-sm font-bold text-rose-600">{loadError}</p>}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-800/30">
        <div className="flex items-center gap-4 z-10">
          <div className="p-3.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl shadow-lg">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {lang === 'bn' ? 'কসমেটিকস প্রোডাক্ট লিস্ট' : 'Cosmetics Inventory'}
              </h1>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <p className="text-xs text-purple-200/80 font-medium mt-0.5">
              {lang === 'bn' ? 'স্টক, ক্যাটাগরি ও অফার প্রাইসিং ম্যানেজ করুন' : 'Manage salon products, stock levels, and discounts'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleAddNewClick}
          className="z-10 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {lang === 'bn' ? 'নতুন প্রোডাক্ট যোগ করুন' : 'Add New Product'}
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-100 uppercase">{lang === 'bn' ? 'মোট প্রোডাক্ট' : 'Total Items'}</p>
            <h3 className="text-3xl font-black mt-1">{products.length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><ShoppingBag className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-100 uppercase">{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</p>
            <h3 className="text-3xl font-black mt-1">{products.filter(p => p.stock > 5).length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-100 uppercase">{lang === 'bn' ? 'স্টক কম' : 'Low Stock'}</p>
            <h3 className="text-3xl font-black mt-1">{products.filter(p => p.stock <= 5).length}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><AlertTriangle className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-pink-100 uppercase">{lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</p>
            <h3 className="text-3xl font-black mt-1">4</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Layers className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Filter Controls with Multi-language Support */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-purple-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
          <input 
            type="text" 
            placeholder={lang === 'bn' ? 'প্রোডাক্টের নাম বা SKU খুঁজুন...' : 'Search product or SKU...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'All', en: 'All', bn: 'সব' },
            { id: 'Skin Care', en: 'Skin Care', bn: 'স্কিন কেয়ার' },
            { id: 'Hair Care', en: 'Hair Care', bn: 'হেয়ার কেয়ার' },
            { id: 'Makeup', en: 'Makeup', bn: 'মেকআপ' },
            { id: 'Facial Kits', en: 'Facial Kits', bn: 'ফেসিয়াল কিট' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
              }`}
            >
              {lang === 'bn' ? cat.bn : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product, index) => (
          <div key={product.id || product.sku || `${product.name || 'product'}-${index}`} className="bg-white rounded-3xl border border-purple-100/80 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-xl">
                {lang === 'bn' ? (
                  product.category === 'Skin Care' ? 'স্কিন কেয়ার' :
                  product.category === 'Hair Care' ? 'হেয়ার কেয়ার' :
                  product.category === 'Makeup' ? 'মেকআপ' :
                  product.category === 'Facial Kits' ? 'ফেসিয়াল কিট' : product.category
                ) : product.category}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>{product.brand}</span>
                  <span className="font-mono text-purple-700 font-bold">{product.sku}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2 group-hover:text-purple-700 transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">৳{product.regularPrice}</div>
                  <div className="text-lg font-black text-purple-700">৳{product.salePrice}</div>
                </div>

                <div>
                  {product.stock <= 5 ? (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-[10px] font-black flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> {lang === 'bn' ? `মাত্র ${product.stock} টি বাকি` : `Only ${product.stock} Left`}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[10px] font-black">
                      {lang === 'bn' ? `স্টকে আছে (${product.stock})` : `In Stock (${product.stock})`}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons with Edit Click Handling */}
              <div className="pt-2 flex items-center gap-2">
                <button 
                  onClick={() => handleEditClick(product)}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {lang === 'bn' ? 'এডিট' : 'Edit'}
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-2xl transition-all cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Modal Integration */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        onSave={handleSaveProduct}
        editProduct={editingProduct}
        lang={lang}
      />

    </div>
  );
};

export default Products;