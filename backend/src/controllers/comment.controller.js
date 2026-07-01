const pool = require('../config/database');

const commentController = {
    async create(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const userId = req.userId;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            }

            const post = await pool.query('SELECT id, user_id FROM posts WHERE id = $1', [postId]);
            if (post.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            const comment = await pool.query(
                `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
                [postId, userId, content]
            );

            await pool.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [postId]);

            const user = await pool.query('SELECT username, full_name, profile_picture FROM users WHERE id = $1', [userId]);
            const commentWithUser = { ...comment.rows[0], user: user.rows[0] };

            if (post.rows[0].user_id !== userId) {
                await pool.query(
                    `INSERT INTO notifications (user_id, type, reference_id, content)
                     VALUES ($1, 'comment', $2, $3)`,
                    [post.rows[0].user_id, postId, 'Someone commented on your post']
                );
            }

            res.status(201).json({ success: true, message: 'Comment added successfully', data: commentWithUser });
        } catch (error) {
            console.error('Create comment error:', error);
            res.status(500).json({ success: false, message: 'Error creating comment' });
        }
    },

    async getComments(req, res) {
        try {
            const { postId } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const comments = await pool.query(
                `SELECT c.*, u.username, u.full_name, u.profile_picture
                 FROM comments c JOIN users u ON c.user_id = u.id
                 WHERE c.post_id = $1 ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`,
                [postId, limit, offset]
            );

            res.json({ success: true, data: comments.rows });
        } catch (error) {
            console.error('Get comments error:', error);
            res.status(500).json({ success: false, message: 'Error fetching comments' });
        }
    },

    async delete(req, res) {
        try {
            const { postId, commentId } = req.params;
            const userId = req.userId;

            const comment = await pool.query('SELECT id, post_id, user_id FROM comments WHERE id = $1', [commentId]);
            if (comment.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }

            if (comment.rows[0].user_id !== userId) {
                return res.status(403).json({ success: false, message: 'You can only delete your own comments' });
            }

            await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
            await pool.query('UPDATE posts SET comments_count = comments_count - 1 WHERE id = $1', [postId]);

            res.json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(500).json({ success: false, message: 'Error deleting comment' });
        }
    }
};

module.exports = commentController;