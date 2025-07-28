
import Conversation from '../models/conversation.model.js';
import Project from '../models/project.model.js';
import Message  from '../models/message.model.js'; // Make sure to import Message

export const findOrCreateConversation = async (req, res, next) => {
    console.log('\nUser requested new chat');
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Project Not found');
            error.statusCode = 404; // FIX: Correct status code syntax and value
            throw error;
        }

        const isParticipant = project.author.equals(userId) || project.collaborators.includes(userId);
        if (!isParticipant) {
            const error = new Error('You are not authorized to chat');
            error.statusCode = 403; // FIX: Correct status code syntax
            throw error;
        }

        let conversation = await Conversation.findOne({ project: projectId });
        if (!conversation) {
            const participants = [project.author, ...project.collaborators];
            conversation = await Conversation.create({ participants, project: projectId }); // FIX: Pass projectId to project field
        }

        res.status(200).json({
            success: true,
            message: "Conversation ready.",
            data: conversation
        });

    } catch (error) {
        next(error);
    }
};

// FIX: Swapped req and res to the correct order (req, res, next)
export const sendMessage = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body; // FIX: Destructure 'content' from the body
        const senderId = req.user.userId;

        if (!content) {
             const error = new Error("Message content cannot be empty.");
             error.statusCode = 400;
             throw error;
        }

        const newMessage = await Message.create({ 
            conversationId, 
            sender: senderId, 
            content // Pass the destructured content string
        });

        console.log(`Message Sent : ${content}`)

        // Populate the sender details to send back to the client
        newMessage = await newMessage.populate('sender', 'name email');

        // 1. Get the io instance from the app
        const io = req.app.get('io');
        // 2. Emit a 'new_message' event to the specific conversation room
        io.to(conversationId).emit('ML_Project', newMessage);
        // --- END REAL-TIME LOGIC ---

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};

export const getMessage = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId })
            .populate('sender', 'name email')
            .sort({ createdAt: 'asc' });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        next(error);
    }
};