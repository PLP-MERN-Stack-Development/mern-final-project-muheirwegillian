const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');

describe('Projects API', () => {
    let authToken;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow-test');

        // Create test user and get token
        const user = await User.create({
            name: 'Test User',
            email: 'projecttest@example.com',
            password: 'password123'
        });
        userId = user._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'projecttest@example.com',
                password: 'password123'
            });

        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Project.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /api/projects', () => {
        it('should get all projects for user', async () => {
            const res = await request(app)
                .get('/api/projects')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Project',
                    description: 'Test Description',
                    status: 'active'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe('Test Project');
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/api/projects')
                .send({
                    name: 'Test Project'
                });

            expect(res.statusCode).toBe(401);
        });
    });
});

