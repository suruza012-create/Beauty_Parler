import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Package, Search, Filter, Eye, Trash2, Printer, 
  Truck, CheckCircle2, Clock, XCircle, DollarSign, 
  X, User, Phone, MapPin, Send, ExternalLink, Calendar,
  ShoppingBag, RefreshCw, AlertTriangle, Sparkles
} from 'lucide-react';

const Orders = () => {
  const outletContext = useOutletContext();
  const lang = Array.isArray(outletContext) ? outletContext[0] : (outletContext?.lang || 'en');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/order').then(({ data }) => {
      setOrders((data.orders || []).map(order => ({
        ...order,
        id: order._id || order.id,
        customerName: order.userId?.name || order.customerName || 'Guest',
        phone: order.phone || '',
        address: typeof order.deliveryAddress === 'string'
          ? order.deliveryAddress
          : [order.deliveryAddress?.street, order.deliveryAddress?.city, order.deliveryAddress?.postalCode].filter(Boolean).join(', '),
        grandTotal: order.totalAmount || order.grandTotal || 0,
        deliveryStatus: (order.orderStatus || order.deliveryStatus || order.status || 'pending') === 'processing'
          ? 'Pending'
          : String(order.orderStatus || order.deliveryStatus || order.status || 'pending')
            .replace(/\b\w/g, character => character.toUpperCase()),
        paymentStatus: order.paymentStatus === 'paid' ? 'Paid'
          : order.paymentStatus === 'refunded' ? 'Refunded' : 'Unpaid',
        items: (order.items || []).map(item => ({ ...item, qty: item.quantity || item.qty || 0 })),
        paymentMethod: order.paymentMethod || 'cash',
        date: order.createdAt?.slice(0, 10) || '',
        notes: order.note || '',
        courier: order.courier || '',
        trackingId: order.trackingId || ''
      })));
    }).catch(requestError => setError(requestError.response?.data?.message || requestError.message));
  }, []);

  // Analytics Calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.deliveryStatus === 'Pending').length;
  const deliveredOrdersCount = orders.filter(o => o.deliveryStatus === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.grandTotal : 0), 0);

  // Status Change Handler
  const handleStatusChange = async (id, field, value) => {
    const endpoint = field === 'paymentStatus' ? 'payment' : 'status';
    const payload = field === 'paymentStatus'
      ? { paymentStatus: value === 'Unpaid' ? 'pending' : value.toLowerCase() }
      : { orderStatus: value.toLowerCase() };
    try {
      await api.put(`/order/${id}/${endpoint}`, payload);
      setOrders(previous => previous.map(order => order.id === id ? { ...order, [field]: value } : order));
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  // Courier Tracking Change Handler
  const handleTrackingChange = (id, trackingId) => {
    setOrders(previous => previous.map(order => order.id === id ? { ...order, trackingId } : order));
  };

  const handleTrackingSave = async (order, trackingId = order.trackingId) => {
    try {
      await api.put(`/order/${order.id}/status`, { courier: order.courier, trackingId });
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id) => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এই অর্ডারটি ডিলিট করতে চান?' : 'Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/order/${id}`);
        setOrders(previous => previous.filter(order => order.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      }
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'All' || order.deliveryStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-purple-50/40 to-pink-50/30 min-h-screen text-slate-800 space-y-6 font-sans max-w-7xl mx-auto">
      
      {/* 1. Colorful Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-900 text-white p-6 rounded-3xl shadow-2xl shadow-purple-900/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4 z-10">
          <div className="p-3.5 bg-gradient-to-tr from-pink-500 to-purple-500 text-white rounded-2xl shadow-lg shadow-pink-500/30">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {lang === 'bn' ? 'কসমোটিক্স অর্ডার ড্যাশবোর্ড' : 'Cosmetics Orders Dashboard'}
              </h1>
              <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <p className="text-xs text-purple-200/80 font-medium mt-0.5">
              {lang === 'bn' ? 'অর্ডার ট্র্যাক করুন, কুরিয়ার এন্ট্রি দিন ও ইনভয়েস প্রিন্ট করুন' : 'Monitor shipping, delivery statuses, courier IDs, and payment steps'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10">
          <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            {lang === 'bn' ? 'সার্ভার সচল আছে' : 'Server Live'}
          </span>
        </div>
      </div>

      {/* 2. Vibrant Colorful Analytics Summary Cards */}
      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Orders - Vibrant Blue */}
        <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl shadow-xl shadow-blue-500/20 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">{lang === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}</p>
              <h3 className="text-3xl font-black mt-1">{totalOrdersCount}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pending Orders - Vibrant Amber/Orange */}
        <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl shadow-xl shadow-amber-500/20 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">{lang === 'bn' ? 'অপেক্ষমাণ অর্ডার' : 'Pending Orders'}</p>
              <h3 className="text-3xl font-black mt-1">{pendingOrdersCount}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Delivered Orders - Vibrant Emerald */}
        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl shadow-emerald-500/20 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">{lang === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}</p>
              <h3 className="text-3xl font-black mt-1">{deliveredOrdersCount}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Revenue - Vibrant Purple/Pink */}
        <div className="p-5 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl shadow-xl shadow-purple-500/20 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-100 uppercase tracking-wider">{lang === 'bn' ? 'মোট আয় (পেইড)' : 'Total Revenue'}</p>
              <h3 className="text-3xl font-black mt-1">৳{totalRevenue}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Search and Colorful Filter Toolbar */}
      <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-lg shadow-purple-500/5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
          <input 
            type="text" 
            placeholder={lang === 'bn' ? 'অর্ডার আইডি বা কাস্টমার সার্চ...' : 'Search by ID, Customer or Phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Dynamic Colorful Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { name: 'All', color: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-slate-900/20' },
            { name: 'Pending', color: 'bg-amber-500 text-white shadow-amber-500/30' },
            { name: 'Shipped', color: 'bg-blue-600 text-white shadow-blue-500/30' },
            { name: 'Delivered', color: 'bg-emerald-600 text-white shadow-emerald-500/30' },
            { name: 'Cancelled', color: 'bg-rose-600 text-white shadow-rose-500/30' }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSelectedStatus(tab.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                selectedStatus === tab.name 
                  ? `${tab.color} shadow-lg scale-105` 
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {tab.name === 'All' ? (lang === 'bn' ? 'সব অর্ডার' : 'All') : tab.name}
            </button>
          ))}
        </div>

      </div>

      {/* 4. Styled Orders Table with Vibrant Badges */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-purple-500/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-purple-50/40 border-b border-slate-100 text-[11px] uppercase font-black text-slate-500 tracking-wider">
                <th className="p-4">{lang === 'bn' ? 'অর্ডার আইডি' : 'ORDER ID'}</th>
                <th className="p-4">{lang === 'bn' ? 'কাস্টমার' : 'CUSTOMER'}</th>
                <th className="p-4">{lang === 'bn' ? 'প্রোডাক্ট সমুহ' : 'PRODUCTS'}</th>
                <th className="p-4">{lang === 'bn' ? 'মোট টাকা' : 'GRAND TOTAL'}</th>
                <th className="p-4">{lang === 'bn' ? 'ডেলিভারি স্ট্যাটাস' : 'DELIVERY STATUS'}</th>
                <th className="p-4">{lang === 'bn' ? 'পেমেন্ট' : 'PAYMENT'}</th>
                <th className="p-4">{lang === 'bn' ? 'কুরিয়ার ট্র্যাকিং' : 'COURIER TRACKING'}</th>
                <th className="p-4 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'ACTIONS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-50/30 transition-colors">
                    
                    {/* ID */}
                    <td className="p-4 font-black text-purple-700 bg-purple-50/20">{order.id}</td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{order.phone}</div>
                    </td>

                    {/* Products Summary */}
                    <td className="p-4 max-w-[180px]">
                      <div className="truncate font-semibold text-slate-700">
                        {order.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg">{order.items.length} Items</span>
                    </td>

                    {/* Total Price */}
                    <td className="p-4 font-black text-slate-900 text-sm">৳{order.grandTotal}</td>

                    {/* Delivery Status Dropdown Badge */}
                    <td className="p-4">
                      <select 
                        value={order.deliveryStatus}
                        onChange={(e) => handleStatusChange(order.id, 'deliveryStatus', e.target.value)}
                        className={`px-3 py-1.5 rounded-2xl text-[11px] font-black border-2 focus:outline-none cursor-pointer shadow-sm transition-all ${
                          order.deliveryStatus === 'Delivered' ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20' :
                          order.deliveryStatus === 'Shipped' ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20' :
                          order.deliveryStatus === 'Cancelled' ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20' :
                          'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                        }`}
                      >
                        <option value="Pending" className="text-slate-900 bg-white">Pending</option>
                        <option value="Shipped" className="text-slate-900 bg-white">Shipped</option>
                        <option value="Delivered" className="text-slate-900 bg-white">Delivered</option>
                        <option value="Cancelled" className="text-slate-900 bg-white">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Status Dropdown Badge */}
                    <td className="p-4">
                      <select 
                        value={order.paymentStatus}
                        onChange={(e) => handleStatusChange(order.id, 'paymentStatus', e.target.value)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-black border focus:outline-none cursor-pointer ${
                          order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Unpaid" className="text-slate-900 bg-white">Unpaid</option>
                        <option value="Paid" className="text-slate-900 bg-white">Paid</option>
                      </select>
                      <div className="text-[9px] font-bold text-slate-400 mt-1">{order.paymentMethod}</div>
                    </td>

                    {/* Courier Tracking */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-800 text-white rounded-xl">{order.courier}</span>
                        <input 
                          type="text" 
                          placeholder="Tracking ID"
                          value={order.trackingId}
                          onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                          onBlur={(e) => handleTrackingSave(order, e.target.value)}
                          className="w-24 px-2 py-1 text-[10px] font-bold bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          title="View Invoice"
                          className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete Order"
                          className="p-2 bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-purple-300 animate-bounce" />
                    <p className="font-bold text-sm">{lang === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি!' : 'No orders found!'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Invoice & Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-400" />
                <h3 className="font-extrabold text-sm">
                  {lang === 'bn' ? `চালান ইনভয়েস (${selectedOrder.id})` : `Order Invoice (${selectedOrder.id})`}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-purple-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <User className="w-3.5 h-3.5 text-purple-600" /> {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-purple-600" /> {selectedOrder.phone}
                  </div>
                  <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> {selectedOrder.address}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">{lang === 'bn' ? 'তারিখ:' : 'Date:'}</span> <span className="font-black">{selectedOrder.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">{lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment:'}</span> <span className="font-black">{selectedOrder.paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">{lang === 'bn' ? 'কুরিয়ার:' : 'Courier:'}</span> <span className="font-black">{selectedOrder.courier} ({selectedOrder.trackingId || 'N/A'})</span></div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-black text-xs text-slate-900 mb-2">{lang === 'bn' ? 'অর্ডারকৃত আইটেমস' : 'Ordered Items'}</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-bold">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-slate-900 font-bold">{item.name}</td>
                          <td className="p-3 text-center font-black">{item.qty}</td>
                          <td className="p-3 text-right">৳{item.price}</td>
                          <td className="p-3 text-right font-black text-purple-700">৳{item.price * item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200/80 w-full sm:w-1/2">
                  <span className="font-bold block text-amber-800 mb-0.5">{lang === 'bn' ? 'অর্ডার নোট:' : 'Order Note:'}</span>
                  {selectedOrder.notes || (lang === 'bn' ? 'কোনো নোট নেই।' : 'No note provided.')}
                </div>

                <div className="w-full sm:w-1/3 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold">৳{selectedOrder.grandTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charge:</span>
                    <span className="font-bold">৳0</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                    <span>Grand Total:</span>
                    <span className="text-purple-700 font-black">৳{selectedOrder.grandTotal}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => window.print()} 
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-500/30 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" /> {lang === 'bn' ? 'প্রিন্ট ইনভয়েস' : 'Print Invoice'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;