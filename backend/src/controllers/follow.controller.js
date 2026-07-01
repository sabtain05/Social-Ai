const pool = require('../config/database');

const followController = {
    async follow(req, res) {
        try {
            const { userId } = req.params;
            const followerId = req.userId;

            if (userId === followerId) {
                return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
            }

            const user = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
            if (user.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const existingFollow = await pool.query('SELECT id FROM followers WHERE follower_id = $1 AND following_id = $2', [followerId, userId]);
            if (existingFollow.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'You are already following this user' });
            }

            await pool.query('INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)', [followerId, userId]);
            await pool.query(`INSERT INTO notifications (user_id, type, reference_id, content) VALUES ($1, 'follow', $2, $3)`, [userId, followerId, 'started following you']);

            res.json({ success: true, message: 'User followed successfully' });
        } catch (error) {
            console.error('Follow error:', error);
            res.status(500).json({ success: false, message: 'Error following user' });
        }
    },

    async unfollow(req, res) {
        try {
            const { userId } = req.params;
            const followerId = req.userId;

            const result = await pool.query('DELETE FROM followers WHERE follower_id = $1 AND following_id = $2 RETURNING id', [followerId, userId]);
            if (result.rows.length === 0) {
                return res.status(400).json({ success: false, message: 'You are not following this user' });
            }

            res.json({ success: true, message: 'User unfollowed successfully' });
        } catch (error) {
            console.error('Unfollow error:', error);
            res.status(500).json({ success: false, message: 'Error unfollowing user' });
        }
    }
};

module.exports = followController;