const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query(
            'SELECT id, username, email, full_name, profile_picture, bio, is_private FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            throw new Error();
        }

        req.user = user.rows[0];
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Please authenticate' });
    }
};

const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await pool.query('SELECT id, username FROM users WHERE id = $1', [decoded.userId]);
            
            if (user.rows.length > 0) {
                req.user = user.rows[0];
                req.userId = decoded.userId;
            }
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = { authenticate, optionalAuthenticate };