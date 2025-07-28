import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
    
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false // Make it optional for direct user-to-user chats
    }
}, {
    timestamps: true
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
