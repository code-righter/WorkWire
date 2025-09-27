// controllers/messageController.js
import Message from "../models/message.model.js";
import redisClient  from "../services/redis.service.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { projectId, text } = req.body;
    const senderId = req.user._id; // assuming JWT auth middleware

    const message = await Message.create({
      project: projectId,
      sender: senderId,
      text,
    });

    // Publish message to Redis for real-time updates
    const channel = `project:${projectId}:messages`;
    await redisClient.publish(channel, JSON.stringify(message));

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get paginated messages for a project
export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};