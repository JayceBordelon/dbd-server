const express = require('express');
const User = require('../models/user');
const router = express.Router();


// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log("Registered new user with _id =>", user._id.toString());
    // On successful registration, also initiate a session
    req.session.userId = user._id;
    res.status(201).send({ user });
  } catch (error) {
    switch (error.code) {
      case 11000:
        res.status(401).send(error);
        return;
      default:
        break;
    }
    // default error...
    res.status(400).send(error);
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send('User not found');
    }

    // Compare the provided password with the stored hash
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    console.log("Logged in user with _id =>", user._id.toString());
    // On successful registration, also initiate a session
    req.session.userId = user._id;
    res.status(201).send({ user });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/logout', (req, res) => {
  console.log("Logging out user with _id =>", req.session.userId);
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out, please try again.');
    }
    res.status(200).send({ message: 'Logged out successfully' });
  });
});

module.exports = router;
