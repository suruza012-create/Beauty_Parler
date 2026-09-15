const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesReport } = require('../controllers/reportController');
const { auth, admin } = require('../middleware/auth');

router.get('/dashboard', auth, admin, getDashboardStats);
router.get('/sales', auth, admin, getSalesReport);

module.exports = router;