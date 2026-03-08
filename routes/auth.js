const express = require('express');
const router = express.Router();

// Import the controller
const authController = require('../controllers/authController');

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/profile', authController.getProfile);
router.post('/profile/update', authController.postUpdateProfile);
router.post('/profile/delete', authController.postDeleteProfile);

router.get('/logout', authController.getLogout);

module.exports = router;