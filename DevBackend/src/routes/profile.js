// const express = require('express');
// const profileRouter = express.Router();
// const {userAuth}= require('../middlewares/auth');
// const User = require('../models/user');
// const {validateprofiledetails} = require('../utils/validate');
// profileRouter.get('/profile/view',userAuth,(req, res) =>{
//     try{
//         const user = req.user;
//         res.send(user);
//     }
//     catch(err){
//         res.status(404).send("error: "+ err.message)
//     }
// });
// profileRouter.post('/profile/edit',userAuth,async (req, res) =>{
//     try{
//         if(!validateprofiledetails(req)){
//             throw new Error("Invalid profile details");
//         }
//         const loggedinuser = req.user;
//         if (typeof req.body.skills === "string") {
//         req.body.skills = req.body.skills.split(',').map(skill => skill.trim()).filter(Boolean);
//         }        
//         // Object.keys(req.body).forEach((key)=>{
//         //     loggedinuser[key] = req.body[key];
//         // });
//         const fields = ['firstName', 'lastName', 'age', 'gender', 'skills', 'photourl'];
//         fields.forEach((field) => {
//         if (req.body[field] !== undefined) {
//             loggedinuser[field] = req.body[field];
//         }
//         });
//         await loggedinuser.save();
//         console.log("UPDATED USER >>>", loggedinuser); 
//         res.json({message:`${loggedinuser.firstName} , your profile is updated`,data: loggedinuser});
//         // res.json({
//         // message:loggedinuser.firstName+" your profile is updated",
//         // data: loggedinuser
//         // });
//     }
//     catch(err){
//         res.status(400).json({ error: err.message });
//     }
// });

// module.exports = profileRouter;

const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateprofiledetails } = require('../utils/validate');

profileRouter.get('/profile/view', userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

profileRouter.post('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateprofiledetails(req)) {
      throw new Error("Invalid profile details");
    }

    const loggedinuser = req.user;

    // Handle skills string -> array
    if (typeof req.body.skills === "string") {
      req.body.skills = req.body.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    }

    const fields = ['firstName', 'lastName', 'age', 'gender', 'skills', 'photourl'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        loggedinuser[field] = req.body[field];
      }
    });

    await loggedinuser.save();

    console.log("UPDATED USER >>>", loggedinuser);

    res.json({
      message: `${loggedinuser.firstName}, your profile is updated`,
      data: loggedinuser
    });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR >>>", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = profileRouter;
