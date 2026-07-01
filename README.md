# Social Ai

### AI-Powered Social Media Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

**Social Ai** is a modern social media platform that combines traditional social networking with cutting-edge AI technology. The platform features an AI Content Assistant that helps users create better, more engaging posts by providing intelligent suggestions while maintaining their authentic voice.

**Key Differentiator:** Unlike traditional social media platforms, Social Ai uses OpenAI's GPT to suggest 2-3 improved versions of any post, helping users express themselves more effectively.

---

## Key Features

### AI Content Assistant
- **Intelligent Post Improvement**: Get 3 AI-generated versions of your posts
- **Multiple Styles**: Choose from casual, motivational, creative, funny, or emotional tones
- **Maintains Original Intent**: AI suggestions preserve your authentic voice
- **Real-time Suggestions**: Instant feedback with just one click
- **AI Interaction Logging**: Track which suggestions users select
- **Fallback Suggestions**: Works even without OpenAI API key

### Social Features
- **User Authentication**: JWT-based secure login/registration
- **Post Creation**: Create text posts with optional images
- **Engagement**: Like, comment, and share posts
- **Follow System**: Follow/unfollow other users
- **Friend Requests**: Send, accept, reject friend requests
- **Privacy Controls**: Public or friends-only posts
- **Notifications**: Real-time notifications for interactions
- **User Profiles**: Customizable profiles with picture upload
- **Education Section**: Add high school and college with search dropdown
- **Hobbies & Interests**: Add and manage hobbies

### Reels (Video Content)
- **Infinite Scrolling**: Seamless TikTok/Instagram-style scrolling
- **Auto-play**: Videos auto-play when in viewport
- **Engagement**: Like, comment, share reels
- **View Counts**: Track reel popularity
- **Profile Integration**: Reels appear in user profiles
- **Video Upload**: Upload videos up to 50MB
- **Duration Display**: Show reel duration on thumbnails

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Three-Column Layout**: Clean, modern interface (Left Sidebar | Feed | Right Sidebar)
- **Real-time Updates**: Live notifications and feed updates
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Beautiful loading indicators
- **Error Handling**: Graceful error messages

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.0.3 | React framework with SSR |
| React | 18.2.0 | UI library |
| TypeScript | 5.3.2 | Type-safe JavaScript |
| Tailwind CSS | 3.3.6 | Utility-first CSS framework |
| Framer Motion | 10.16.16 | Smooth animations |
| React Query | 3.39.3 | Data fetching and caching |
| React Hook Form | 7.48.2 | Form handling |
| Heroicons | 2.0.18 | Icon library |
| React Hot Toast | 2.4.1 | Toast notifications |
| date-fns | 2.30.0 | Date formatting |
| React Share | 5.0.3 | Social media share buttons |
| React Icons | 4.12.0 | Additional icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express | 4.18.2 | Web framework |
| PostgreSQL | 14 | Primary database |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 2.4.3 | Password hashing |
| OpenAI | 4.20.0 | AI content generation |
| Multer | 1.4.5 | File uploads |
| Nodemailer | 6.9.7 | Email sending |
| Helmet | 7.0.0 | Security headers |
| Morgan | 1.10.0 | HTTP request logging |
| Express-Validator | 7.0.1 | Input validation |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                    │
│                         Port: 3500                          │
├─────────────────────────────────────────────────────────────┤
│  Pages: Feed, Profile, Reels, Notifications, Settings       │
│  Components: PostCard, ReelCard, CommentSection, etc.      │
│  Context: AuthContext for user state management            │
│  Services: API client with interceptors                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend (Express)                     │
│                         Port: 8000                          │
├─────────────────────────────────────────────────────────────┤
│  RESTful API with JWT Authentication                       │
│  Controllers: Auth, User, Post, Reel, Comments, etc.       │
│  Middleware: Auth, Upload, Validation                     │
│  Routes: 11 modular route files                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ SQL Queries
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
├─────────────────────────────────────────────────────────────┤
│  Tables: users, posts, comments, likes, followers,          │
│  friend_requests, reels, reel_likes, reel_comments,        │
│  notifications, shares, ai_logs, institutions              │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **OpenAI API Key** (for AI features)
- **Git** (for version control)

### Quick Installation

#### Backend Setup
```bash
cd backend
npm install express cors dotenv bcryptjs jsonwebtoken pg multer openai helmet morgan express-validator axios nodemailer
npm install -D nodemon
mkdir -p uploads/profile uploads/posts uploads/reels
```

#### Frontend Setup
```bash
cd frontend
npm install next@14.0.3 react@18.2.0 react-dom@18.2.0 axios react-hot-toast react-query date-fns @heroicons/react @headlessui/react framer-motion react-hook-form react-share react-icons yup swr
npm install -D @types/node @types/react @types/react-dom typescript tailwindcss autoprefixer postcss eslint eslint-config-next
npx tailwindcss init -p
mkdir -p src/components src/pages src/styles src/contexts src/services src/types src/utils public/images
```

---

## Environment Variables

### Backend (.env)
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
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3500

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3500
```

---

## Database Setup

### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE social_ai;

# Connect to database
\c social_ai;

# Run schema
\i database/schema.sql

# Exit
\q
```

### One-line Setup
```bash
psql -U postgres -c "CREATE DATABASE social_ai;"
psql -U postgres -d social_ai -f database/schema.sql
```

### Database Schema Overview

| Table | Description |
|-------|-------------|
| `users` | User accounts and profiles |
| `posts` | User posts with AI improvement metadata |
| `comments` | Post comments |
| `likes` | Post likes |
| `followers` | User follow relationships |
| `friend_requests` | Friend request system |
| `reels` | Video content |
| `reel_likes` | Reel likes |
| `reel_comments` | Reel comments |
| `notifications` | User notifications |
| `shares` | Share tracking |
| `ai_logs` | AI interaction logs |
| `institutions` | School/college database |

---

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs at: `http://localhost:8000`

### Start Frontend Server
```bash
cd frontend
npm run dev
```
App runs at: `http://localhost:3500`

### Access Application
1. Open browser: `http://localhost:3500`
2. Create an account or login
3. Start posting and using AI features!

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/profile-picture` | Upload profile picture |
| GET | `/api/users/search` | Search users |
| GET | `/api/users/:userId/followers` | Get followers |
| GET | `/api/users/:userId/following` | Get following |
| GET | `/api/users/:userId/friends` | Get friends |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/posts/feed` | Get feed |
| GET | `/api/posts/user/:userId` | Get user posts |
| DELETE | `/api/posts/:postId` | Delete post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:postId/comments` | Add comment |
| GET | `/api/posts/:postId/comments` | Get comments |
| DELETE | `/api/posts/:postId/comments/:commentId` | Delete comment |

### Likes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/likes/:postId/toggle` | Like/unlike post |

### Follow
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/follow/:userId/follow` | Follow user |
| DELETE | `/api/follow/:userId/unfollow` | Unfollow user |

### Friend Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/friend-requests/send/:receiverId` | Send friend request |
| POST | `/api/friend-requests/:requestId/accept` | Accept request |
| POST | `/api/friend-requests/:requestId/reject` | Reject request |
| GET | `/api/friend-requests/pending` | Get pending requests |

### Reels
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reels` | Create reel |
| GET | `/api/reels/feed` | Get reel feed |
| GET | `/api/reels/user/:userId` | Get user reels |
| GET | `/api/reels/:reelId` | Get single reel |
| POST | `/api/reels/:reelId/like` | Like/unlike reel |
| POST | `/api/reels/:reelId/comments` | Add comment |
| DELETE | `/api/reels/:reelId/comments/:commentId` | Delete comment |
| DELETE | `/api/reels/:reelId` | Delete reel |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/improve` | Generate AI suggestions |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/:notificationId/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Institutions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/institutions/search` | Search institutions |

---

## Project Structure

```
social-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── openai.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── like.controller.js
│   │   │   ├── follow.controller.js
│   │   │   ├── friendRequest.controller.js
│   │   │   ├── share.controller.js
│   │   │   ├── ai.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── institution.controller.js
│   │   │   └── reel.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.model.js
│   │   │   └── Post.model.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── post.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── like.routes.js
│   │   │   ├── follow.routes.js
│   │   │   ├── friendRequest.routes.js
│   │   │   ├── share.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── institution.routes.js
│   │   │   └── reel.routes.js
│   │   ├── services/
│   │   │   ├── email.service.js
│   │   │   └── ai.service.js
│   │   └── utils/
│   │       ├── jwt.utils.js
│   │       ├── validation.utils.js
│   │       └── helpers.utils.js
│   ├── uploads/
│   │   ├── profile/
│   │   ├── posts/
│   │   └── reels/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── UserProfileSummary.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── common/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── Post/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostCreator.tsx
│   │   │   │   ├── AISuggestions.tsx
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   └── ShareModal.tsx
│   │   │   ├── Reel/
│   │   │   │   ├── ReelComments.tsx
│   │   │   │   └── ReelShareModal.tsx
│   │   │   ├── Profile/
│   │   │   │   ├── EditProfileModal.tsx
│   │   │   │   └── InstitutionSearch.tsx
│   │   │   └── user/
│   │   │       ├── UserCard.tsx
│   │   │       └── FriendRequestCard.tsx
│   │   ├── pages/
│   │   │   ├── _app.tsx
│   │   │   ├── _document.tsx
│   │   │   ├── index.tsx
│   │   │   ├── welcome.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── feed.tsx
│   │   │   ├── reels.tsx
│   │   │   ├── create-reel.tsx
│   │   │   ├── reels/[id].tsx
│   │   │   ├── profile/[username].tsx
│   │   │   ├── friends.tsx
│   │   │   ├── followers.tsx
│   │   │   ├── following.tsx
│   │   │   ├── notifications.tsx
│   │   │   ├── about.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── terms.tsx
│   │   │   ├── cookies.tsx
│   │   │   └── faqs.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── imageUtils.ts
│   │       └── constants.ts
│   ├── public/
│   │   └── logo.png
│   ├── .env.local
│   ├── .gitignore
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docker-compose.yml
├── README.md
└── .gitignore
```

---


## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write clean, readable code
- Add appropriate comments
- Update documentation
- Test your changes

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

### Get Help
- **Email**: sabtainalipk144@gmail.com

### Report Issues
- Open an issue on [GitHub Issues](https://github.com/YOUR_USERNAME/social-ai/issues)
- Provide detailed steps to reproduce

### Feature Requests
- Submit feature requests through [GitHub Discussions](https://github.com/YOUR_USERNAME/social-ai/discussions)

---

## Show Your Support

Give a ⭐️ if this project helped you!

### Star History
[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/social-ai&type=Date)](https://star-history.com/#YOUR_USERNAME/social-ai&Date)

---

## Acknowledgements

- [OpenAI](https://openai.com/) for GPT API
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Hot Toast](https://react-hot-toast.com/) for toast notifications
- All contributors and open-source projects

---

## Changelog

### v1.0.0 (Current)
-  Initial release
-  User authentication with JWT
-  Post creation with AI improvement
-  Like, comment, share functionality
-  Follow system and friend requests
-  Reels with infinite scrolling
-  Profile management with picture upload
-  Notifications system
-  Responsive design with Tailwind CSS
-  Institution search for education fields
-  OpenAI GPT integration for AI content assistant
-  Three-column layout

---

## Contact

**Developer:** [Your Name]  
**Email:** your-email@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**LinkedIn:** [Your Name](https://linkedin.com/in/yourusername)

---

## Quick Commands

| Task | Command |
|------|---------|
| Start Backend | `cd backend && npm run dev` |
| Start Frontend | `cd frontend && npm run dev` |
| Install Backend | `cd backend && npm install` |
| Install Frontend | `cd frontend && npm install` |
| Setup Database | `psql -U postgres -d social_ai -f database/schema.sql` |
| Create Database | `psql -U postgres -c "CREATE DATABASE social_ai;"` |
| Clear Backend Cache | `cd backend && rm -rf node_modules package-lock.json && npm install` |
| Clear Frontend Cache | `cd frontend && rm -rf node_modules package-lock.json && npm install` |

---

## Deployment

### Deploy Backend (Railway/Heroku)
```bash
# Railway
railway login
railway init
railway up

# Heroku
heroku create social-ai-backend
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Vercel
vercel login
vercel

# Netlify
netlify login
netlify deploy
```

---

**Built by Sabtain Ali**
