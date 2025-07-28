import User from "../models/user.model.js"
import authorize from "../middleware/auth.middleware.js";

export const listUsers = async (req, res, next)=>{
    console.log("On the admin route")
    try{
        const securityKey = req.body.securityKey;
        console.log(`${securityKey}`)
        if(securityKey != 'Macbook Air M4') {
            const error = new Error('Wrong Security Code')
            error.statusCode = 409;
            throw error;
        }
        const users = await User.find({});
        console.log(users);
        res.status(201).json({
            success : true,
            message : 'User list created',
            data : users
        })
    }
    catch(error){
        next(error);
    }
}