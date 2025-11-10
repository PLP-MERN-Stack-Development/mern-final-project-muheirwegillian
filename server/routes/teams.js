const express = require('express');
const { body } = require('express-validator');
const {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

const teamValidation = [
    body('name').trim().notEmpty().withMessage('Team name is required')
];

router.route('/')
    .get(getTeams)
    .post(teamValidation, validate, createTeam);

router.route('/:id')
    .get(getTeam)
    .put(updateTeam)
    .delete(deleteTeam);

router.post('/:id/members',
    body('userId').notEmpty().withMessage('User ID is required'),
    validate,
    addMember
);

module.exports = router;

