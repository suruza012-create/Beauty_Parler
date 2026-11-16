const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Offer = require('../models/Offer');

const seedDefaultData = async () => {
  try {
    const hasServices = await Service.exists();
    if (!hasServices) {
      const services = [
        {
          name: 'Bridal Glow Facial & Spa',
          description: 'A premium facial and spa ritual designed to brighten skin, reduce dullness, and restore your bridal glow before special occasions.',
          price: 3200,
          duration: '90 minutes',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
          category: 'Skin',
          isFeatured: true,
          discount: 15,
          averageRating: 4.9,
          totalReviews: 120
        },
        {
          name: 'Hydra Glow Facial',
          description: 'Hydration-focused facial therapy with deep nourishment, gentle exfoliation, and skin radiance boosting care.',
          price: 2600,
          duration: '60 minutes',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
          category: 'Skin',
          isFeatured: true,
          discount: 10,
          averageRating: 4.8,
          totalReviews: 85
        },
        {
          name: 'Luxury Hair Spa',
          description: 'A restorative hair spa treatment that adds shine, smoothness, and deep conditioning for healthy-looking hair.',
          price: 2400,
          duration: '75 minutes',
          image: 'https://images.unsplash.com/photo-1521590832167-7e3dba5b3f45?auto=format&fit=crop&w=900&q=80',
          category: 'Hair',
          isFeatured: true,
          discount: 12,
          averageRating: 4.7,
          totalReviews: 96
        },
        {
          name: 'Premium Nail & Spa Care',
          description: 'A pampering nail and spa session to refresh your hands, feet, and overall self-care routine.',
          price: 1800,
          duration: '45 minutes',
          image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
          category: 'Nail',
          isFeatured: false,
          discount: 8,
          averageRating: 4.6,
          totalReviews: 67
        }
      ];
      await Service.insertMany(services);
      console.log('✅ Default services seeded');
    }

    const hasProducts = await Product.exists();
    if (!hasProducts) {
      const products = [
        {
          name: 'Rose Glow Serum',
          description: 'Luxury facial serum infused with rose extract and natural nutrients for a radiant finish.',
          price: 1450,
          stock: 25,
          image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
          category: 'Skincare',
          brand: 'Glow&Rose',
          weight: '30ml',
          isFeatured: true,
          discount: 10,
          averageRating: 4.8,
          totalReviews: 58
        },
        {
          name: 'Silk Repair Hair Oil',
          description: 'Nourishing hair oil with botanical extracts to reduce dryness and increase softness.',
          price: 1200,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
          category: 'Haircare',
          brand: 'The Velvet',
          weight: '50ml',
          isFeatured: true,
          discount: 12,
          averageRating: 4.7,
          totalReviews: 44
        },
        {
          name: 'Velvet Matte Lipstick',
          description: 'Long-lasting lipstick with smooth texture and vibrant color for a polished everyday look.',
          price: 890,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
          category: 'Makeup',
          brand: 'Lumiere',
          weight: '4g',
          isFeatured: false,
          discount: 5,
          averageRating: 4.6,
          totalReviews: 31
        }
      ];
      await Product.insertMany(products);
      console.log('✅ Default products seeded');
    }

    const hasBlogs = await Blog.exists();
    if (!hasBlogs) {
      const blogs = [
        {
          title: '5 Easy Beauty Habits for Glowing Skin',
          excerpt: 'Build a simple daily skincare routine for brighter, healthier skin with sustainable habits.',
          content: 'Consistency is the key to glowing skin. Start with gentle cleansing, hydration, sunscreen, and sleep. Small changes lead to the biggest improvements over time.',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
          category: 'Beauty Tips',
          author: 'Admin',
          isPublished: true,
          isFeatured: true,
          tags: ['skin', 'beauty', 'routine']
        },
        {
          title: 'How to Maintain Healthy Hair in Monsoon',
          excerpt: 'Humidity and rain can damage your hair. Learn effective care tips to keep it smooth and strong.',
          content: 'Humidity causes frizz and breakage, so choose hydrating hair care and avoid over-styling. Regular deep conditioning and oil masks help maintain softness.',
          image: 'https://images.unsplash.com/photo-1521590832167-7e3dba5b3f45?auto=format&fit=crop&w=900&q=80',
          category: 'Hair Care',
          author: 'Admin',
          isPublished: true,
          isFeatured: true,
          tags: ['hair', 'monsoon', 'care']
        }
      ];
      await Blog.insertMany(blogs);
      console.log('✅ Default blog posts seeded');
    }

    const hasOffers = await Offer.exists();
    if (!hasOffers) {
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await Offer.create({
        title: 'Monsoon Glow Combo',
        description: 'Special seasonal beauty bundle with facial, hair spa, and exclusive product discounts.',
        type: 'combo',
        discountValue: 20,
        originalPrice: 5200,
        offerPrice: 4200,
        category: 'Seasonal',
        targetAudience: 'All Clients',
        isFeatured: true,
        isActive: true,
        validFrom: now,
        validTo: nextMonth,
        image: 'https://images.unsplash.com/photo-1521590832167-7e3dba5b3f45?auto=format&fit=crop&w=900&q=80',
        terms: 'Valid until the end of the promotional cycle.'
      });
      console.log('✅ Default offer seeded');
    }
  } catch (error) {
    console.error('❌ Data seeding failed:', error.message);
  }
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beauty_parlour';
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully');

    const isProduction = process.env.NODE_ENV === 'production';
    const adminEmail = process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@parlour.com');
    const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'password');

    if (isProduction && (!adminEmail || !adminPassword)) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in production');
    }

    if (adminEmail && adminPassword) {
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (!existingAdmin) {
        await User.create({
          name: 'Beauty Parlour Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin'
        });
        console.log(`✅ Demo admin created: ${adminEmail}`);
      } else if (existingAdmin.role !== 'admin' && !isProduction) {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Existing account promoted to admin: ${adminEmail}`);
      } else if (existingAdmin.role !== 'admin') {
        throw new Error('ADMIN_EMAIL belongs to a non-admin account; choose a different ADMIN_EMAIL');
      }
    }

    await seedDefaultData();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;