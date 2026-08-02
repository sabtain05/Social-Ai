# 🚀 Social Ai - Complete README.md

Here's a comprehensive README file for your Social Ai platform with emojis:

```markdown
# 🚀 Social Ai - Post Smarter with AI

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/social-ai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-v18%2B-brightgreen.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black.svg)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org)

![Social Ai Banner](public/images/og-image.jpg)

## ✨ Overview

**Social Ai** is a modern, AI-powered social media platform that combines traditional social networking with cutting-edge artificial intelligence. Built with ❤️ using Next.js, Node.js, and PostgreSQL, it helps users create better content with intelligent AI suggestions.

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Content Assistant** | Get 2-3 improved versions of your posts with different styles |
| 📝 **Smart Post Creation** | Create engaging posts with AI-powered enhancements |
| 👥 **Social Networking** | Follow users, send friend requests, and build your network |
| ❤️ **Engagement Tools** | Like, comment, and share posts across multiple platforms |
| 🎥 **Reels Feature** | Create and watch short-form videos with infinite scrolling |
| 🔒 **Privacy Controls** | Public/Private posts and friend-only content |
| 📱 **Responsive Design** | Perfect experience on all devices |
| 🎨 **Modern UI** | Clean, minimal, and intuitive interface |

---

## 📸 Screenshots

### 🏠 Home Feed
![Home Feed](screenshots/feed.png)

### 🤖 AI Assistant
![AI Assistant](screenshots/ai-assistant.png)

### 👤 Profile Page
![Profile Page](screenshots/profile.png)

### 🎥 Reels
![Reels](screenshots/reels.png)

---

## 🛠️ Tech Stack

### 🖥️ Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **OpenAI API** - AI content generation
- **Multer** - File uploads
- **Nodemailer** - Email services

### 🎨 Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Framer Motion** - Animations
- **Heroicons** - Icon library

### 🗄️ Database
- **PostgreSQL** - Primary database
- **UUID** - Unique identifiers
- **JSONB** - Flexible data storage

---

## 📁 Project Structure

```
social-ai/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Configuration files
│   │   ├── 📁 controllers/     # Route controllers
│   │   ├── 📁 middleware/      # Custom middleware
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 services/        # Business logic
│   │   └── 📁 utils/           # Utility functions
│   ├── 📁 uploads/             # Uploaded files
│   ├── 📄 .env                 # Environment variables
│   └── 📄 server.js            # Entry point
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 pages/           # Next.js pages
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 styles/          # Global styles
│   │   ├── 📁 types/           # TypeScript types
│   │   └── 📁 utils/           # Utility functions
│   ├── 📁 public/              # Static assets
│   └── 📄 next.config.js       # Next.js config
│
├── 📁 database/
│   ├── 📄 schema.sql           # Database schema
│   └── 📄 seed.sql             # Sample data
│
└── 📄 README.md                # This file
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js v18 or higher 🟢
- PostgreSQL v14 or higher 🐘
- npm or yarn 📦
- OpenAI API key 🤖

### ⚡ Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/social-ai.git
cd social-ai
```

#### 2️⃣ Setup Backend 🖥️

```bash
cd backend
npm install
# Wait for dependencies to install...

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Setup database
psql -U postgres
CREATE DATABASE social_ai;
\c social_ai;
\i ../database/schema.sql

# Start backend server
npm run dev
```

#### 3️⃣ Setup Frontend 🎨

```bash
cd frontend
npm install
# Wait for dependencies to install...

# Create environment file
cp .env.local.example .env.local
# Edit if needed

# Start frontend server
npm run dev
```

#### 4️⃣ Open Application 🌐

- Frontend: [http://localhost:3500](http://localhost:3500)
- Backend API: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🔧 Environment Variables

### Backend `.env` 📄

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_ai
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3500

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Frontend `.env.local` 📄

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3500
```

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### 👤 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/profile-picture` | Upload profile picture |
| GET | `/api/users/search` | Search users |

### 📝 Post Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/posts/feed` | Get feed |
| GET | `/api/posts/user/:userId` | Get user posts |
| DELETE | `/api/posts/:postId` | Delete post |

### 🤖 AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/improve` | Get AI suggestions |

### 🎥 Reel Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reels` | Create reel |
| GET | `/api/reels/feed` | Get reels feed |
| GET | `/api/reels/:reelId` | Get single reel |
| POST | `/api/reels/:reelId/like` | Like reel |

---

## 🎨 Features Walkthrough

### 🤖 AI Content Assistant

1. ✍️ Write your post in the creator
2. 🤖 Click "Improve with AI"
3. ✨ Get 3 improved versions with different styles
4. 🎯 Select and publish your favorite

### 👥 Social Features

- **Follow System**: Follow users to see their posts
- **Friend Requests**: Send, accept, or reject requests
- **Privacy**: Control who sees your content
- **Engagement**: Like, comment, share posts

### 🎥 Reels

- **Infinite Scroll**: Addictive scrolling experience
- **Auto-play**: Videos play when visible
- **Likes & Comments**: Engage with content
- **Share**: Share reels across platforms

---

## 🛡️ Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - BCrypt for password security
- ✅ **Input Validation** - Express-validator middleware
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Controlled cross-origin requests
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **XSS Protection** - Sanitize user input

---

## 🤝 Contributing

We welcome contributions! 🎉

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

### 📝 Code Style

- Use TypeScript for frontend
- Use ESLint and Prettier
- Follow naming conventions
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) - For AI capabilities
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Heroicons](https://heroicons.com) - Icons
- [Framer Motion](https://framer.com/motion) - Animations

---

## 📞 Support

### 🐛 Report Issues
- GitHub Issues: [Create Issue](https://github.com/yourusername/social-ai/issues)
- Email: support@socialai.com

### 💬 Community
- Twitter: [@SocialAi](https://twitter.com/socialai)
- Discord: [Join Server](https://discord.gg/socialai)

---

## 🌟 Show Your Support

If you like this project, please ⭐ star the repository!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/social-ai.svg?style=social)](https://github.com/yourusername/social-ai)

---

## 📊 Project Status

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Posts | ✅ Complete |
| AI Assistant | ✅ Complete |
| Comments | ✅ Complete |
| Likes | ✅ Complete |
| Follow System | ✅ Complete |
| Friend Requests | ✅ Complete |
| Reels | ✅ Complete |
| Notifications | ✅ Complete |
| Search | ✅ Complete |
| Profile | ✅ Complete |
| Mobile Responsive | ✅ Complete |

---

## 🚀 Roadmap

- [ ] 🎥 Live Streaming
- [ ] 💬 Direct Messaging
- [ ] 🌐 Multi-language Support
- [ ] 📱 Mobile App (React Native)
- [ ] 🔔 Push Notifications
- [ ] 📊 Analytics Dashboard
- [ ] 🎨 Dark Mode
- [ ] 🔒 2FA Authentication

---

## 🔥 Quick Commands

```bash
# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm run dev

# Database Commands
psql -U postgres
\c social_ai
\dt  # List tables

# Production Build
cd frontend && npm run build
cd backend && npm start

# Install Dependencies
cd backend && npm install
cd frontend && npm install
```

---

## 💖 Made with Love

Built with ❤️ by the Social Ai Team

Copyright © 2024 Social Ai. All Rights Reserved. 🚀

---

> **Social Ai - Post Smarter with AI** ✨
> 
> *"Write better posts, express yourself, and connect smarter using AI."* 🎯

---

## 🎯 Quick Links

- 🌐 [Website](https://socialai.com)
- 🐦 [Twitter](https://twitter.com/socialai)
- 📘 [Documentation](https://docs.socialai.com)
- 💬 [Discord](https://discord.gg/socialai)
- 🐛 [Report Bug](https://github.com/yourusername/social-ai/issues)
- ⭐ [Star on GitHub](https://github.com/yourusername/social-ai)

---

**Happy Coding!** 🚀👨‍💻👩‍💻

[⬆ Back to Top](#-social-ai---post-smarter-with-ai)
```

This README file includes:
- ✅ Beautiful emojis throughout
- ✅ Complete project overview
- ✅ Installation instructions
- ✅ Tech stack details
- ✅ API documentation
- ✅ Features walkthrough
- ✅ Contributing guidelines
- ✅ License information
- ✅ Support channels
- ✅ Roadmap
- ✅ Quick commands
