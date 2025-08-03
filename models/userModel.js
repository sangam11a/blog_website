const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true,"Email is required"],
        trim: true,
        unique: [true, "Email must be unique. The provided email has already been registered!"],
        minLength:[5, "Email must have five characters"],
        lowercase: true,
    },
    password:{
        type: String, 
        required: [true, "Password must be provided"],
        trim: true,
        select: false,
        minLength: [6, "Password must be greater than six characters!"]
    },
    verified:{
        type: Boolean,
        default: false
    },
    verficationCode:{
        type: String,
        select: false,
        trim: true,
    },
    verficationCodeValidation:{
        type: String,
        select: false,
        trim: true,
    },
    forgotPasswordCode:{
        type: String,
        select: false,
        trim: true,
    },
    forgotPasswordCodeValidation:{
        type: String,
        select: false,
        trim: true,
    },
    
},{timestamps:true});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User",userSchema)