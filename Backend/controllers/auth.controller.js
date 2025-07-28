import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js'
import {JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js'

export const signUp = async (req, res, next)=>{

    console.log("Attempt to sign up");
    const session = await mongoose.startSession();
    session.startTransaction()
    try{
        const {name, email, password} = req.body;

        // checking if user already exists or not
        const userExists = await User.findOne({email});

        if(userExists){
            const error = new Error('User already exists')
            error.statusCode = 409;
            throw error;
        }
        // hashing the password with salt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password : hashedPassword}])

        const token = jwt.sign(
            {userId : newUsers[0]._id},
            JWT_SECRET,
            {expiresIn : JWT_EXPIRES_IN}
        );
        
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message : 'User created successfully',
            data : {
                token, 
                user:newUsers[0]
            }
        })
        console.log("New user has been created")
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    console.log("Attempt to log in ")
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (!userExists) {
            const error = new Error('Invalid user email');
            error.statusCode = 404; // Consider 401 Unauthorized for login failures
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, userExists.password);
        if (!isValidPassword) {
            const error = new Error('Incorrect Password');
            error.statusCode = 404; // Consider 401 Unauthorized for login failures
            throw error;
        }

        const token = jwt.sign(
            { userId: userExists._id }, // FIX: Changed 'user' to 'userExists'
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }

        );
        console.log(`${userExists.name} signed in successfully`);
        // console.log(`JWT ${token}`)

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: userExists // FIX: Changed 'user' to 'userExists' if you want to send the user object
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next)=>{

}



