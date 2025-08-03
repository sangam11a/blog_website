const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const { userSchema } = require('../validators/userValidator');
const authMiddleware = require('../middlewares/auth');

// REGISTER
router.post('/register', async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log("User details:\n", newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email }).select('+password');
    console.log("User", user, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = user.comparePassword(password);
    
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// PROFILE
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req1._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
