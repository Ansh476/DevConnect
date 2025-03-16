const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    firstName:{
        type: 'string',
        required: true,
        maxlength:50
    },
    lastName:{
        type: 'string',
        required: true
    },
    emailId:{
        type: 'string',
        required: true, //schema validations
        lowercase: true,
        unique: true,
        trim:true,
        maxLength:100,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email not valid")
            }
        }
    },
    password:{
        type: 'string',
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter strong password")
            }
        }
    },
    gender:{
        type: 'string',
        validate(value){
            if(!["male", "female","others"].includes(value)){
                throw new Error("Gender not valid")
            }
        }
    },
    age:{
        type: 'Number',
        min:18,
    },
    // about:{
    //     type: 'string',
    //     default: 'i am happy'
    // },
    skills:{
        type:[String]
    },
    photourl:{
        type: 'string',
        // default: 'i am happy',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("url not valid"+ value)
            }
        }
    },
    phone:{
        type: 'string',
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("phone number not valid")
            }
        }
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpires: {
        type: Date,
        required: false,
    },
},
{
    timestamps:true,
});

UserSchema.methods.getJWT= async function(){ //only function are allowed no arrow function
    const token = await jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"7d"}); //this refers to the current user 
    return token;
}
UserSchema.methods.getvalidatedpassword= async function(passwordinput){
    const hashpassword = this.password;

    const ispasswordvalid = await bcrypt.compare(passwordinput, hashpassword);
    return ispasswordvalid;
}

const User = mongoose.model('User',UserSchema);
module.exports = User;