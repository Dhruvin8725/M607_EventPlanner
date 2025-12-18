const authMiddleware = {
  // Check if user is logged in (any role)
  isLoggedIn: (req, res, next) => {
    if (req.session.user) {
      // User is authenticated, proceed
      return next();
    }
    // User is not authenticated, redirect to login
    res.redirect('/login');
  },

  // Check if user is an Admin
  isAdmin: (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      // User is authenticated AND is an admin, proceed
      return next();
    }
    
    if (req.session.user) {
      // User is logged in but NOT an admin, redirect to user dashboard
      return res.redirect('/dashboard');
    }
    
    // User is not logged in at all, redirect to login
    res.redirect('/login');
  },

  // Prevent logged-in user from accessing login/register pages
  isGuest: (req, res, next) => {
    if (req.session.user) {
      // User is already logged in, redirect them to their dashboard
      return res.redirect('/dashboard');
    }
    // User is a guest, proceed
    return next();
  }
};

module.exports = authMiddleware;
