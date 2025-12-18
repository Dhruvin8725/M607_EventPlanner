const db = require('../config/db.config');

// Controller for the homepage (with search)
exports.getHomepage = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the URL

    let query = 'SELECT * FROM events WHERE date >= NOW()';
    const queryParams = [];

    if (search) {
      queryParams.push(`%${search}%`); 
      query += ' AND (title ILIKE $1 OR location_name ILIKE $1)';
    }

    query += ' ORDER BY date ASC';

    const result = await db.query(query, queryParams); 

    res.render('pages/index', {
      title: 'Upcoming Events',
      events: result.rows,
      path: '/',
      currentUser: req.session.user,
    });
  } catch (err) {
    console.error('Error getting homepage events:', err);
    res.status(500).render('pages/500');
  }
};

// Controller for the event details page
exports.getEventDetails = async (req, res) => {
  const { id } = req.params;
  // This will now have the correct ID after you re-login
  const userId = req.session.user ? req.session.user.id : null; 

  try {
    // 1. Get event details
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [
      id,
    ]);

    if (eventResult.rows.length === 0) {
      return res.status(404).render('pages/404');
    }
    const event = eventResult.rows[0];

    // 2. Check if the current user has RSVP'd
    let userHasRsvpd = false;
    if (userId) {
      const rsvpResult = await db.query(
        'SELECT * FROM rsvps WHERE user_id = $1 AND id = $2',
        [userId, id]
      );
      userHasRsvpd = rsvpResult.rows.length > 0;
    }

 
    res.render('pages/event-details', {
      title: event.title,
      event: event,
      path: '/event-details',
      currentUser: req.session.user,
      hasRsvpd: userHasRsvpd, // This now matches the EJS file
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  } catch (err) {
    console.error('Error getting event details:', err);
    res.status(500).render('pages/500');
  }
};

// Controller for the user dashboard
exports.getDashboard = async (req, res) => {
  const userId = req.session.user.id;
  try {
    const query = `
      SELECT events.id, events.title, events.date, events.location_name, events.image_url
      FROM events
      JOIN rsvps ON events.id = rsvps.id
      WHERE rsvps.user_id = $1
      ORDER BY events.date ASC
    `;
    const result = await db.query(query, [userId]);
    
    res.render('pages/dashboard', {
      title: 'My Dashboard',
      path: '/dashboard',
      currentUser: req.session.user,
      rsvps: result.rows,
    });
  } catch (err) {
    console.error('Error getting dashboard rsvps:', err);
    res.status(500).render('pages/500');
  }
};

// Controller to RSVP to an event
exports.postRsvp = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.session.user.id; // This will now be correct

  if (!userId) {
    req.flash('error', 'You must be logged in to RSVP.');
    return res.redirect(`/event/${eventId}`);
  }

  try {
    const query = 'INSERT INTO rsvps (user_id, id) VALUES ($1, $2)';
    await db.query(query, [userId, eventId]);
    
    res.redirect(`/event/${eventId}`);
  } catch (err) {
    console.error('Error posting RSVP:', err);
    res.redirect(`/event/${eventId}`);
  }
};

// Controller to cancel an RSVP
exports.cancelRsvp = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.session.user.id; // This will now be correct

  try {
    const query = 'DELETE FROM rsvps WHERE user_id = $1 AND id = $2';
    await db.query(query, [userId, eventId]);
    
    res.redirect(`/event/${eventId}`);
  } catch (err) {
    console.error('Error canceling RSVP:', err);
    res.redirect(`/event/${eventId}`);
  }
};