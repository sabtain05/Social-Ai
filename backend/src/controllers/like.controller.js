const pool = require('../config/database');

const likeController = {
    async toggleLike(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.userId;

            const post = await pool.query('SELECT id, user_id FROM posts WHERE id = $1', [postId]);
            if (post.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            const existingLike = await pool.query('SELECT id FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);

            if (existingLike.rows.length > 0) {
                await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
                await pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [postId]);
                if (post.rows[0].user_id !== userId) {
                    await pool.query(`INSERT INTO notifications (user_id, type, reference_id, content) VALUES ($1, 'like', $2, $3)`,
                        [post.rows[0].user_id, postId, 'Someone liked your post']);
                }
                const likesCount = await pool.query('SELECT likes_count FROM posts WHERE id = $1', [postId]);
                res.json({ success: true, message: 'Post unliked', data: { liked: false, likes_count: parseInt(likesCount.rows[0].likes_count) } });
            } else {
                await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
                await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
                const likesCount = await pool.query('SELECT likes_count FROM posts WHERE id = $1', [postId]);
                res.json({ success: true, message: 'Post liked', data: { liked: true, likes_count: parseInt(likesCount.rows[0].likes_count) } });
            }
        } catch (error) {
            console.error('Toggle like error:', error);
            res.status(500).json({ success: false, message: 'Error toggling like' });
        }
    }
};

module.exports = likeController;