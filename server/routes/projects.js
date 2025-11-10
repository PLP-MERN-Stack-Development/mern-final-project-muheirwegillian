const express = require('express');
const { body } = require('express-validator');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

const projectValidation = [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('status').optional().isIn(['planning', 'active', 'on-hold', 'completed', 'archived']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
];

router.route('/')
    .get(getProjects)
    .post(projectValidation, validate, createProject);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

router.post('/:id/members',
    body('userId').notEmpty().withMessage('User ID is required'),
    validate,
    addMember
);

module.exports = router;

