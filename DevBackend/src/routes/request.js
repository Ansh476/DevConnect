const express = require('express');
const requestRouter = express.Router();
const {userAuth}= require('../middlewares/auth');
const User = require('../models/user');
const Connrequest = require('../models/connectionrequest');
requestRouter.get('/sendconnectionreq',userAuth,(req, res) =>{
    try{;
        res.send("connection request sent");
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
});
requestRouter.post('/request/send/:status/:touserId',userAuth,async(req, res) =>{
    try{
        const fromuserId = req.user._id;
        const touserId = req.params.touserId;
        const status = req.params.status;

        const allowedstatus = ["ignored","interested"];
        if(!allowedstatus.includes(status)){
            // throw new Error("error")
            return res.status(404).json({ message: "Invalid status type" + status});
        }

        const touser = await User.findById(touserId);
        if(!touser){
            return res.status(404).json({ message: "No User found" });
        }

        const existingconnreq= await Connrequest.findOne({
            $or:[
                {fromuserId, touserId},
                {fromuserId:touserId,touserId:fromuserId}
            ]
        })
        if(existingconnreq){
            return res.status(404).json({ message: "Connection request Already exists" });
        }

        const connectionrequest = new Connrequest({
            fromuserId,
            touserId,
            status
        });
        const data = await connectionrequest.save();

        res.json({
            message: req.user.firstName+" has sent a "+ status +" request to "+ touser.firstName,
            data
        })
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
});

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req, res)=>{
    try{
        const loggedinuser = req.user //the loggedin user is basically the touser as he will accept/reject the request sent by fromuser
        const {status,requestId} = req.params;

        const allowedstatus = ["accepted","rejected"];
        if(!allowedstatus.includes(status)){
            // throw new Error("error")
            return res.status(404).json({ message: "status not allowed"});
        }

        const connectionreq = await Connrequest.findOne({
            _id: requestId,
            touserId: loggedinuser._id,
            status: "interested"
        })
        if(!connectionreq){
            return res.status(404).json({ message: "No request found" });
        }

        connectionreq.status = status

        await connectionreq.save();

        res.json({message: "Request "+status+" successfully",data: connectionreq});
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
})
module.exports = requestRouter;