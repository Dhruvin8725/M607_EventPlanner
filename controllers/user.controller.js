const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

// Controller to show the profile edit form

exports.getProfileEdit = (req, res) => {
  
  res.render('pages/profile-edit', {
    title: 'Edit Profile',
    path: '/profile/edit',
    currentUser: req.session.user, // Already in session
  });
};

// Controller to handle updating profile info (username/email)
exports.postProfileEdit = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.session.user.id;

  try {
    // Check if new email is already taken by ANOTHER user
    const emailCheck = await db.query(
      'SELECT * FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (emailCheck.rows.length > 0) {
      req.flash('error', 'That email is already in use by another account.');
      return res.redirect('/profile/edit');
    }

    // Update the user in the database
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, userId]
    );

    // Update the user's session
    const updatedUser = result.rows[0];
    req.session.user = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    req.flash('success', 'Profile updated successfully.');
    res.redirect('/profile/edit');
  } catch (err) {
    console.error('Error updating profile:', err);
    req.flash('error', 'Could not update profile. Please try again.');
    res.redirect('/profile/edit');
  }
};

// Controller to handle resetting the password
exports.postResetPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.user.id;

  try {
    // 1. Check if new passwords match
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile/edit');
    }

    // 2. Get the user's current hashed password from DB
    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [
      userId,
    ]);
    const user = userResult.rows[0];

    // 3. Check if the 'currentPassword' is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      req.flash('error', 'Incorrect current password.');
      return res.redirect('/profile/edit');
    }

    // 4. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 5. Update the password in the database
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      hashedNewPassword,
      userId,
    ]);

    req.flash('success', 'Password reset successfully.');
    res.redirect('/profile/edit');
  } catch (err) {
    console.error('Error resetting password:', err);
    req.flash('error', 'Could not reset password. Please try again.');
    res.redirect('/profile/edit');
  }
};