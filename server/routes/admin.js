// server/routes/admin.js
const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Admin middleware - Add your admin check
const isAdmin = (req, res, next) => {
    // List of admin usernames or IDs
    const adminUsers = ['MaggieL']; // Replace with your username
    if (adminUsers.includes(req.user.username)) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Delete any post by ID
router.delete('/posts/:id', isAdmin, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
});

// Delete all posts by a specific user
router.delete('/users/:username/posts', isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await Post.deleteMany({ user: user._id });
        res.json({ message: 'All posts deleted for user' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting posts' });
    }
});

module.exports = router;