const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const reelController = {
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Video file is required' });
            }

            const { description, duration } = req.body;
            const userId = req.userId;
            const videoUrl = `/uploads/reels/${req.file.filename}`;

            const result = await pool.query(
                `INSERT INTO reels (user_id, video_url, description, duration) VALUES ($1, $2, $3, $4) RETURNING *`,
                [userId, videoUrl, description || '', duration || 0]
            );

            const userResult = await pool.query('SELECT username, full_name, profile_picture FROM users WHERE id = $1', [userId]);
            const reel = result.rows[0];
            reel.user = userResult.rows[0];

            res.status(201).json({ success: true, message: 'Reel created successfully', data: reel });
        } catch (error) {
            console.error('Create reel error:', error);
            res.status(500).json({ success: false, message: 'Error creating reel' });
        }
    },

    async getFeed(req, res) {
        try {
            const userId = req.userId;
            const { cursor, limit = 10 } = req.query;

            let query = `
                SELECT r.*, u.username, u.full_name, u.profile_picture,
                       COALESCE(rl.user_id IS NOT NULL, false) as is_liked,
                       COUNT(DISTINCT rc.id) as comments_count
                FROM reels r JOIN users u ON r.user_id = u.id
                LEFT JOIN reel_likes rl ON r.id = rl.reel_id AND rl.user_id = $1
                LEFT JOIN reel_comments rc ON r.id = rc.reel_id
            `;
            const params = [userId];
            let paramCount = 2;

            if (cursor) {
                query += ` WHERE r.created_at < (SELECT created_at FROM reels WHERE id = $${paramCount})`;
                params.push(cursor);
                paramCount++;
            }

            query += ` GROUP BY r.id, u.username, u.full_name, u.profile_picture, rl.user_id
                       ORDER BY r.created_at DESC LIMIT $${paramCount}`;
            params.push(parseInt(limit) + 1);

            const result = await pool.query(query, params);
            const reels = result.rows;
            let hasMore = false;

            if (reels.length > parseInt(limit)) {
                hasMore = true;
                reels.pop();
            }

            const nextCursor = hasMore ? reels[reels.length - 1].id : null;

            for (const reel of reels) {
                await pool.query('UPDATE reels SET views_count = views_count + 1 WHERE id = $1', [reel.id]);
            }

            res.json({ success: true, data: { reels, nextCursor, hasMore } });
        } catch (error) {
            console.error('Get reels feed error:', error);
            res.status(500).json({ success: false, message: 'Error fetching reels' });
        }
    },

    async getReel(req, res) {
        try {
            const { reelId } = req.params;
            const userId = req.userId;

            const result = await pool.query(
                `SELECT r.*, u.username, u.full_name, u.profile_picture,
                        COALESCE(rl.user_id IS NOT NULL, false) as is_liked
                 FROM reels r JOIN users u ON r.user_id = u.id
                 LEFT JOIN reel_likes rl ON r.id = rl.reel_id AND rl.user_id = $1
                 WHERE r.id = $2`,
                [userId, reelId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reel not found' });
            }

            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Get reel error:', error);
            res.status(500).json({ success: false, message: 'Error fetching reel' });
        }
    },

    // Get user's reels - updated to handle userId parameter
async getUserReels(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;
        
        // Use the provided userId or fallback to current user
        const targetUserId = userId || currentUserId;
        
        const result = await pool.query(
            `SELECT r.*, u.username, u.full_name, u.profile_picture,
                    COALESCE(rl.user_id IS NOT NULL, false) as is_liked
             FROM reels r 
             JOIN users u ON r.user_id = u.id
             LEFT JOIN reel_likes rl ON r.id = rl.reel_id AND rl.user_id = $1
             WHERE r.user_id = $2 
             ORDER BY r.created_at DESC`,
            [currentUserId, targetUserId]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get user reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user reels'
        });
    }
},

    async toggleLike(req, res) {
        try {
            const { reelId } = req.params;
            const userId = req.userId;

            const existingLike = await pool.query('SELECT id FROM reel_likes WHERE reel_id = $1 AND user_id = $2', [reelId, userId]);

            if (existingLike.rows.length > 0) {
                await pool.query('DELETE FROM reel_likes WHERE reel_id = $1 AND user_id = $2', [reelId, userId]);
                await pool.query('UPDATE reels SET likes_count = likes_count - 1 WHERE id = $1', [reelId]);
                const likesCount = await pool.query('SELECT likes_count FROM reels WHERE id = $1', [reelId]);
                res.json({ success: true, data: { liked: false, likes_count: parseInt(likesCount.rows[0].likes_count) } });
            } else {
                await pool.query('INSERT INTO reel_likes (reel_id, user_id) VALUES ($1, $2)', [reelId, userId]);
                await pool.query('UPDATE reels SET likes_count = likes_count + 1 WHERE id = $1', [reelId]);
                const likesCount = await pool.query('SELECT likes_count FROM reels WHERE id = $1', [reelId]);
                res.json({ success: true, data: { liked: true, likes_count: parseInt(likesCount.rows[0].likes_count) } });
            }
        } catch (error) {
            console.error('Toggle reel like error:', error);
            res.status(500).json({ success: false, message: 'Error toggling like' });
        }
    },

    async addComment(req, res) {
        try {
            const { reelId } = req.params;
            const { content } = req.body;
            const userId = req.userId;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            }

            const result = await pool.query(
                `INSERT INTO reel_comments (reel_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
                [reelId, userId, content]
            );

            await pool.query('UPDATE reels SET comments_count = comments_count + 1 WHERE id = $1', [reelId]);

            const userResult = await pool.query('SELECT username, full_name, profile_picture FROM users WHERE id = $1', [userId]);
            const comment = result.rows[0];
            comment.user = userResult.rows[0];

            res.status(201).json({ success: true, data: comment });
        } catch (error) {
            console.error('Add reel comment error:', error);
            res.status(500).json({ success: false, message: 'Error adding comment' });
        }
    },

    async getComments(req, res) {
        try {
            const { reelId } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const comments = await pool.query(
                `SELECT rc.*, u.username, u.full_name, u.profile_picture
                 FROM reel_comments rc JOIN users u ON rc.user_id = u.id
                 WHERE rc.reel_id = $1 ORDER BY rc.created_at DESC LIMIT $2 OFFSET $3`,
                [reelId, limit, offset]
            );

            res.json({ success: true, data: comments.rows });
        } catch (error) {
            console.error('Get reel comments error:', error);
            res.status(500).json({ success: false, message: 'Error fetching comments' });
        }
    },

    async deleteComment(req, res) {
        try {
            const { reelId, commentId } = req.params;
            const userId = req.userId;

            const comment = await pool.query('SELECT user_id FROM reel_comments WHERE id = $1 AND reel_id = $2', [commentId, reelId]);
            if (comment.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }

            if (comment.rows[0].user_id !== userId) {
                return res.status(403).json({ success: false, message: 'You can only delete your own comments' });
            }

            await pool.query('DELETE FROM reel_comments WHERE id = $1', [commentId]);
            await pool.query('UPDATE reels SET comments_count = comments_count - 1 WHERE id = $1', [reelId]);

            res.json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Delete reel comment error:', error);
            res.status(500).json({ success: false, message: 'Error deleting comment' });
        }
    },

    async delete(req, res) {
        try {
            const { reelId } = req.params;
            const userId = req.userId;

            const reel = await pool.query('SELECT user_id, video_url FROM reels WHERE id = $1', [reelId]);
            if (reel.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reel not found' });
            }

            if (reel.rows[0].user_id !== userId) {
                return res.status(403).json({ success: false, message: 'You can only delete your own reels' });
            }

            const videoPath = path.join(__dirname, '../../', reel.rows[0].video_url);
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

            await pool.query('DELETE FROM reels WHERE id = $1', [reelId]);
            res.json({ success: true, message: 'Reel deleted successfully' });
        } catch (error) {
            console.error('Delete reel error:', error);
            res.status(500).json({ success: false, message: 'Error deleting reel' });
        }
    }
};

module.exports = reelController;