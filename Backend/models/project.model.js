import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required']
    },
    description: {
        type: String,
        maxlength: 300
    },
    component: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'devops', 'other'],
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review', 'completed'],
        default: 'todo'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project Name is required'],
        trim: true 
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Manager is required']
    },
    description: {
        type: String,
        maxLength: 300
    },
    timeline: {
        type: String,
        enum: ['3d', '7d', '14d', '1M', '2M', '3M', '6M', '1YR']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: {
        type: [TaskSchema],
        default: [] // Optional — ensures no validation error when empty
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
