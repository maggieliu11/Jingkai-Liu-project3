const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('Users Route:', {
        path: req.path,
        method: req.method
    });
    next();
});

// Get user profile
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

// Update user description
router.put('/description', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.description = req.body.description;
        await user.save();
        res.json({ message: 'Description updated successfully' });
    } catch (error) {
        console.error('Error updating description:', error);
        res.status(500).json({ message: 'Error updating description' });
    }
});

module.exports = router;