import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project Name is required'],
        trim: true 
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a User's ID
        ref: 'User', // The model to use for the reference
        required: [true, 'Author is required']
    },
    description: {
        type: String,
        maxLength: 300 // Increased limit for better descriptions
    },
    members: [{ // An array of references
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // Useful for tracking when projects are created/updated
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;