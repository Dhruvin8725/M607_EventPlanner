const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

// Controller to show the register page
exports.getRegister = (req, res) => {
  res.render('pages/register', {
    title: 'Register',
    path: '/register',
    currentUser: req.session.user,
  });
};

// Controller to handle register logic
exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [
      email,
      username,
    ]);
    if (userCheck.rows.length > 0) {
      req.flash('error', 'Username or email is already taken.');
      return res.redirect('/register');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save user to database
    const query =
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)';
    await db.query(query, [username, email, hashedPassword]);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).render('pages/500');
  }
};

// Controller to show the login page
exports.getLogin = (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    path: '/login',
    currentUser: req.session.user,
  });
};


// Controller to handle login logic
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    
    req.session.user = {
      id: user.id, // This was the bug
      username: user.username,
      email: user.email,
      role: user.role,
    };
    
    console.log('User logged in:', req.session.user); // Will now show the correct ID

    // Redirect admin to admin dashboard, user to user dashboard
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).render('pages/500');
  }
};

// Controller for logging out
exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    console.log('User logged out');
    res.redirect('/');
  });
};