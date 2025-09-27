import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import {access, accessCreateProject, listProjectsAccess} from '../middleware/access.middleware.js'
import { createProject, createTask, deleteProject, deleteTask, getTasks, listProjects, updateProject, updateTask , getProject} from '../controllers/projects.controller.js'


const projectRouter = Router()

projectRouter.post('/createProject/', authorize , accessCreateProject, createProject)

projectRouter.get('/listProjects', authorize, listProjectsAccess, listProjects);

projectRouter.get('/getProject/:projectId', authorize, access, getProject);

projectRouter.put('/updateProject/:projectId', authorize, access,updateProject)

projectRouter.delete('/deleteProject/:projectId', authorize, access, deleteProject)

projectRouter.post('/createTask/:projectId', authorize, access, createTask);

projectRouter.get('/getTasks/:projectId', authorize, access, getTasks)

projectRouter.put('/updateTask/:projectId/:taskId', authorize, access, updateTask)

projectRouter.delete('/deleteTask/:projectId/:taskId', authorize, access, deleteTask)

export default projectRouter;