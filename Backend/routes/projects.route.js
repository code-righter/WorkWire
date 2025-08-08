import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import { createProject, createTask, deleteProject, deleteTask, getTasks, listProjects, updateProject, updateTask } from '../controllers/projects.controller.js'


const projectRouter = Router()

projectRouter.post('/createProject', authorize , createProject)

projectRouter.get('/listProjects/:userId', authorize,  listProjects);

projectRouter.patch('/updateProject/:projectId', authorize, updateProject)

projectRouter.delete('/deleteProject/:projectId', authorize, deleteProject)

projectRouter.post('/createTask/:projectId', authorize, createTask);

projectRouter.get('/getTasks/:projectId', authorize, getTasks)

projectRouter.patch('/updateTask/:projectId/:taskId', authorize, updateTask)

projectRouter.delete('/deleteTask/:projectId/:taskId', authorize, deleteTask)

export default projectRouter;