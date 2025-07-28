import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import { createProject, listProjects } from '../controllers/projects.controller.js'


const projectRouter = Router()

projectRouter.post('/createProject', authorize , createProject)
projectRouter.get('/listProjects', authorize,  listProjects);

export default projectRouter;