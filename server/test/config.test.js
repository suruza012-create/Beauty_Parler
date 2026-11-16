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
