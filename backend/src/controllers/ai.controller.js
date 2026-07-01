const { openai } = require('../config/openai');
const pool = require('../config/database');

const aiController = {
    async improvePost(req, res) {
        try {
            const { content } = req.body;
            const userId = req.userId;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Please provide content to improve' });
            }

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
                await pool.query(`INSERT INTO ai_logs (user_id, original_text, ai_suggestions) VALUES ($1, $2, $3)`, [userId, content, JSON.stringify(suggestions)]);
                return res.json({ success: true, data: suggestions });
            }

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are a social media content assistant." }, 
                          { role: "user", content: `Improve this post with 3 versions (casual, motivational, creative): "${content}"` }],
                temperature: 0.7, max_tokens: 500
            });

            let suggestions = getFallbackSuggestions();
            try {
                const responseText = completion.choices[0].message.content;
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) suggestions = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                suggestions = getFallbackSuggestions();
            }

            await pool.query(`INSERT INTO ai_logs (user_id, original_text, ai_suggestions) VALUES ($1, $2, $3)`, [userId, content, JSON.stringify(suggestions)]);
            res.json({ success: true, data: suggestions });
        } catch (error) {
            console.error('AI improvement error:', error);
            const { content } = req.body;
            const suggestions = { versions: [{ style: 'casual', text: `${content}  #SocialAi` }] };
            res.json({ success: true, data: suggestions });
        }
    }
};

module.exports = aiController;