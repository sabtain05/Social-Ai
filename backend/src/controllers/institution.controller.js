const pool = require('../config/database');

const institutionController = {
    async search(req, res) {
        try {
            const { q, type } = req.query;

            if (!q || q.length < 2) {
                return res.json({ success: true, data: [] });
            }

            let query = `SELECT id, name, type, country, city, is_pakistani FROM institutions WHERE name ILIKE $1`;
            const params = [`%${q}%`];

            if (type && type !== 'undefined') {
                if (type === 'college') {
                    query += ` AND type IN ('college', 'university')`;
                } else {
                    query += ` AND type = $2`;
                    params.push(type);
                }
            }

            query += ` ORDER BY is_pakistani DESC, name ASC LIMIT 20`;
            const institutions = await pool.query(query, params);
            res.json({ success: true, data: institutions.rows });
        } catch (error) {
            console.error('Search institutions error:', error);
            res.status(500).json({ success: false, message: 'Error searching institutions' });
        }
    }
};

module.exports = institutionController;