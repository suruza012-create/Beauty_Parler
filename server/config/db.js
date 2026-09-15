const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    // MONGO_URI চেক করো
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully');

    if (process.env.NODE_ENV !== 'production') {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@parlour.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'password';
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (!existingAdmin) {
        await User.create({
          name: 'Beauty Parlour Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin'
        });
        console.log(`✅ Demo admin created: ${adminEmail}`);
      } else if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Existing account promoted to admin: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;