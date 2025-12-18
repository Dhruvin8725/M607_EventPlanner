const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth.middleware');


// Admin Dashboard
router.get('/dashboard', isAdmin, adminController.getAdminDashboard);

// Manage Events Page
router.get('/manage', isAdmin, adminController.getManageEvents);

// --- Create Event ---
// Show the "create new event" form
router.get('/new', isAdmin, adminController.getNewEventForm);

// Handle the "create new event" form submission
router.post('/new', isAdmin, adminController.postNewEvent);

// --- Edit Event ---
// Show the "edit event" form
router.get('/edit/:id', isAdmin, adminController.getEditEventForm);

// Handle the "edit event" form submission
router.post('/edit/:id', isAdmin, adminController.postEditEvent);

// --- Delete Event ---
router.post('/delete/:id', isAdmin, adminController.deleteEvent);


module.exports = router;

