const express = require('express');
const { body } = require('express-validator');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

const taskValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project ID is required'),
    body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
];

router.route('/')
    .get(getTasks)
    .post(taskValidation, validate, createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

router.post('/:id/comments',
    body('text').trim().notEmpty().withMessage('Comment text is required'),
    validate,
    addComment
);

module.exports = router;

