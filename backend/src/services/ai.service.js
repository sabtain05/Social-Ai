const { openai } = require('../config/openai');
const pool = require('../config/database');

class AIService {
    async improvePost(content, userId) {
        const getFallbackSuggestions = () => {
            const styles = ['casual', 'motivational', 'creative'];
            const emojis = ['✨', '💭', '🌟'];
            const hashtags = ['#SocialAi', '#DailyThoughts'];
            const versions = styles.map((style, index) => ({
                style, text: `${content} ${emojis[index]} ${hashtags.join(' ')}`
            }));
            return { versions };
        };

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            const suggestions = getFallbackSuggestions();
            await this.logAIInteraction(userId, content, suggestions);
            return suggestions;
        }

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a social media content assistant." },
                    { role: "user", content: `Improve this post with 3 versions (casual, motivational, creative): "${content}"` }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            let suggestions = getFallbackSuggestions();
            try {
                const responseText = completion.choices[0].message.content;
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) suggestions = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                suggestions = getFallbackSuggestions();
            }

            await this.logAIInteraction(userId, content, suggestions);
            return suggestions;
        } catch (error) {
            console.error('AI Service Error:', error);
            const suggestions = getFallbackSuggestions();
            await this.logAIInteraction(userId, content, suggestions);
            return suggestions;
        }
    }

    async logAIInteraction(userId, originalText, suggestions) {
        try {
            await pool.query(
                `INSERT INTO ai_logs (user_id, original_text, ai_suggestions) VALUES ($1, $2, $3)`,
                [userId, originalText, JSON.stringify(suggestions)]
            );
        } catch (error) {
            console.error('Error logging AI interaction:', error);
        }
    }
}

module.exports = new AIService();