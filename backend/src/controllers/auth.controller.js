const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt.utils');
const { validateEmail, validateUsername, validatePassword } = require('../utils/validation.utils');
const { generateAvatar } = require('../utils/helpers.utils');

const authController = {
    async register(req, res) {
        try {
            const { username, email, password, full_name } = req.body;

            if (!validateUsername(username)) {
                return res.status(400).json({ success: false, message: 'Username must be 3-30 characters and can only contain letters, numbers, and underscores' });
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ success: false, message: 'Invalid email format' });
            }
            if (!validatePassword(password)) {
                return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
            }

            const existingUser = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'Username or email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const profilePicture = generateAvatar(username);

            const newUser = await pool.query(
                `INSERT INTO users (username, email, password_hash, full_name, profile_picture) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, username, email, full_name, profile_picture, created_at`,
                [username, email, hashedPassword, full_name || username, profilePicture]
            );

            const user = newUser.rows[0];
            const token = generateToken(user.id);

            res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ success: false, message: 'Error registering user' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userResult = await pool.query(
                'SELECT id, username, email, password_hash, full_name, profile_picture, bio, is_private FROM users WHERE email = $1',
                [email]
            );

            if (userResult.rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const user = userResult.rows[0];
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            delete user.password_hash;
            const token = generateToken(user.id);

            res.json({ success: true, message: 'Login successful', data: { user, token } });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
    },

    async getMe(req, res) {
        try {
            const user = await pool.query(
                `SELECT id, username, email, full_name, bio, profile_picture, gender, relationship_status, 
                        high_school, college, hobbies, is_private, created_at
                 FROM users WHERE id = $1`,
                [req.userId]
            );

            if (user.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user.rows[0] });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ success: false, message: 'Error fetching user data' });
        }
    }
};

module.exports = authController;