import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// Helper to generate session key
const getSessionKey = (userId) => `session:${userId}`;

export const signUp = async (req, res, next) => {
  console.log("Attempt to sign up");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([
      { name, email, password: hashedPassword, role }
    ]);

    // const token = jwt.sign(
    //   { userId: newUsers[0]._id },
    //   JWT_SECRET,
    //   { expiresIn: JWT_EXPIRES_IN }
    // );

    // // Store session in Redis
    // await redisClient.set(
    //   getSessionKey(newUsers[0]._id),
    //   token,
    //   { EX: 60 * 60 * 24 } // 24h expiry
    // );

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { token, user: newUsers[0] }
    });

    console.log(`New ${role} user created -> ${name}`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// controllers/auth.controller.js (sign

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Incorrect password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 4. Store token in Redis with TTL (24 hours)
    const ttlSeconds = 60 * 60 * 24;
    await redisClient.setex(token, ttlSeconds, JSON.stringify({ userId: user._id }));

    // 5. Return success response
    return res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: { token, user }
    });

  } catch (err) {
    next(err);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { userId } = req.user; // this comes from auth middleware (decoded JWT)
    console.log(`Signing out user ${userId}`);

    await redisClient.del(getSessionKey(token)); // remove session from Redis

    res.status(200).json({
      success: true,
      message: 'User signed out successfully'
    });
  } catch (error) {
    next(error);
  }
};