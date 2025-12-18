const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');

// --- Auth Routes ---

// Register Page
router.get('/register', authController.getRegister);
// Handle Register Logic
router.post('/register', authController.postRegister);

// Login Page
router.get('/login', authController.getLogin);
// Handle Login Logic
router.post('/login', authController.postLogin);

// Handle Logout (THIS IS THE FIX)
router.get('/logout', authController.getLogout);

module.exports = router;

