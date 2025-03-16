const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const {validator} = require('../utils/validate');
require('dotenv').config();
const jwt = require('jsonwebtoken');

authRouter.post('/login', async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("invalid credentials");
        }
        const isPasswordvalid = await user.getvalidatedpassword(password);
        if(isPasswordvalid){
            //generate token
            const token = await user.getJWT();
            // const token = await jwt.sign({_id:user._id},"Ansh@1234jyt",{expiresIn:"1d"});
            res.cookie('token',token,{httpOnly:true,maxAge:3600000});
            // res.cookie('token',token,{httpOnly:true,expires:new Date(Date.now()+8*3600000)}); expires in 8 hours here given in milliseconds

            res.json({message: "login successful", user: user});
        }
        else{
            throw new Error("invalid credentials");
        }
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
})
authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender, skills, photourl, phone } = req.body;

        // Validate request body
        validator(req);

        // Encrypt password
        const hashpassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        // Create a new user object without saving it
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashpassword,
            age,
            gender,
            skills,
            photourl,
            phone,
            otp,
            otpExpires,
        });

        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,   
                pass: process.env.EMAIL_PASS,   
            },
        });

        // console.log('Email User:', process.env.EMAIL_USER); 
        // console.log('Email Pass:', process.env.EMAIL_PASS); 

        await transporter.sendMail({
            to: emailId,
            subject: 'Your OTP Verification Code',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        });

        res.status(201).json({ message: 'OTP sent to email. Please verify to complete signup.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Signup failed. Please try again.' });
    }
});

// OTP Verification and Saving User
authRouter.post('/verify-otp', async (req, res) => {
    try {
        const { emailId, otp } = req.body;

        // Find user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Validate OTP
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // OTP verification successful
        user.isVerified = true;

        // Clear OTP and OTP expiration values
        user.otp = undefined;
        user.otpExpires = undefined;

        // Save updated user object with OTP cleared
        await user.save();

        // Generate JWT token
        const token = await user.getJWT();

        //console.log('Generated Token:', token);

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        res.status(200).json({ message: 'OTP verified. User registered and logged in successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'OTP verification failed. Please try again.' });
    }
});


authRouter.post('/logout',async (req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())});
    // res.clearCookie('token'); both instruct the browser to delete the cookie. However, if the cookie's attributes (e.g., path, domain) are mismatched, res.cookie() may work when res.clearCookie() does not.
    res.send("logout successful");
})

module.exports = authRouter;