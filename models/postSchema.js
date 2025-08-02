const mongoose = require('mongoose');

const poseSchema = mongoose.Schema({
    title:{
        type:String,
        trim: true,
        required:[true, "Title is required!"]
    },
    description:{
        type:String,
        trim: true,
        required:[true, "Description is necessar!"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{timestamps: true});

module.exports = mongoose.model('Post',postSchema);