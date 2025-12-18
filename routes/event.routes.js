const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');

// --- Public Routes ---

// Homepage - Show all events
router.get('/', eventController.getHomepage);

// Event Details Page
router.get('/event/:id', eventController.getEventDetails);

// --- Private Routes (Require Login) ---

// User Dashboard
// isLoggedIn middleware protects this route
//
// THIS IS THE LINE I FIXED (was .getUserDashboard)
//
router.get('/dashboard', isLoggedIn, eventController.getDashboard);

// RSVP to an event
router.post('/event/rsvp', isLoggedIn, eventController.postRsvp);

// Cancel an RSVP
router.post('/event/rsvp/cancel', isLoggedIn, eventController.cancelRsvp);


module.exports = router;