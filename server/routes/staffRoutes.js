const express = require('express');
const router = express.Router();
const {
  staffLogin,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');
const { auth, admin } = require('../middleware/auth');

router.post('/login', staffLogin);
router.get('/', auth, admin, getStaff);
router.post('/', auth, admin, createStaff);
router.put('/:id', auth, admin, updateStaff);
router.delete('/:id', auth, admin, deleteStaff);

module.exports = router;