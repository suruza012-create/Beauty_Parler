const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// REGISTER

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // ✅ সরাসরি পাসওয়ার্ড দাও (মডেল হ্যাশ করবে)
    const user = new User({
      name,
      email,
      password: password,
      phone: phone || '',
      address: address || ''
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
      error: error.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
      error: error.message
    });
  }
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// GET ALL CUSTOMERS (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    const usersWithStats = await Promise.all(users.map(async user => {
      const orders = await Order.find({ userId: user._id }).select('totalAmount');
      return {
        ...user.toObject(),
        totalOrders: orders.length,
        totalSpent: orders.reduce((total, order) => total + (order.totalAmount || 0), 0)
      };
    }));
    res.json({ success: true, count: usersWithStats.length, users: usersWithStats });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// CREATE CUSTOMER (Admin Only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      address: address || '',
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to create customer'
    });
  }
};

// UPDATE CUSTOMER STATUS (Admin Only)
exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'user' },
      { isActive: req.body.isActive !== false },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Unable to update customer status' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Current password and a new password of at least 6 characters are required' });
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Unable to change password' });
  }
};