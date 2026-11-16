import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages & Layouts
import AdminLayout from './pages/AdminLayout';
import AdminLogin from './pages/AdminLogin';

// Components
import Dashboard from './components/admin/Dashboard';
import Bookings from './components/admin/Bookings';
import Services from './components/admin/Services';
import Staff from './components/admin/Staff';
import Coupons from './components/admin/Coupons';
import Settings from './components/admin/Settings';
import Blogs from './components/admin/Blogs';
import Orders from './components/admin/Orders';
import Users from './components/admin/Users';
import Products from './components/admin/Products'; // Space সরিয়ে ঠিক করা হয়েছে

// Offers Component
import Offers from './components/admin/Offers'; 
import ContactMessages from './components/admin/ContactMessages';
import ContentManager from './components/admin/ContentManager';
import PaymentMethods from './components/admin/PaymentMethods';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect Root & /admin to /admin/dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="services" element={<Services />} />
            <Route path="staff" element={<Staff />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="offers" element={<Offers />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="contact-messages" element={<ContactMessages />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;