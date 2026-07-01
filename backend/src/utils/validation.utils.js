const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return re.test(username);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const sanitizeContent = (content) => {
    return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/g, '')
        .replace(/javascript:/gi, '')
        .trim();
};

module.exports = { validateEmail, validateUsername, validatePassword, sanitizeContent };