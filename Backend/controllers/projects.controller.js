import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authorize from '../middleware/auth.middleware.js'
import User from '../models/user.model.js'
// import Flowchart from '../models/flowchart.model.js'
import Project from '../models/project.model.js'
import {JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js'

export const createProject = async (req, res, next)=>{
    try{
        const {name, description, collaborators} = req.body;
        const authorId = req.user.userId;
        const project = await Project.create({
           name,
           description, 
           collaborators,
           author : authorId 
        });
        res.status(201).json({
            success : true,
            message : 'Project created successfully',
            data : project
        })

    }catch(error){
        next(error);
    }
}

export const listProjects = async (req, res, next)=>{
    try{
        const userId = req.user.userId;
        
        const projects = await Project.find({
            $or: [
                { author: userId },
                { collaborators: userId } 
            ]
        }).populate('author', 'name email') 
          .populate('collaborators', 'name email'); 
        // 3. Return the entire array of found projects
        res.status(200).json({
            success: true,
            message: "User's projects retrieved successfully",
            count: projects.length, // It's good practice to include the count
            data: projects // Send the whole array
        });


    }catch(error){
        next(error)
    }
}

