const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password'); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

router.put('/description', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.description = req.body.description;
    await user.save();
    res.json({ message: 'Description updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating description' });
  }
});

module.exports = router;