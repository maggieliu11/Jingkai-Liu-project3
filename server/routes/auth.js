const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
      });

      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'none', 
          maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
          _id: user._id,
          username: user.username,
          description: user.description
      });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;