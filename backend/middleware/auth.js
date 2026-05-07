const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            // Development Bypass
            if (decoded.userId === 'dev-test-user-id') {
                req.user = {
                    _id: 'dev-test-user-id',
                    id: 'dev-test-user-id',
                    email: 'test@example.com',
                    name: 'Test Farmer',
                    role: 'user',
                    isOnboarded: true,
                    farmInfo: {
                        farmName: 'Test Farm',
                        location: 'Maharashtra',
                        farmSize: 5,
                        farmSizeUnit: 'Acre',
                        mainCrops: ['Rice', 'Wheat'],
                        soilType: 'Black',
                        irrigation: true
                    },
                    save: async () => { } // Mock save
                };
                return next();
            }

            // Fetch user from database
            try {
                const user = await User.findById(decoded.userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                req.user = user;
                next();
            } catch (dbErr) {
                console.error('DB Error in middleware:', dbErr.message);
                return res.status(503).json({ message: 'Database unreachable' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { authenticateToken, isAdmin };
