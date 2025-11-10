# TaskFlow - Project Management System with Team Collaboration

A comprehensive full-stack MERN application for task and project management with real-time collaboration features.

## 🚀 Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Project Management**: Create, update, and manage multiple projects
- **Task Management**: Organize tasks with priorities, statuses, due dates, and assignments
- **Team Collaboration**: Real-time updates, comments, and notifications
- **Real-time Updates**: Socket.io integration for live collaboration
- **Responsive Design**: Modern UI that works on all devices
- **Comprehensive Testing**: Unit, integration, and E2E tests

## 📋 Tech Stack

- **Frontend**: React, React Router, Axios, Socket.io-client, CSS3
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Testing**: Jest, Supertest, React Testing Library
- **Deployment**: Ready for Render/Vercel/Netlify

## 🏗️ Project Structure

```
week8/
├── server/                 # Backend application
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   └── tests/             # Backend tests
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
└── docs/                  # Documentation
```

## 🚦 Getting Started

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Quick Start

1. **Clone the repository:**

```bash
git clone <repository-url>
cd week8
```

2. **Install dependencies:**

```bash
# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..
```

3. **Set up environment variables:**

   - Copy `.env.example` files in both `server/` and `client/` directories
   - Update with your configuration

4. **Start the application:**
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

The application will be available at `http://localhost:3000`

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

## 📚 API Documentation

See [API Documentation](./docs/API.md) for detailed endpoint documentation.

## 🏗️ Architecture

See [Architecture Overview](./docs/ARCHITECTURE.md) for technical architecture details.

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Update CORS settings for production

### Frontend Deployment (Vercel/Netlify)

1. Set `REACT_APP_API_URL` to your backend URL
2. Deploy the `client` directory
3. Configure build settings

## 📖 User Guide

See [User Guide](./docs/USER_GUIDE.md) for detailed usage instructions.

## 🎥 Demo

[Link to video demonstration will be added here]

## 👥 Contributors

- Your Name

## 📄 License

MIT License

## 🙏 Acknowledgments

Built as a capstone project for the MERN Stack course.
