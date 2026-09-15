/**
 *
 * @route /api/auth
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, createUser, updateUserStatus, changePassword } = require('../controllers/authController');
const { auth, admin } = require('../middleware/auth');


router.post('/register', register);

router.post('/login', login);


router.get('/me', auth, getMe);
router.get('/users', auth, admin, getUsers);
router.post('/users', auth, admin, createUser);
router.put('/users/:id/status', auth, admin, updateUserStatus);
router.put('/password', auth, changePassword);

module.exports = router;