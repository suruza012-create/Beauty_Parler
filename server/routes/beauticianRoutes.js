const express = require('express');
const router = express.Router();
const {
  getBeauticians,
  getBeauticianById,
  createBeautician,
  updateBeautician,
  deleteBeautician
} = require('../controllers/beauticianController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getBeauticians);
router.get('/:id', getBeauticianById);
router.post('/', auth, admin, createBeautician);
router.put('/:id', auth, admin, updateBeautician);
router.delete('/:id', auth, admin, deleteBeautician);

module.exports = router;