const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');

// This route will now find 'userController.getProfileEdit'
router.get('/profile/edit', isLoggedIn, userController.getProfileEdit);

// These are for the form submission
router.post('/profile/edit', isLoggedIn, userController.postProfileEdit);
router.post('/profile/password', isLoggedIn, userController.postResetPassword);

module.exports = router;