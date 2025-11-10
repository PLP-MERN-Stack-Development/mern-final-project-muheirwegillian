# Technical Architecture

## Overview

TaskFlow is a full-stack MERN application designed for project and task management with real-time collaboration features.

## System Architecture

```
┌─────────────┐
│   Client    │  React SPA
│  (Port 3000)│
└──────┬──────┘
       │ HTTP/REST API
       │ WebSocket
┌──────▼──────┐
│   Server    │  Express.js + Socket.io
│  (Port 5000)│
└──────┬──────┘
       │
┌──────▼──────┐
│   MongoDB   │  Database
└─────────────┘
```

## Technology Stack

### Frontend

- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Socket.io-client**: Real-time communication
- **CSS3**: Styling

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Socket.io**: Real-time communication
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## Database Schema

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  teams: [ObjectId],
  projects: [ObjectId]
}
```

### Project

```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  team: ObjectId (ref: Team),
  members: [ObjectId (ref: User)],
  status: String (enum),
  priority: String (enum),
  tasks: [ObjectId (ref: Task)]
}
```

### Task

```javascript
{
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  status: String (enum),
  priority: String (enum),
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }]
}
```

### Team

```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (enum: ['member', 'admin'])
  }],
  projects: [ObjectId (ref: Project)]
}
```

## API Architecture

### RESTful Endpoints

- `/api/auth/*` - Authentication
- `/api/projects/*` - Project management
- `/api/tasks/*` - Task management
- `/api/teams/*` - Team management
- `/api/users/*` - User management

### Real-time Events (Socket.io)

- `join-project` - Join project room
- `leave-project` - Leave project room
- `project-created` - New project created
- `project-updated` - Project updated
- `project-deleted` - Project deleted
- `task-created` - New task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `task-comment-added` - Comment added to task

## Security

### Authentication

- JWT tokens for stateless authentication
- Tokens stored in localStorage (client)
- Token expiration: 7 days
- Password hashing with bcrypt (10 rounds)

### Authorization

- Role-based access control (RBAC)
- Project ownership validation
- Team membership validation
- Resource-level permissions

### Security Middleware

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator

## State Management

### Frontend

- React Context API for global state
- Local component state for UI state
- Socket.io for real-time updates

### Backend

- Stateless API design
- Session data in JWT tokens
- Real-time state via Socket.io rooms

## File Structure

```
week8/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   └── server.js        # Entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
└── docs/                # Documentation
```

## Deployment Architecture

### Development

- Frontend: `npm start` (React dev server)
- Backend: `npm run dev` (Nodemon)
- Database: Local MongoDB or MongoDB Atlas

### Production

- Frontend: Static build deployed to Vercel/Netlify
- Backend: Node.js server on Render/Railway
- Database: MongoDB Atlas
- Environment variables for configuration

## Performance Considerations

- Database indexing on frequently queried fields
- Pagination for large datasets (future enhancement)
- Lazy loading for components (future enhancement)
- Caching strategies (future enhancement)

## Scalability

- Horizontal scaling ready (stateless API)
- Database connection pooling
- Socket.io adapter for multi-server (future)
- CDN for static assets (production)

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Client-side error boundaries
- Logging for debugging

## Testing Strategy

- Unit tests for utilities and models
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

