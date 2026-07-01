const pool = require('../config/database');

const notificationController = {
    async getNotifications(req, res) {
        try {
            const userId = req.userId;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const notifications = await pool.query(
                `SELECT n.* FROM notifications n WHERE n.user_id = $1 ORDER BY n.created_at DESC LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );

            const unreadCount = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false', [userId]);

            res.json({ success: true, data: { notifications: notifications.rows, unread_count: parseInt(unreadCount.rows[0].count) } });
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ success: false, message: 'Error fetching notifications' });
        }
    },

    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.userId;

            const result = await pool.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id', [notificationId, userId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Notification not found' });
            }

            res.json({ success: true, message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ success: false, message: 'Error marking notification as read' });
        }
    },

    async markAllAsRead(req, res) {
        try {
            const userId = req.userId;
            await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false', [userId]);
            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all as read error:', error);
            res.status(500).json({ success: false, message: 'Error marking notifications as read' });
        }
    },

    async getUnreadCount(req, res) {
        try {
            const userId = req.userId;
            const result = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false', [userId]);
            res.json({ success: true, data: { unread_count: parseInt(result.rows[0].count) } });
        } catch (error) {
            console.error('Get unread count error:', error);
            res.status(500).json({ success: false, message: 'Error getting unread count' });
        }
    }
};

module.exports = notificationController;