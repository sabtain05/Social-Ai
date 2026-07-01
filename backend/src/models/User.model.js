const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    }

    static async create(userData) {
        const { username, email, password, full_name } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
        
        const query = `
            INSERT INTO users (username, email, password_hash, full_name, profile_picture)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, full_name, profile_picture, created_at
        `;
        const result = await pool.query(query, [username, email, hashedPassword, full_name || username, defaultAvatar]);
        return result.rows[0];
    }

    static async update(id, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount}
            RETURNING id, username, email, full_name, bio, profile_picture, gender, relationship_status, high_school, college, hobbies, is_private, created_at
        `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateProfilePicture(id, profilePictureUrl) {
        const query = `UPDATE users SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING profile_picture`;
        const result = await pool.query(query, [profilePictureUrl, id]);
        return result.rows[0];
    }

    static async verifyPassword(user, password) {
        return bcrypt.compare(password, user.password_hash);
    }

    static async getUserStats(userId) {
        const queries = await Promise.all([
            pool.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [userId]),
            pool.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [userId]),
            pool.query('SELECT COUNT(*) FROM posts WHERE user_id = $1', [userId])
        ]);
        return {
            followers: parseInt(queries[0].rows[0].count),
            following: parseInt(queries[1].rows[0].count),
            posts: parseInt(queries[2].rows[0].count)
        };
    }

    static async isFollowing(followerId, followingId) {
        const query = 'SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2';
        const result = await pool.query(query, [followerId, followingId]);
        return result.rows.length > 0;
    }

    static async getFriendStatus(userId1, userId2) {
        const query = `
            SELECT status FROM friend_requests 
            WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
        `;
        const result = await pool.query(query, [userId1, userId2]);
        if (result.rows.length === 0) return 'none';
        return result.rows[0].status;
    }

    static async search(query, currentUserId, limit = 20) {
        const searchQuery = `
            SELECT id, username, full_name, profile_picture, bio
            FROM users 
            WHERE (username ILIKE $1 OR full_name ILIKE $1) AND id != $2
            LIMIT $3
        `;
        const result = await pool.query(searchQuery, [`%${query}%`, currentUserId, limit]);
        return result.rows;
    }

    static async getFollowers(userId, currentUserId) {
        const query = `
            SELECT u.id, u.username, u.full_name, u.profile_picture, u.bio,
                   CASE WHEN f2.follower_id IS NOT NULL THEN true ELSE false END as is_following_back
            FROM followers f JOIN users u ON f.follower_id = u.id
            LEFT JOIN followers f2 ON f2.follower_id = $1 AND f2.following_id = u.id
            WHERE f.following_id = $2 ORDER BY f.created_at DESC
        `;
        const result = await pool.query(query, [currentUserId, userId]);
        return result.rows;
    }

    static async getFollowing(userId) {
        const query = `
            SELECT u.id, u.username, u.full_name, u.profile_picture, u.bio
            FROM followers f JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = $1 ORDER BY f.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async getFriends(userId) {
        const query = `
            SELECT DISTINCT u.id, u.username, u.full_name, u.profile_picture, u.bio
            FROM friend_requests fr JOIN users u ON (u.id = fr.sender_id OR u.id = fr.receiver_id)
            WHERE (fr.sender_id = $1 OR fr.receiver_id = $1) AND fr.status = 'accepted' AND u.id != $1
            ORDER BY u.full_name
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
}

module.exports = User;