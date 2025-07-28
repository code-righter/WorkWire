import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name : {
        type: String, 
        required : [true, 'Username is required'],
        trim : true,
        minLength : 2,
        maxLength : 50
    },

    email : {
        type : String, 
        required : [true, 'User email is required'],
        trim : true, 
        unique : true,
        lowercase : true, 
        minLength : 5, 
        maxLength : 255,
        match : [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6
  }
},
{
    timestamps : true
});

const User = mongoose.model('User', UserSchema);
export default User;
