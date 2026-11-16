const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main' },
  siteName: { type: String, default: 'Beauty Parlour' },
  tagline: { type: String, default: 'Enhancing Your Natural Beauty' },
  contactEmail: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  openTime: { type: String, default: '10:00' },
  closeTime: { type: String, default: '20:00' },
  weeklyOff: { type: String, default: 'Tuesday' },
  currency: { type: String, default: '৳ (BDT)' },
  vatPercent: { type: Number, default: 5 },
  advanceBookingPercent: { type: Number, default: 20 },
  paymentMethods: [{
    provider: { type: String, enum: ['bkash', 'nagad', 'rocket', 'bank'], required: true },
    name: { type: String, trim: true, required: true },
    accountName: { type: String, trim: true, default: '' },
    accountNumber: { type: String, trim: true, required: true },
    accountType: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true }
  }],
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  whatsapp: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
