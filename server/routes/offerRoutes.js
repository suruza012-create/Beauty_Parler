const express = require('express');
const router = express.Router();
const {
  getOffers,
  getAdminOffers,
  getActiveOffers,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../controllers/offerController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getOffers);
router.get('/manage', auth, admin, getAdminOffers);
router.get('/active', getActiveOffers);
router.post('/', auth, admin, createOffer);
router.put('/:id', auth, admin, updateOffer);
router.delete('/:id', auth, admin, deleteOffer);

module.exports = router;