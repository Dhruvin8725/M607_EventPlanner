require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/db.config'); // db IS the pool
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Flash Middleware
app.use(flash());

// Global variable for all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// --- Routes ---
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');

app.use('/admin', adminRoutes); // All admin routes start with /admin
app.use('/', authRoutes); // Auth routes (login, register, logout)
app.use('/', eventRoutes); // Public event routes (homepage, details)
app.use('/', userRoutes); // User profile routes

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found', 
    path: '/404',
    currentUser: req.session.user 
  });
});

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { 
    title: 'Error', 
    path: '/500',
    currentUser: req.session.user 
  });
});


// Start Server
// We use db.query('SELECT NOW()') to test the connection.
db.query('SELECT NOW()')
  .then(() => {
    console.log(`✅ Database connected successfully...`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });