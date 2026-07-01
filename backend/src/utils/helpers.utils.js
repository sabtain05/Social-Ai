const helpers = {
    generateRandomString: (length = 32) => {
        return require('crypto').randomBytes(length).toString('hex');
    },

    formatDate: (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const hours = d.getHours();
            const minutes = d.getMinutes();
            return `Today at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    },

    truncateText: (text, length = 100, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    },

    generateAvatar: (name, size = 200) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&length=2`;
    }
};

module.exports = helpers;