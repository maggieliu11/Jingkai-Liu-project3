// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        console.log('Checking auth token...');
        console.log('Cookies received:', req.cookies);
        
        const token = req.cookies.token;
        
        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({ message: 'No auth token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token verified successfully, user ID:', decoded.userId);
            req.userId = decoded.userId;
            next();
        } catch (e) {
            console.error('Token verification failed:', e);
            res.status(401).json({ message: 'Token is not valid' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};