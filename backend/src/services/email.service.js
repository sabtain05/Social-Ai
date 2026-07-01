const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialize();
    }

    initialize() {
        if (process.env.NODE_ENV === 'development') {
            nodemailer.createTestAccount().then(account => {
                this.transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: { user: account.user, pass: account.pass }
                });
                console.log('Email service initialized');
            }).catch(error => console.error('Email error:', error));
        }
    }

    async sendEmail({ to, subject, html }) {
        try {
            if (!this.transporter) return { success: false, error: 'Email not configured' };
            const info = await this.transporter.sendMail({
                from: '"Social Ai" <noreply@socialai.com>',
                to, subject, html
            });
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Email error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(user) {
        const html = `
            <div style="font-family: Arial; max-width: 600px;">
                <h1 style="color: #4F46E5;">Welcome to Social Ai, ${user.full_name || user.username}!</h1>
                <p>We're excited to have you on board. Social Ai is your new home for creative social networking with AI-powered content assistance.</p>
                <a href="${process.env.FRONTEND_URL}/feed" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to Feed</a>
            </div>
        `;
        return this.sendEmail({ to: user.email, subject: 'Welcome to Social Ai!', html });
    }
}

module.exports = new EmailService();