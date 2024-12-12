const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.username === 'MaggieL') {
            next();
        } else {
            res.status(403).json({ message: 'Admin access required' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin status' });
    }
};

// Admin delete post route
router.delete('/posts/:id', auth, isAdmin, async (req, res) => {
    try {
        console.log('Admin attempting to delete post:', req.params.id);
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Post.deleteOne({ _id: post._id });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Admin delete error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

// Get all posts (admin only)
router.get('/posts', auth, isAdmin, async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

module.exports = router;