# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd week8
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas:**

- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get your connection string
- Replace `MONGODB_URI` with your Atlas connection string

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start the Application

**Terminal 1 - Start Backend:**

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

### 5. Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account
3. You should be redirected to the dashboard

## Running Tests

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

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally, or
- Verify your MongoDB Atlas connection string
- Check firewall settings if using Atlas

### Port Already in Use

- Change the PORT in server/.env
- Update REACT_APP_API_URL in client/.env accordingly

### Module Not Found Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### CORS Errors

- Ensure CLIENT_URL in server/.env matches your frontend URL
- Check that both servers are running

## Production Deployment

### Backend (Render/Railway)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy the `server` directory
4. Update CORS settings for production domain

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_SOCKET_URL`: Your backend URL

## Next Steps

- Read the [User Guide](./docs/USER_GUIDE.md) to learn how to use the application
- Check the [API Documentation](./docs/API.md) for API details
- Review the [Architecture](./docs/ARCHITECTURE.md) for technical details
