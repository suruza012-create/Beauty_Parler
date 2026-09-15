import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Package, UserCircle } from 'lucide-react';
import { apiGet } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    Promise.all([apiGet('/booking/my-booking'), apiGet('/order')])
      .then(([bookingData, orderData]) => {
        setBookings(bookingData.bookings || []);
        setOrders(orderData.orders || []);
      })
      .catch(requestError => setError(requestError.message));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center space-y-4">
          <UserCircle className="w-12 h-12 text-purple-600 mx-auto" />
          <h1 className="text-2xl font-black">Please login to view your dashboard</h1>
          <Link to="/login" className="inline-block px-6 py-3 bg-purple-700 text-white rounded-2xl font-bold text-sm">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="bg-gradient-to-r from-purple-950 to-indigo-900 text-white p-6 rounded-3xl shadow-xl">
          <p className="text-sm text-purple-200">Welcome back</p>
          <h1 className="text-3xl font-black">{user.name}</h1>
          <p className="text-xs text-purple-200 mt-1">{user.email}</p>
        </div>
        {error && <p className="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-lg border border-purple-100">
            <CalendarDays className="text-purple-600" />
            <p className="text-xs text-slate-500 mt-3">Total bookings</p>
            <strong className="text-3xl">{bookings.length}</strong>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-lg border border-purple-100">
            <Package className="text-pink-600" />
            <p className="text-xs text-slate-500 mt-3">Total orders</p>
            <strong className="text-3xl">{orders.length}</strong>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
          <h2 className="font-black text-lg mb-4">Recent bookings</h2>
          {bookings.length === 0 ? <p className="text-sm text-slate-500">No bookings yet.</p> : bookings.map(booking => (
            <div key={booking._id} className="flex justify-between gap-4 py-3 border-b border-slate-100 text-sm">
              <span>
                {booking.serviceId?.name || 'Beauty service'}<br />
                <small className="text-slate-500">{booking.bookingDate} at {booking.bookingTime}</small>
              </span>
              <strong className="text-purple-700 capitalize">{booking.status}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
