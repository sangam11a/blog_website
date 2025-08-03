const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, decoded._id)
    req1= decoded;
    // console.log('req.user:', req);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
