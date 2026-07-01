const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const testOpenAIConnection = async () => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            console.warn('OPENAI_API_KEY is not set');
            return false;
        }
        console.log('OpenAI configured');
        return true;
    } catch (error) {
        console.error('OpenAI connection failed:', error.message);
        return false;
    }
};

module.exports = { openai, testOpenAIConnection };