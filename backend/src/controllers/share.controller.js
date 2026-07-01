const pool = require('../config/database');

const shareController = {
    async trackShare(req, res) {
        try {
            const { postId } = req.params;
            const { platform } = req.body;
            const userId = req.userId;

            const validPlatforms = ['facebook', 'whatsapp', 'instagram', 'copy_link'];
            if (!validPlatforms.includes(platform)) {
                return res.status(400).json({ success: false, message: 'Invalid platform' });
            }

            await pool.query(`INSERT INTO shares (post_id, user_id, platform) VALUES ($1, $2, $3)`, [postId, userId, platform]);
            await pool.query('UPDATE posts SET shares_count = shares_count + 1 WHERE id = $1', [postId]);

            res.json({ success: true, message: 'Share tracked successfully' });
        } catch (error) {
            console.error('Track share error:', error);
            res.status(500).json({ success: false, message: 'Error tracking share' });
        }
    }
};

module.exports = shareController;