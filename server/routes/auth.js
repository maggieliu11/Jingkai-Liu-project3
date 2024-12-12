const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
    console.log('Auth Route:', {
        path: req.path,
        method: req.method,
        cookies: req.cookies,
        headers: req.headers
    });
    next();
});

router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body.username);
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = new User({ username, password });
        await user.save();
        console.log('User registered successfully:', username);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt for:', req.body.username);
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Setting cookie for user:', username);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            partitioned: true
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
    try {
        console.log('Logout attempt');
        res.cookie('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            expires: new Date(0)
        });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        console.log('Fetching user data for ID:', req.userId);
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            console.log('User not found for ID:', req.userId);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in /me route:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

module.exports = router;