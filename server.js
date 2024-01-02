const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');  // Import session package
const userRoutes = require('./routes/userRoutes');

// MongoDB Connection
const mongoDBUri = process.env.MONGO_URI;
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const app = express();
const port = process.env.PORT;

// Enable CORS for all routes and origins
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Session Middleware
app.use(session({
  secret: process.env.SERVER_SESSION_TOKEN,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// User Routes
app.use('/users', userRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Server is live!');
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
