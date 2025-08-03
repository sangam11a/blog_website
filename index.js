// index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Correct router imports matching your file names
const blogRoutes = require('./routers/blogs');
const userRoutes = require('./routers/users');
const authRoutes = require('./routers/auth');
const commentRoutes = require('./routers/comments');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);


// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
