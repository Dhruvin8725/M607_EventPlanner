const db = require('../config/db.config');
const { getCoordinates } = require('../utils/googleMaps');

// Controller for the Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Get user count
    const userCountResult = await db.query('SELECT COUNT(*) FROM users');
    const userCount = userCountResult.rows[0].count;

    // 2. Get event count
    const eventCountResult = await db.query('SELECT COUNT(*) FROM events');
    const eventCount = eventCountResult.rows[0].count;

    // 3. Get RSVP count
    const rsvpCountResult = await db.query('SELECT COUNT(*) FROM rsvps');
    const rsvpCount = rsvpCountResult.rows[0].count;

    // 4. Get recent events
    const recentEventsResult = await db.query(
      'SELECT * FROM events ORDER BY created_at DESC LIMIT 5'
    );
    const recentEvents = recentEventsResult.rows;

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      userCount,
      eventCount,
      rsvpCount,
      recentEvents,
      path: '/admin/dashboard',
      currentUser: req.session.user,
    });
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
    res.status(500).render('pages/500');
  }
};

// Controller to show all events in the manage table
exports.getManageEvents = async (req, res) => {
  try {
    // This query is now correct and selects all columns
    const result = await db.query('SELECT * FROM events ORDER BY date ASC');
    
    res.render('admin/manage-events', {
      title: 'Manage Events',
      events: result.rows, // This now contains the 'id'
      path: '/admin/manage',
      currentUser: req.session.user,
    });
  } catch (err) {
    console.error('Error getting events for manage page:', err);
    res.status(500).render('pages/500');
  }
};

// Controller to show the 'Create New Event' form
exports.getNewEventForm = (req, res) => {
  res.render('admin/event-form', {
    title: 'Create New Event',
    path: '/admin/new',
    currentUser: req.session.user,
    event: null, // Pass null for a new event
    action: '/admin/new', // Form will POST to /admin/new
    buttonText: 'Save Event',
  });
};

// Controller to handle the 'Create New Event' form submission
exports.postNewEvent = async (req, res) => {
  const { title, description, date, location_name } = req.body;

  try {
    // Get lat/lng from Google Geocoding API
    const { lat, lng } = await getCoordinates(location_name);

    if (!lat || !lng) {
      req.flash('error', 'Invalid location. Could not find coordinates.');
      return res.redirect('/admin/new');
    }

    const query = `
      INSERT INTO events (title, description, date, location_name, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    await db.query(query, [title, description, date, location_name, lat, lng]);

    req.flash('success', 'Event created successfully!');
    res.redirect('/admin/manage');
  } catch (err) {
    console.error('Error creating new event:', err);
    if (err.message.includes('Geocoding Error')) {
      req.flash('error', err.message);
      return res.redirect('/admin/new');
    }
    res.status(500).render('pages/500');
  }
};

// Controller to show the 'Edit Event' form
exports.getEditEventForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).render('pages/404');
    }

    const event = result.rows[0];
    
    // Format the date to 'YYYY-MM-DD' for the date input field
    if (event.date) {
        event.date = new Date(event.date).toISOString().split('T')[0];
    }

    res.render('admin/event-form', {
      title: 'Edit Event',
      path: '/admin/edit',
      currentUser: req.session.user,
      event: event, // Pass the event data to pre-fill the form
      action: `/admin/edit/${id}`, // Form will POST to /admin/edit/:id
      buttonText: 'Update Event',
    });
  } catch (err) {
    console.error('Error getting event for edit:', err);
    res.status(500).render('pages/500');
  }
};

// Controller to handle the 'Edit Event' form submission
exports.postEditEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location_name } = req.body;
  
  try {
    let lat, lng;

    // Check if the location name has changed.
    const oldEventResult = await db.query('SELECT location_name, lat, lng FROM events WHERE id = $1', [id]);
    const oldEvent = oldEventResult.rows[0];

    if (location_name.trim() !== oldEvent.location_name.trim()) {
      // Location changed, so get new coordinates
      console.log('Location changed. Fetching new coordinates...');
      const coords = await getCoordinates(location_name);
      lat = coords.lat;
      lng = coords.lng;

      if (!lat || !lng) {
        req.flash('error', 'Invalid new location. Could not find coordinates.');
        return res.redirect(`/admin/edit/${id}`);
      }
    } else {
      // Location is the same, just reuse old coordinates
      console.log('Location unchanged. Reusing old coordinates.');
      lat = oldEvent.lat;
      lng = oldEvent.lng;
    }

    const query = `
      UPDATE events
      SET title = $1, description = $2, date = $3, location_name = $4, lat = $5, lng = $6
      WHERE id = $7
    `;
    await db.query(query, [title, description, date, location_name, lat, lng, id]);

    req.flash('success', 'Event updated successfully!');
    res.redirect('/admin/manage');
  } catch (err) {
    console.error('Error updating event:', err);
    if (err.message.includes('Geocoding Error')) {
      req.flash('error', err.message);
      return res.redirect(`/admin/edit/${id}`);
    }
    res.status(500).render('pages/500');
  }
};

// Controller to handle deleting an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {

    await db.query('DELETE FROM rsvps WHERE id = $1', [id]);
    
    // This line was already correct
    await db.query('DELETE FROM events WHERE id = $1', [id]);

    req.flash('success', 'Event and all associated RSVPs deleted.');
    res.redirect('/admin/manage');
  } catch (err) {
    console.error('Error deleting event:', err);
    req.flash('error', 'Could not delete event. Please try again.');
    res.redirect('/admin/manage');
  }
};