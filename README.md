# Sync - Real-time Collaborative Development Platform

A full-stack collaborative development platform that enables real-time project collaboration with AI assistance. Built for the GDG Hackathon.

## Features

- **Real-time Collaboration**: Multiple users can work on projects simultaneously with Socket.IO
- **AI Integration**: Built-in AI assistant (using Google Generative AI) for code suggestions and help
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Project Management**: Create, manage, and collaborate on multiple projects
- **WebContainer Integration**: In-browser development environment
- **Redis Caching**: Fast data access with Redis integration
- **Modern UI**: React-based frontend with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Redis** for caching
- **JWT** for authentication
- **Google Generative AI** for AI features
- **Morgan** for logging

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.IO Client** for real-time updates
- **WebContainer API** for in-browser development
- **Highlight.js** for syntax highlighting
- **Markdown-to-JSX** for rendering markdown
- **React Toastify** for notifications

## Project Structure

```
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth & validation
│   └── db/              # Database connection
├── frontend/
│   ├── src/
│   │   ├── auth/        # Authentication components
│   │   ├── config/      # Configuration files
│   │   ├── context/     # React context
│   │   ├── routes/      # Route definitions
│   │   └── screens/     # Page components
│   └── public/          # Static assets
└── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Parthadotio/Sync_.git
   cd Sync_
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=9000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   GOOGLE_AI_KEY=your_google_ai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the backend server and frontend development server.

## Usage

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Frontend Only
```bash
cd frontend
npm run dev
```

## API Endpoints

### User Routes (`/users`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)
- `POST /logout` - Logout user

### Project Routes (`/projects`)
- `POST /` - Create a new project
- `GET /` - Get all user projects
- `GET /:id` - Get project by ID
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

### AI Routes (`/ai`)
- `POST /generate` - Generate AI responses
- `POST /complete` - Get code completions

## Real-time Features

The application uses Socket.IO for real-time collaboration:
- **Project Messages**: Send and receive messages in real-time
- **AI Integration**: Mention `@ai` in messages to get AI assistance
- **Live Updates**: See changes from other collaborators instantly

## AI Integration

The AI assistant can be invoked by mentioning `@ai` in project messages:
```
@ai How do I create a REST API in Express?
```

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/project` - Project list
- `/project/:id` - Project details and editor
- `/about` - About page

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in cookies
- Protected routes require valid JWT
- Passwords are hashed using bcrypt

## License

This project is part of the GDG Hackathon.

## Author

**Parthadotio**

## Contributing

Contributions, issues, and feature requests are welcome!

---

Built for GDG Hackathon
