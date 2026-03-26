const express = require('express');
const router = express.Router();

// Import the controller and middleware
const authController = require('../controllers/authController');
const auth = require('../middleware/auth-middleware');

// Public Routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Routes that need authentication
router.get('/profile', auth.isLoggedIn, authController.getProfile);
router.post('/profile/update', auth.isLoggedIn, authController.postUpdateProfile);
router.post('/profile/delete', auth.isLoggedIn, authController.postDeleteProfile);
router.get('/logout', auth.isLoggedIn, authController.getLogout);

module.exports = router;