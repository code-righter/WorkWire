import {Router} from 'express'
import { sendMessage , getMessages} from "../controllers/conv.controller.js";
import authorize from "../middleware/auth.middleware.js";

const conversationRouter = Router();
console.log("Conversation route reached")

// router to send message
conversationRouter.post('/:conversationId/messages', authorize, sendMessage);

// router to get message 
conversationRouter.get('/:conversationId/messages', authorize, getMessages);

export default conversationRouter;