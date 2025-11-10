const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a project name'],
        trim: true,
        maxlength: [100, 'Project name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
        default: 'planning'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for faster queries
projectSchema.index({ owner: 1 });
projectSchema.index({ team: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);

