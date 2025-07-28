import {Router} from 'express'
import { findOrCreateConversation, sendMessage , getMessage} from "../controllers/conv.controller.js";
import authorize from "../middleware/auth.middleware.js";

const conversationRouter = Router();
console.log("COnversation route reached")
//route to create a new chat 
conversationRouter.post('/project/:projectId', authorize, findOrCreateConversation);

// router to send message
conversationRouter.post('/:conversationId/messages', authorize, sendMessage);

// router to get message 
conversationRouter.get('/:conversationId/messages', authorize, getMessage);

export default conversationRouter;