import {Router} from 'express'
import { listUsers } from '../controllers/admin.controller.js';
const adminRouter = Router();

console.log("req reached the router admin")

adminRouter.post('/listUsers', listUsers)

export default adminRouter