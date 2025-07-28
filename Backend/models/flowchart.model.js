import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
    id : {
        type : String, 
        // required : true
    },

    type : { 
        type : String, 
        default : 'process'
    },

    data : {
        label : {type : String, required : true},
        description : {type : String},
        shapeColor: {type : String}
    },

    position : {
        x : {type : Number, required : true},
        y : {type : Number, required : true}
    },

    style  : {
        shape : {
            type : String, 
            default : 'rectangle'
        },

        color : {type : String}
    }
}, {_id : false});

const EdgeSchema = new mongoose.Schema({
    id : {
        type : String,
        // required : true
    },
    source : {
        type : String, 
        // required : true
    },
    target : {
        type : String, 
        // required : true
    },
    label : {type : String},

    style : {
        stroke : { type : String },
        color : {type : String, default : 'black'}
    }
}, {_id : false})


const FlowchartSchema = new mongoose.Schema({
    title :{
        type : String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: 5,
        maxLength: 20,
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId, ref : 'User', 
        required : [true, 'user name is requires'],
        trim : true,
    }
,
    collaborators : [
        {  
            type : mongoose.Schema.Type.ObjectId, 
            ref : 'User'
        }
    ],

    nodes : [NodeSchema],
    edges : [EdgeSchema],
    updatedAt : {type : Date, default : Date.now}

}, {timestamps : true});

// const Message = mongoose.
export default mongoose.model('Flowchart', FlowchartSchema);