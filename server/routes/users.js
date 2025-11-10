const express = require('express');
const { getUsers, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUser);

module.exports = router;

