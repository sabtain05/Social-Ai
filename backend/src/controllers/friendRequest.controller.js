const pool = require('../config/database');

const friendRequestController = {
    async sendRequest(req, res) {
        try {
            const { receiverId } = req.params;
            const senderId = req.userId;

            if (senderId === receiverId) {
                return res.status(400).json({ success: false, message: 'You cannot send friend request to yourself' });
            }

            const existingFriendship = await pool.query(
                `SELECT 1 FROM friend_requests WHERE ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)) AND status = 'accepted'`,
                [senderId, receiverId]
            );
            if (existingFriendship.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'You are already friends with this user' });
            }

            const existingRequest = await pool.query(`SELECT id, status FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2`, [senderId, receiverId]);
            if (existingRequest.rows.length > 0) {
                if (existingRequest.rows[0].status === 'pending') {
                    return res.status(400).json({ success: false, message: 'Friend request already sent' });
                }
            } else {
                await pool.query(`INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`, [senderId, receiverId]);
            }

            await pool.query(`INSERT INTO notifications (user_id, type, reference_id, content) VALUES ($1, 'friend_request', $2, $3)`, [receiverId, senderId, 'sent you a friend request']);
            res.json({ success: true, message: 'Friend request sent successfully' });
        } catch (error) {
            console.error('Send friend request error:', error);
            res.status(500).json({ success: false, message: 'Error sending friend request' });
        }
    },

    async acceptRequest(req, res) {
        try {
            const { requestId } = req.params;
            const userId = req.userId;

            const request = await pool.query(`SELECT id, sender_id FROM friend_requests WHERE id = $1 AND receiver_id = $2 AND status = 'pending'`, [requestId, userId]);
            if (request.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Friend request not found' });
            }

            await pool.query(`UPDATE friend_requests SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [requestId]);
            await pool.query(`INSERT INTO notifications (user_id, type, reference_id, content) VALUES ($1, 'friend_accept', $2, $3)`, [request.rows[0].sender_id, userId, 'accepted your friend request']);

            res.json({ success: true, message: 'Friend request accepted' });
        } catch (error) {
            console.error('Accept friend request error:', error);
            res.status(500).json({ success: false, message: 'Error accepting friend request' });
        }
    },

    async rejectRequest(req, res) {
        try {
            const { requestId } = req.params;
            const userId = req.userId;

            const result = await pool.query(`UPDATE friend_requests SET status = 'rejected' WHERE id = $1 AND receiver_id = $2 AND status = 'pending' RETURNING id`, [requestId, userId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Friend request not found' });
            }

            res.json({ success: true, message: 'Friend request rejected' });
        } catch (error) {
            console.error('Reject friend request error:', error);
            res.status(500).json({ success: false, message: 'Error rejecting friend request' });
        }
    },

    async getPendingRequests(req, res) {
        try {
            const userId = req.userId;
            const requests = await pool.query(
                `SELECT fr.id, fr.created_at, u.id as sender_id, u.username, u.full_name, u.profile_picture
                 FROM friend_requests fr JOIN users u ON fr.sender_id = u.id
                 WHERE fr.receiver_id = $1 AND fr.status = 'pending' ORDER BY fr.created_at DESC`,
                [userId]
            );
            res.json({ success: true, data: requests.rows });
        } catch (error) {
            console.error('Get pending requests error:', error);
            res.status(500).json({ success: false, message: 'Error fetching friend requests' });
        }
    }
};

module.exports = friendRequestController;