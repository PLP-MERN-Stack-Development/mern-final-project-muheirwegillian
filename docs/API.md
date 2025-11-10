# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth Endpoints

#### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Project Endpoints

#### Get All Projects

```http
GET /api/projects
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "project_id",
      "name": "Project Name",
      "description": "Project Description",
      "status": "active",
      "priority": "high",
      "owner": {...},
      "members": [...],
      "tasks": [...]
    }
  ]
}
```

#### Get Single Project

```http
GET /api/projects/:id
```

#### Create Project

```http
POST /api/projects
```

**Request Body:**

```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "planning",
  "priority": "medium"
}
```

#### Update Project

```http
PUT /api/projects/:id
```

#### Delete Project

```http
DELETE /api/projects/:id
```

#### Add Member to Project

```http
POST /api/projects/:id/members
```

**Request Body:**

```json
{
  "userId": "user_id"
}
```

### Task Endpoints

#### Get All Tasks

```http
GET /api/tasks?projectId=xxx&status=todo&assignedTo=xxx
```

#### Get Single Task

```http
GET /api/tasks/:id
```

#### Create Task

```http
POST /api/tasks
```

**Request Body:**

```json
{
  "title": "Task Title",
  "description": "Task description",
  "project": "project_id",
  "status": "todo",
  "priority": "medium",
  "assignedTo": "user_id",
  "dueDate": "2024-12-31"
}
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

#### Add Comment to Task

```http
POST /api/tasks/:id/comments
```

**Request Body:**

```json
{
  "text": "Comment text"
}
```

### Team Endpoints

#### Get All Teams

```http
GET /api/teams
```

#### Get Single Team

```http
GET /api/teams/:id
```

#### Create Team

```http
POST /api/teams
```

**Request Body:**

```json
{
  "name": "Team Name",
  "description": "Team description"
}
```

#### Update Team

```http
PUT /api/teams/:id
```

#### Delete Team

```http
DELETE /api/teams/:id
```

#### Add Member to Team

```http
POST /api/teams/:id/members
```

**Request Body:**

```json
{
  "userId": "user_id"
}
```

### User Endpoints

#### Get All Users

```http
GET /api/users
```

#### Get Single User

```http
GET /api/users/:id
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

**Status Codes:**

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
