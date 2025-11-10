const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        })
            .populate('owner', 'name email')
            .populate('members', 'name email')
            .populate('team', 'name')
            .sort('-createdAt');

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email')
            .populate('team', 'name')
            .populate({
                path: 'tasks',
                populate: {
                    path: 'assignedTo createdBy',
                    select: 'name email'
                }
            });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this project' });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;

        const project = await Project.create(req.body);

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('project-created', project);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership or membership
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('owner', 'name email')
            .populate('members', 'name email');

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('project-updated', project);

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        // Delete associated tasks
        await Task.deleteMany({ project: project._id });

        await project.deleteOne();

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('project-deleted', { id: project._id });

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        const { userId } = req.body;

        if (project.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        project.members.push(userId);
        await project.save();

        const updatedProject = await Project.findById(req.params.id)
            .populate('members', 'name email');

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('project-updated', updatedProject);

        res.json({
            success: true,
            data: updatedProject
        });
    } catch (error) {
        next(error);
    }
};

