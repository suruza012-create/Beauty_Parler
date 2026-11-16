const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('required deployment template exists', () => {
  const envExample = path.join(__dirname, '..', '.env.example');
  assert.equal(fs.existsSync(envExample), true);
  const contents = fs.readFileSync(envExample, 'utf8');
  assert.match(contents, /^MONGO_URI=/m);
  assert.match(contents, /^JWT_SECRET=/m);
  assert.match(contents, /^CLIENT_ORIGINS=/m);
});

test('upload directory exists', () => {
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'uploads')), true);
});

test('all core Mongoose models can be required without runtime errors', () => {
  const modelsDir = path.join(__dirname, '..', 'models');
  const expectedFiles = [
    'Beautician.js',
    'Blog.js',
    'Booking.js',
    'ContactMessage.js',
    'Coupon.js',
    'FAQ.js',
    'Gallery.js',
    'Notification.js',
    'Offer.js',
    'Order.js',
    'Payment.js',
    'Product.js',
    'Review.js',
    'Service.js',
    'SiteSettings.js',
    'Staff.js',
    'User.js',
    'Video.js',
    'Wishlist.js'
  ];

  for (const file of expectedFiles) {
    assert.doesNotThrow(() => {
      require(path.join(modelsDir, file));
    }, `Model should load without runtime errors: ${file}`);
  }
});

test('notification API route can be loaded', () => {
  assert.doesNotThrow(() => require('../routes/notificationRoutes'));
});

test('upload API route can be loaded with cloud storage support', () => {
  assert.doesNotThrow(() => require('../routes/uploadRoutes'));
});

test('site settings validate payment account methods', async () => {
  const SiteSettings = require('../models/SiteSettings');
  const validSettings = new SiteSettings({
    paymentMethods: [{ provider: 'bank', name: 'Example Bank', accountNumber: '0123456789' }]
  });
  const invalidSettings = new SiteSettings({
    paymentMethods: [{ provider: 'unknown', name: 'Example', accountNumber: '' }]
  });

  await assert.doesNotReject(validSettings.validate());
  await assert.rejects(invalidSettings.validate());
});

test('booking schedule parses times and detects overlapping service durations', () => {
  const { parseBookingTime, getDurationMinutes, intervalsOverlap } = require('../utils/bookingSchedule');

  assert.equal(parseBookingTime('11:30 AM'), 690);
  assert.equal(parseBookingTime('02:00 PM'), 840);
  assert.equal(parseBookingTime('14:30'), 870);
  assert.equal(parseBookingTime('25:00'), null);
  assert.equal(getDurationMinutes('1.5 hours'), 90);
  assert.equal(intervalsOverlap(600, 90, 660, 60), true);
  assert.equal(intervalsOverlap(600, 60, 660, 60), false);
});

test('booking reminders use the configured local timezone', () => {
  const { getReminderDelayMinutes } = require('../utils/bookingReminders');
  const now = new Date('2026-11-16T00:00:00.000Z');

  assert.equal(getReminderDelayMinutes({ bookingDate: '2026-11-17', bookingTime: '06:00 AM' }, now), 1440);
  assert.equal(getReminderDelayMinutes({ bookingDate: '2026-11-16', bookingTime: '05:30 AM' }, now), -30);
});

test('SSLCommerz payments require matching transaction, amount and BDT currency', () => {
  const { isValidSslCommerzTransaction } = require('../utils/sslcommerz');
  const payment = { transactionId: 'BP123456', amount: 250 };
  const valid = { status: 'VALID', tran_id: 'BP123456', currency_type: 'BDT', currency_amount: '250.00', risk_level: '0' };

  assert.deepEqual(isValidSslCommerzTransaction(valid, payment), { valid: true, requiresReview: false });
  assert.equal(isValidSslCommerzTransaction({ ...valid, currency_amount: '249.00' }, payment).valid, false);
  assert.equal(isValidSslCommerzTransaction({ ...valid, tran_id: 'OTHER' }, payment).valid, false);
  assert.equal(isValidSslCommerzTransaction({ ...valid, currency_type: 'USD' }, payment).valid, false);
  assert.deepEqual(isValidSslCommerzTransaction({ ...valid, risk_level: '1' }, payment), { valid: true, requiresReview: true });
});

test('payment API route loads with public callbacks and authenticated initiation', () => {
  assert.doesNotThrow(() => require('../routes/paymentRoutes'));
});
