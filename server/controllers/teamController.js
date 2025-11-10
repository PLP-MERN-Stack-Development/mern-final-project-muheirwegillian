const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        })
            .populate('owner', 'name email')
            .populate('members.user', 'name email')
            .populate('projects', 'name')
            .sort('-createdAt');

        res.json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members.user', 'name email')
            .populate('projects', 'name');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check access
        if (team.owner.toString() !== req.user.id &&
            !team.members.some(m => m.user._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this team' });
        }

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;
        const team = await Team.create(req.body);

        // Add owner as admin member
        team.members.push({
            user: req.user.id,
            role: 'admin'
        });
        await team.save();

        const populatedTeam = await Team.findById(team._id)
            .populate('owner', 'name email')
            .populate('members.user', 'name email');

        res.status(201).json({
            success: true,
            data: populatedTeam
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
exports.updateTeam = async (req, res, next) => {
    try {
        let team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check ownership
        if (team.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this team' });
        }

        team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('owner', 'name email')
            .populate('members.user', 'name email');

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
exports.deleteTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check ownership
        if (team.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this team' });
        }

        await team.deleteOne();

        res.json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
exports.addMember = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is owner or admin
        const isOwner = team.owner.toString() === req.user.id;
        const isAdmin = team.members.some(m =>
            m.user.toString() === req.user.id && m.role === 'admin'
        );

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        const { userId } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already a member
        if (team.members.some(m => m.user.toString() === userId)) {
            return res.status(400).json({ message: 'User is already a team member' });
        }

        team.members.push({
            user: userId,
            role: 'member'
        });

        await team.save();

        // Add team to user's teams array
        user.teams.push(team._id);
        await user.save();

        const updatedTeam = await Team.findById(req.params.id)
            .populate('members.user', 'name email');

        res.json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        next(error);
    }
};

