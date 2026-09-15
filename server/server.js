const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const blogRoutes = require('./routes/blogRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const beauticianRoutes = require('./routes/beauticianRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const staffRoutes = require('./routes/staffRoutes');
const faqRoutes = require('./routes/faqRoutes');
const offerRoutes = require('./routes/offerRoutes');
const reportRoutes = require('./routes/reportRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.disable('x-powered-by');

// Middleware
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${requestOrigin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'token'],
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connect
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/product', productRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/beautician', beauticianRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/offer', offerRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🌸 Glow&Grace Beauty Parlour API is Running!' });
});

app.get('/health', (req, res) => {
  res.json({ success: true, service: 'beauty-parlour-api', uptime: process.uptime() });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});