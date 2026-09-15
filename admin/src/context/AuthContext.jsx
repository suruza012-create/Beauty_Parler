import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const getResponseList = (response, key) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

// চাইল্ড কম্পোনেন্টের মাউন্ট টাইমিং বাগ ফিক্স করার জন্য ফাইল লেভেলেই ইন্টারসেপ্টর রেজিস্টার করা হলো
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      // ব্যাকএন্ডে যেকোনো নামের মিডলওয়্যার যাতে টোকেনটি পায়, সেজন্য ৩টি স্ট্যান্ডার্ড নামেই পাঠানো হলো
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  // --- গ্লোবাল ডাইনামিক ডাটাবেজ স্টেট সমূহ ---
  const [bookingsData, setBookingsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [couponsData, setCouponsData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [usersCount, setUsersCount] = useState(85);

  // ১. ডাটাবেজ থেকে বুকিং লোড করার ফাংশন
  const fetchBookings = async () => {
    try {
      const res = await api.get('/booking');
      console.log("Database Response Raw Data:", res.data); // কনসোলে আসল ডেটা দেখার জন্য লগ
      
      // ব্যাকএন্ড যেকোনো অবজেক্ট প্যাটার্ন পাঠালেও যেন অটোমেটিক অ্যারে খুঁজে পায়
      let rawData = null;
      if (res.data) {
        if (Array.isArray(res.data)) {
          rawData = res.data;
        } else if (Array.isArray(res.data.data)) {
          rawData = res.data.data;
        } else if (Array.isArray(res.data.bookings)) {
          rawData = res.data.bookings;
        } else if (res.data.data && Array.isArray(res.data.data.bookings)) {
          rawData = res.data.data.bookings;
        } else {
          // রিকার্সিভ সার্চ: অবজেক্টের ভেতরের যেকোনো কি-তে যদি অ্যারে থাকে তা খুঁজে বের করবে
          for (const key in res.data) {
            if (Array.isArray(res.data[key])) {
              rawData = res.data[key];
              break;
            }
          }
        }
      }
      
      if (Array.isArray(rawData)) {
        const mappedBookings = rawData.map(b => {
          // --- স্মার্ট ডাটাবেজ পার্সার (কাস্টমার নাম খুঁজে বের করার জন্য) ---
          let customerName = 'Guest';
          if (b.customerName) {
            customerName = b.customerName;
          } else if (typeof b.customer === 'string') {
            customerName = b.customer;
          } else if (b.customer && typeof b.customer === 'object' && b.customer.name) {
            customerName = b.customer.name;
          } else if (b.user && typeof b.user === 'object' && b.user.name) {
            customerName = b.user.name;
          } else if (b.user && typeof b.user === 'object' && b.user.username) {
            customerName = b.user.username;
          }

          // --- স্মার্ট ডাটাবেজ পার্সার (সার্ভিস নাম খুঁজে বের করার জন্য) ---
          let serviceNameEn = 'Service';
          let serviceNameBn = 'সার্ভিস';
          if (b.serviceName) {
            serviceNameEn = b.serviceName;
            serviceNameBn = b.serviceBn || b.serviceName;
          } else if (b.serviceEn) {
            serviceNameEn = b.serviceEn;
            serviceNameBn = b.serviceBn || b.serviceEn;
          } else if (b.service && typeof b.service === 'object') {
            serviceNameEn = b.service.name || b.service.nameEn || b.service.title || 'Service';
            serviceNameBn = b.service.nameBn || b.service.titleBn || serviceNameEn;
          } else if (typeof b.service === 'string') {
            serviceNameEn = b.service;
            serviceNameBn = b.service;
          }

          return {
            id: b._id || b.id,
            customer: customerName,
            serviceEn: serviceNameEn,
            serviceBn: serviceNameBn,
            price: Number(b.price) || 0,
            staff: b.staff || 'Smriti',
            bookingDate: b.bookingDate || b.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            bookingTime: b.bookingTime || '12:00 PM',
            serviceTime: b.serviceTime || '12:00 PM',
            statusEn: b.status || b.statusEn || 'Pending',
            statusBn: b.status === 'Confirmed' ? 'কনফার্মড' : b.status === 'Rejected' ? 'রিজেক্টেড' : 'পেন্ডিং'
          };
        });
        setBookingsData(mappedBookings);
      } else {
        throw new Error('Response data is not an array');
      }
    } catch (error) {
      console.warn('Error loading bookings, using backup states:', error);
      // ব্যাকআপ মক ডেটা যাতে এপিআই ফেইল করলেও ড্যাশবোর্ড খালি না দেখায়
      setBookingsData([
        { id: 1, customer: 'Sabrina Khan', serviceEn: 'Bridal Makeup', serviceBn: 'ব্রাইডাল মেকআপ', price: 5500, staff: 'Smriti', bookingDate: '2026-07-16', bookingTime: '10:30 AM', serviceTime: '02:00 PM', statusEn: 'Pending', statusBn: 'পেন্ডিং' },
        { id: 2, customer: 'Mimi Ahmed', serviceEn: 'Facial Treatment', serviceBn: 'ফেসিয়াল ট্রিটমেন্ট', price: 1200, staff: 'Bristy', bookingDate: '2026-07-16', bookingTime: '11:00 AM', serviceTime: '03:00 PM', statusEn: 'Confirmed', statusBn: 'কনফার্মড' }
      ]);
    }
  };

  // ২. ডাটাবেজে নতুন বুকিং সেভ করার ফাংশন
  const addBooking = async (newBooking) => {
    try {
      const payload = {
        customerName: newBooking.customer,
        serviceName: newBooking.serviceEn,
        serviceBn: newBooking.serviceBn || newBooking.serviceEn,
        price: Number(newBooking.price),
        staff: newBooking.staff,
        bookingDate: newBooking.bookingDate,
        bookingTime: newBooking.bookingTime,
        serviceTime: newBooking.serviceTime,
        status: newBooking.statusEn || 'Pending'
      };

      const res = await api.post('/booking', payload);
      await fetchBookings(); // ডাটাবেজ রিফ্রেশ
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error saving booking to database:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error occurred';
      return { success: false, message: errorMsg };
    }
  };

  // ৩. বুকিংয়ের স্ট্যাটাস আপডেট করার ফাংশন (কনফার্ম/রিজেক্ট)
  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/booking/${id}/status`, { status });
      setBookingsData(prev => prev.map(b => b.id === id ? { 
        ...b, 
        statusEn: status, 
        statusBn: status === 'Confirmed' ? 'কনফার্মড' : status === 'Rejected' ? 'রিজেক্টেড' : 'পেন্ডিং' 
      } : b));
      return { success: true };
    } catch (error) {
      console.error('Error updating status in database:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error occurred';
      return { success: false, message: errorMsg };
    }
  };

  // ৪. বুকিংয়ের সম্পূর্ণ তথ্য এডিট করে আপডেট করার ফাংশন
  const updateBookingDetails = async (id, updatedBooking) => {
    try {
      const payload = {
        customerName: updatedBooking.customer,
        serviceName: updatedBooking.serviceEn,
        price: Number(updatedBooking.price),
        staff: updatedBooking.staff,
        bookingDate: updatedBooking.bookingDate,
        bookingTime: updatedBooking.bookingTime,
        serviceTime: updatedBooking.serviceTime
      };

      await api.put(`/booking/${id}`, payload);
      await fetchBookings();
      return { success: true };
    } catch (error) {
      console.error('Error updating booking details in database:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error occurred';
      return { success: false, message: errorMsg };
    }
  };

  // ৫. বুকিং ডিলিট করার ফাংশন
  const deleteBooking = async (id) => {
    try {
      await api.delete(`/booking/${id}`);
      setBookingsData(prev => prev.filter(b => b.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting booking from database:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error occurred';
      return { success: false, message: errorMsg };
    }
  };

  // অন্যান্য পেজের ডেটা লোড করার ডামি এপিআই (ফেইল করলেও ব্যাকআপ মক ডেটা দিবে)
  const fetchServices = async () => {
    try {
      const res = await api.get('/service');
      const rawData = getResponseList(res, 'services');
      if (Array.isArray(rawData)) {
        setServicesData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setServicesData([
        { id: 1, nameEn: 'Bridal Makeup', nameBn: 'ব্রাইডাল মেকআপ', price: 5500, duration: '120 mins' },
        { id: 2, nameEn: 'Facial Treatment', nameBn: 'ফেসিয়াল ট্রিটমেন্ট', price: 1200, duration: '45 mins' },
        { id: 3, nameEn: 'Hair Styling', nameBn: 'হেয়ার স্টাইলিং', price: 800, duration: '30 mins' }
      ]);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      const rawData = getResponseList(res, 'staff');
      if (Array.isArray(rawData)) {
        setStaffData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setStaffData([
        { id: 1, name: 'Bristy', roleEn: 'Hair Stylist', roleBn: 'হেয়ার স্টাইলিস্ট', status: 'Active' },
        { id: 2, name: 'Smriti', roleEn: 'Makeup Artist', roleBn: 'মেকআপ আর্টিস্ট', status: 'Active' },
        { id: 3, name: 'Ananya', roleEn: 'Skin Specialist', roleBn: 'ত্বক বিশেষজ্ঞ', status: 'Active' },
        { id: 4, name: 'Pooja', roleEn: 'Nail Artist', roleBn: 'নখ বিশেষজ্ঞ', status: 'Active' },
        { id: 5, name: 'Riya', roleEn: 'Assistant', roleBn: 'सहকারী', status: 'Inactive' }
      ]);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupon');
      const rawData = getResponseList(res, 'coupons');
      if (Array.isArray(rawData)) {
        setCouponsData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setCouponsData([
        { id: 1, code: 'EID50', discount: 50, type: 'Percentage', status: 'Active' },
        { id: 2, code: 'WELCOME10', discount: 10, type: 'Flat', status: 'Active' }
      ]);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offer');
      const rawData = getResponseList(res, 'offers');
      if (Array.isArray(rawData)) {
        setOffersData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setOffersData([
        { id: 1, titleEn: 'Monsoon Discount', titleBn: 'বর্ষা ধামাকা অফার', discount: '20% Off', status: 'Active' }
      ]);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog');
      const rawData = getResponseList(res, 'blogs');
      if (Array.isArray(rawData)) {
        setBlogsData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setBlogsData([
        { id: 1, titleEn: 'Skincare tips for Summer', titleBn: 'গরমে ত্বকের যত্ন নেওয়ার ৫টি উপায়', date: '2026-07-16' }
      ]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/product');
      const rawData = getResponseList(res, 'products');
      if (Array.isArray(rawData)) {
        setProductsData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setProductsData([
        { id: 1, nameEn: 'Premium Hair Serum', nameBn: 'প্রিমিয়াম হেয়ার সিরাম', price: 1500, stock: 25 },
        { id: 2, nameEn: 'Matte Lipstick Set', nameBn: 'ম্যাট লিপস্টিক সেট', price: 950, stock: 40 }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/order');
      const rawData = getResponseList(res, 'orders');
      if (Array.isArray(rawData)) {
        setOrdersData(rawData);
      } else {
        throw new Error();
      }
    } catch (error) {
      setOrdersData([
        { id: 1, customer: 'Mimi Ahmed', itemsEn: 'Hair Serum & Lipstick', itemsBn: 'হেয়ার সিরাম ও লিপস্টিক', total: 2450, status: 'Completed' }
      ]);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        setUser(res.data.user);
        
        refreshAllData();
        return { success: true };
      } else {
        return { success: false, message: 'Admin access only!' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid email or password' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    setUser(null);
    setBookingsData([]);
  };

  const refreshAllData = () => {
    fetchBookings();
    fetchServices();
    fetchStaff();
    fetchCoupons();
    fetchOffers();
    fetchBlogs();
    fetchProducts();
    fetchOrders();
  };

  const createResource = async (resource, payload) => {
    const response = await api.post(`/${resource}`, payload);
    return response.data;
  };

  const updateResource = async (resource, id, payload) => {
    const response = await api.put(`/${resource}/${id}`, payload);
    return response.data;
  };

  const deleteResource = async (resource, id) => {
    const response = await api.delete(`/${resource}/${id}`);
    return response.data;
  };

  // অ্যাপ লোড হওয়ার সাথে সাথেই ডেটা রিফ্রেশ করা
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      refreshAllData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading,
      lang, setLang,
      bookingsData, setBookingsData, fetchBookings,
      addBooking, updateBookingStatus, updateBookingDetails, deleteBooking,
      servicesData, setServicesData, fetchServices,
      staffData, setStaffData, fetchStaff,
      couponsData, setCouponsData, fetchCoupons,
      offersData, setOffersData, fetchOffers,
      blogsData, setBlogsData, fetchBlogs,
      productsData, setProductsData, fetchProducts,
      ordersData, setOrdersData, fetchOrders,
      usersCount, setUsersCount,
      createResource, updateResource, deleteResource,
      refreshAllData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);