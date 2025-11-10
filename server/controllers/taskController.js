const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const { projectId, status, assignedTo } = req.query;
        const query = {};

        if (projectId) {
            query.project = projectId;
        }
        if (status) {
            query.status = status;
        }
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        const tasks = await Task.find(query)
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name owner members')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to the project
        const project = task.project;
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this task' });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        // Verify project access
        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
        }

        req.body.createdBy = req.user.id;
        const task = await Task.create(req.body);

        // Add task to project
        project.tasks.push(task._id);
        await project.save();

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('task-created', populatedTask);

        res.status(201).json({
            success: true,
            data: populatedTask
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = task.project;
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('comments.user', 'name email');

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('task-updated', task);

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = task.project;
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        // Remove task from project
        project.tasks = project.tasks.filter(t => t.toString() !== task._id.toString());
        await project.save();

        await task.deleteOne();

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('task-deleted', { id: task._id });

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = task.project;
        if (project.owner.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to comment on this task' });
        }

        task.comments.push({
            user: req.user.id,
            text: req.body.text
        });

        await task.save();

        const updatedTask = await Task.findById(req.params.id)
            .populate('comments.user', 'name email')
            .populate('assignedTo', 'name email');

        // Emit real-time update
        const io = req.app.get('io');
        io.to(`project-${project._id}`).emit('task-comment-added', updatedTask);

        res.json({
            success: true,
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
};

