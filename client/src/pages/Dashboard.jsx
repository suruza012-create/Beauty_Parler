import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CalendarDays, Check, Package, UserCircle } from 'lucide-react';
import { apiGet, apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationError, setNotificationError] = useState('');

  useEffect(() => {
    if (!user) return;

    Promise.all([apiGet('/booking/my-booking'), apiGet('/order')])
      .then(([bookingData, orderData]) => {
        setBookings(bookingData.bookings || []);
        setOrders(orderData.orders || []);
      })
      .catch(requestError => setError(requestError.message));

    apiGet('/notification')
      .then(data => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(requestError => setNotificationError(requestError.message));
  }, [user]);

  const markNotificationRead = async (notification) => {
    try {
      await apiRequest(`/notification/${notification._id}/read`, { method: 'PATCH' });
      setNotifications(current => current.map(item => (
        item._id === notification._id ? { ...item, isRead: true } : item
      )));
      if (!notification.isRead) setUnreadCount(count => Math.max(0, count - 1));
    } catch (requestError) {
      setNotificationError(requestError.message);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await apiRequest('/notification/read-all', { method: 'PATCH' });
      setNotifications(current => current.map(item => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (requestError) {
      setNotificationError(requestError.message);
    }
  };

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
        <section className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-black text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Notifications
              {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs">{unreadCount}</span>}
            </h2>
            {unreadCount > 0 && (
              <button onClick={markAllNotificationsRead} className="text-xs font-bold text-purple-700 hover:text-purple-900">
                Mark all as read
              </button>
            )}
          </div>
          {notificationError && <p className="mb-3 text-sm text-rose-700">{notificationError}</p>}
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No notifications yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(notification => (
                <article key={notification._id} className={`flex items-start justify-between gap-4 py-4 ${notification.isRead ? '' : 'bg-purple-50/50'}`}>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900">{notification.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    <time className="mt-2 block text-xs text-slate-400">
                      {new Date(notification.createdAt || notification.sentAt).toLocaleString()}
                    </time>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markNotificationRead(notification)}
                      title="Mark as read"
                      aria-label={`Mark ${notification.title} as read`}
                      className="shrink-0 p-2 text-purple-700 hover:bg-purple-100 rounded-xl"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
