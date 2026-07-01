const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const userController = {
    async getProfile(req, res) {
        try {
            const { username } = req.params;
            const currentUserId = req.userId;

            const userResult = await pool.query(
                `SELECT id, username, email, full_name, bio, profile_picture, gender, relationship_status, 
                        high_school, college, hobbies, is_private, created_at
                 FROM users WHERE username = $1`,
                [username]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const user = userResult.rows[0];

            const [followersCount, followingCount, postsCount] = await Promise.all([
                pool.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [user.id]),
                pool.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [user.id]),
                pool.query('SELECT COUNT(*) FROM posts WHERE user_id = $1', [user.id])
            ]);

            let isFollowing = false;
            let friendStatus = null;
            
            if (currentUserId && currentUserId !== user.id) {
                const followResult = await pool.query('SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2', [currentUserId, user.id]);
                isFollowing = followResult.rows.length > 0;

                const friendRequest = await pool.query(
                    `SELECT status FROM friend_requests 
                     WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
                    [currentUserId, user.id]
                );
                if (friendRequest.rows.length > 0) friendStatus = friendRequest.rows[0].status;
            }

            const profileData = {
                ...user,
                followers_count: parseInt(followersCount.rows[0].count),
                following_count: parseInt(followingCount.rows[0].count),
                posts_count: parseInt(postsCount.rows[0].count),
                is_following: isFollowing,
                friend_status: friendStatus,
                is_own_profile: currentUserId === user.id
            };

            if (!profileData.is_own_profile && user.is_private && !isFollowing && friendStatus !== 'accepted') {
                delete profileData.email;
            }

            res.json({ success: true, data: profileData });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ success: false, message: 'Error fetching profile' });
        }
    },

    async updateProfile(req, res) {
        try {
            const userId = req.userId;
            const { full_name, bio, gender, relationship_status, high_school, college, hobbies, is_private } = req.body;

            const updateFields = [];
            const values = [];
            let paramCounter = 1;

            if (full_name !== undefined) { updateFields.push(`full_name = $${paramCounter++}`); values.push(full_name); }
            if (bio !== undefined) { updateFields.push(`bio = $${paramCounter++}`); values.push(bio); }
            if (gender !== undefined) { updateFields.push(`gender = $${paramCounter++}`); values.push(gender); }
            if (relationship_status !== undefined) { updateFields.push(`relationship_status = $${paramCounter++}`); values.push(relationship_status); }
            if (high_school !== undefined) { updateFields.push(`high_school = $${paramCounter++}`); values.push(high_school); }
            if (college !== undefined) { updateFields.push(`college = $${paramCounter++}`); values.push(college); }
            if (hobbies !== undefined) { updateFields.push(`hobbies = $${paramCounter++}`); values.push(hobbies); }
            if (is_private !== undefined) { updateFields.push(`is_private = $${paramCounter++}`); values.push(is_private); }

            if (updateFields.length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }

            values.push(userId);
            const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCounter} RETURNING *`;
            const result = await pool.query(query, values);

            res.json({ success: true, message: 'Profile updated successfully', data: result.rows[0] });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Error updating profile' });
        }
    },

    async updateProfilePicture(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            const userId = req.userId;
            const profilePictureUrl = `/uploads/profile/${req.file.filename}`;

            const oldUser = await pool.query('SELECT profile_picture FROM users WHERE id = $1', [userId]);
            const result = await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING profile_picture', [profilePictureUrl, userId]);

            if (oldUser.rows[0] && oldUser.rows[0].profile_picture && !oldUser.rows[0].profile_picture.includes('ui-avatars')) {
                const oldFilePath = path.join(__dirname, '../../', oldUser.rows[0].profile_picture);
                if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            }

            res.json({ success: true, message: 'Profile picture updated successfully', data: { profile_picture: result.rows[0].profile_picture } });
        } catch (error) {
            console.error('Update profile picture error:', error);
            res.status(500).json({ success: false, message: 'Error updating profile picture' });
        }
    },

    async searchUsers(req, res) {
        try {
            const { q } = req.query;
            const currentUserId = req.userId;

            if (!q || q.length < 2) {
                return res.json({ success: true, data: [] });
            }

            const users = await pool.query(
                `SELECT id, username, full_name, profile_picture, bio FROM users 
                 WHERE (username ILIKE $1 OR full_name ILIKE $1) AND id != $2 LIMIT 20`,
                [`%${q}%`, currentUserId]
            );

            res.json({ success: true, data: users.rows });
        } catch (error) {
            console.error('Search users error:', error);
            res.status(500).json({ success: false, message: 'Error searching users' });
        }
    },

    async getFollowers(req, res) {
        try {
            const { userId } = req.params;
            const currentUserId = req.userId;

            const followers = await pool.query(
                `SELECT u.id, u.username, u.full_name, u.profile_picture, u.bio,
                        CASE WHEN f2.follower_id IS NOT NULL THEN true ELSE false END as is_following_back
                 FROM followers f JOIN users u ON f.follower_id = u.id
                 LEFT JOIN followers f2 ON f2.follower_id = $1 AND f2.following_id = u.id
                 WHERE f.following_id = $2 ORDER BY f.created_at DESC`,
                [currentUserId, userId]
            );

            res.json({ success: true, data: followers.rows });
        } catch (error) {
            console.error('Get followers error:', error);
            res.status(500).json({ success: false, message: 'Error fetching followers' });
        }
    },

    async getFollowing(req, res) {
        try {
            const { userId } = req.params;
            const following = await pool.query(
                `SELECT u.id, u.username, u.full_name, u.profile_picture, u.bio
                 FROM followers f JOIN users u ON f.following_id = u.id
                 WHERE f.follower_id = $1 ORDER BY f.created_at DESC`,
                [userId]
            );
            res.json({ success: true, data: following.rows });
        } catch (error) {
            console.error('Get following error:', error);
            res.status(500).json({ success: false, message: 'Error fetching following' });
        }
    },

    async getFriends(req, res) {
        try {
            const { userId } = req.params;
            const friends = await pool.query(
                `SELECT DISTINCT u.id, u.username, u.full_name, u.profile_picture, u.bio
                 FROM friend_requests fr JOIN users u ON (u.id = fr.sender_id OR u.id = fr.receiver_id)
                 WHERE (fr.sender_id = $1 OR fr.receiver_id = $1) AND fr.status = 'accepted' AND u.id != $1
                 ORDER BY u.full_name`,
                [userId]
            );
            res.json({ success: true, data: friends.rows });
        } catch (error) {
            console.error('Get friends error:', error);
            res.status(500).json({ success: false, message: 'Error fetching friends' });
        }
    }
};

module.exports = userController;