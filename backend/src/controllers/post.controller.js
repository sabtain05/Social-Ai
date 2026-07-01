const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const postController = {
    async create(req, res) {
        try {
            const { content, privacy = 'public', original_content, ai_improved = false, image } = req.body;
            const userId = req.userId;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
            }

            let imageUrl = null;
            if (image && image.startsWith('data:image')) {
                const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const imageType = matches[1];
                    const imageData = matches[2];
                    const buffer = Buffer.from(imageData, 'base64');
                    const filename = `post-image-${Date.now()}-${Math.round(Math.random() * 1E9)}.${imageType}`;
                    const filepath = path.join(__dirname, '../../uploads/posts', filename);
                    fs.writeFileSync(filepath, buffer);
                    imageUrl = `/uploads/posts/${filename}`;
                }
            }

            const result = await pool.query(
                `INSERT INTO posts (user_id, content, original_content, ai_improved, privacy, image_url)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [userId, content, original_content || content, ai_improved, privacy, imageUrl]
            );

            const userResult = await pool.query('SELECT username, full_name, profile_picture FROM users WHERE id = $1', [userId]);
            const post = result.rows[0];
            post.user = userResult.rows[0];

            res.status(201).json({ success: true, message: 'Post created successfully', data: post });
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ success: false, message: 'Error creating post' });
        }
    },

    async getFeed(req, res) {
        try {
            const userId = req.userId;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const posts = await pool.query(
                `SELECT p.*, u.username, u.full_name, u.profile_picture,
                        CAST(CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS BOOLEAN) as is_liked
                 FROM posts p JOIN users u ON p.user_id = u.id
                 LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1
                 WHERE p.user_id = $1 OR p.user_id IN (SELECT following_id FROM followers WHERE follower_id = $1)
                 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );

            const countResult = await pool.query(
                `SELECT COUNT(*) FROM posts p WHERE p.user_id = $1 OR p.user_id IN (SELECT following_id FROM followers WHERE follower_id = $1)`,
                [userId]
            );

            res.json({
                success: true,
                data: {
                    posts: posts.rows,
                    pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(countResult.rows[0].count) }
                }
            });
        } catch (error) {
            console.error('Get feed error:', error);
            res.status(500).json({ success: false, message: 'Error fetching feed' });
        }
    },

    async getUserPosts(req, res) {
        try {
            const { userId } = req.params;
            const currentUserId = req.userId;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const userResult = await pool.query('SELECT is_private FROM users WHERE id = $1', [userId]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const isPrivate = userResult.rows[0].is_private;
            let canView = true;

            if (isPrivate && userId !== currentUserId) {
                const friendCheck = await pool.query(
                    `SELECT 1 FROM friend_requests WHERE status = 'accepted' 
                     AND ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1))`,
                    [currentUserId, userId]
                );
                canView = friendCheck.rows.length > 0;
            }

            if (!canView) {
                return res.status(403).json({ success: false, message: 'This account is private' });
            }

            const posts = await pool.query(
                `SELECT p.*, u.username, u.full_name, u.profile_picture,
                        CAST(CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS BOOLEAN) as is_liked
                 FROM posts p JOIN users u ON p.user_id = u.id
                 LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1
                 WHERE p.user_id = $2 ORDER BY p.created_at DESC LIMIT $3 OFFSET $4`,
                [currentUserId, userId, limit, offset]
            );

            res.json({ success: true, data: posts.rows });
        } catch (error) {
            console.error('Get user posts error:', error);
            res.status(500).json({ success: false, message: 'Error fetching user posts' });
        }
    },

    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.userId;

            const post = await pool.query(
                `SELECT p.*, u.username, u.full_name, u.profile_picture,
                        CAST(CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS BOOLEAN) as is_liked
                 FROM posts p JOIN users u ON p.user_id = u.id
                 LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1 WHERE p.id = $2`,
                [userId, postId]
            );

            if (post.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            res.json({ success: true, data: post.rows[0] });
        } catch (error) {
            console.error('Get post error:', error);
            res.status(500).json({ success: false, message: 'Error fetching post' });
        }
    },

    async delete(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.userId;

            const post = await pool.query('SELECT user_id, image_url FROM posts WHERE id = $1', [postId]);
            if (post.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            if (post.rows[0].user_id !== userId) {
                return res.status(403).json({ success: false, message: 'You can only delete your own posts' });
            }

            if (post.rows[0].image_url) {
                const imagePath = path.join(__dirname, '../../', post.rows[0].image_url);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }

            await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
            res.json({ success: true, message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).json({ success: false, message: 'Error deleting post' });
        }
    }
};

module.exports = postController;