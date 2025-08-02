import express from 'express'
import {PORT} from './config/env.js'
import cors from 'cors'

import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middleware/error.middleware.js'
import authRouter from './routes/auth.route.js'
import projectRouter from './routes/projects.route.js'
import adminRouter from './routes/admin.route.js'
import conversationRouter from './routes/conversation.route.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/conversation', conversationRouter);

app.use(errorMiddleware)

app.get('/', (req, res)=>{
    console.log("Req received at /")
    res.send({title : "This is colab api"})
})

// app.js (add this section)

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
    connectToDatabase()
})


export default app;