const pool = require('../config/database');

class Post {
    static async create(postData) {
        const { user_id, content, original_content, ai_improved = false, privacy = 'public', image_url } = postData;
        const query = `
            INSERT INTO posts (user_id, content, original_content, ai_improved, privacy, image_url)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await pool.query(query, [user_id, content, original_content, ai_improved, privacy, image_url]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM posts WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async getFeed(userId, limit = 10, offset = 0) {
        const query = `
            SELECT p.*, u.username, u.full_name, u.profile_picture,
                   COALESCE(l.user_id IS NOT NULL, false) as is_liked
            FROM posts p JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1
            WHERE p.user_id = $1 OR p.user_id IN (SELECT following_id FROM followers WHERE follower_id = $1)
            ORDER BY p.created_at DESC LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [userId, limit, offset]);
        return result.rows;
    }

    static async findByUserId(userId, currentUserId, limit = 10, offset = 0) {
        const query = `
            SELECT p.*, u.username, u.full_name, u.profile_picture,
                   COALESCE(l.user_id IS NOT NULL, false) as is_liked
            FROM posts p JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1
            WHERE p.user_id = $2 ORDER BY p.created_at DESC LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [currentUserId, userId, limit, offset]);
        return result.rows;
    }

    static async delete(id) {
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async isOwner(postId, userId) {
        const query = 'SELECT 1 FROM posts WHERE id = $1 AND user_id = $2';
        const result = await pool.query(query, [postId, userId]);
        return result.rows.length > 0;
    }

    static async incrementLikes(postId) {
        const query = 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count';
        const result = await pool.query(query, [postId]);
        return result.rows[0].likes_count;
    }

    static async decrementLikes(postId) {
        const query = 'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1 RETURNING likes_count';
        const result = await pool.query(query, [postId]);
        return result.rows[0].likes_count;
    }

    static async getPostWithAuthor(postId, userId) {
        const query = `
            SELECT p.*, u.username, u.full_name, u.profile_picture, u.bio,
                   COALESCE(l.user_id IS NOT NULL, false) as is_liked
            FROM posts p JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $2
            WHERE p.id = $1
        `;
        const result = await pool.query(query, [postId, userId]);
        return result.rows[0];
    }
}

module.exports = Post;