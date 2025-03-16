const express = require('express');
const profileRouter = express.Router();
const {userAuth}= require('../middlewares/auth');
const User = require('../models/user');
const {validateprofiledetails} = require('../utils/validate');
profileRouter.get('/profile/view',userAuth,(req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
});
profileRouter.post('/profile/edit',userAuth,async (req, res) =>{
    try{
        if(!validateprofiledetails(req)){
            throw new Error("Invalid profile details");
        }
        const loggedinuser = req.user;
        Object.keys(req.body).forEach((key)=>{
            loggedinuser[key] = req.body[key];
        });
        await loggedinuser.save();
        res.json({message:`${loggedinuser.firstName} , your profile is updated`,data: loggedinuser});
        // res.json({
        // message:loggedinuser.firstName+" your profile is updated",
        // data: loggedinuser
        // });
    }
    catch(err){
        res.send("Error:" + err.message);
    }
});

module.exports = profileRouter;