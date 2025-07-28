
import mongoose from 'mongoose';
import Conversation from './conversation.model.js';

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt & updatedAt
});


const Message = mongoose.model('Message', MessageSchema);
export default Message;