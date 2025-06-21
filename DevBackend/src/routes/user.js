const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const Connrequest = require('../models/connectionrequest');
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName age gender skills"

userRouter.get("/user/me", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      photourl: user.photourl,
      age: user.age,
      gender: user.gender,
      skills: user.skills,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user info" });
  }
});
userRouter.get('/user/requests/received',userAuth,async (req, res) =>{
    try{
        const loggedinuser = req.user;
        const connrequests = await Connrequest.find({
            touserId:loggedinuser._id,
            status:"interested"
        }).populate("fromuserId",["firstName", "lastName", "age","gender" ,"skills","photourl" ]);


        if(!connrequests){
            return res.status(404).json({ message: "No requests found" });
        }

        res.json({
            message:"Data fetched successfully",
            data:connrequests,
        })
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user;  

        const connectionrequests = await Connrequest.find({
            $or: [
                { fromuserId: loggedinuser._id, status: "accepted" },
                { touserId: loggedinuser._id, status: "accepted" }
            ]
        })
        .populate("fromuserId", "firstName lastName gender age skills photourl") // Ensure USER_SAFE_DATA has all required fields
        .populate("touserId", "firstName lastName gender age skills photourl");

        console.log("Fetched Connections:", connectionrequests);

        const data = connectionrequests
            .map((row) => {
                if (!row.fromuserId || !row.touserId) return null; // Handle missing data
                return row.fromuserId._id.toString() === loggedinuser._id.toString()
                    ? row.touserId
                    : row.fromuserId;
            })
            .filter(Boolean); // Remove null values

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


userRouter.get('/user/feed',userAuth,async (req,res)=>{
    try{
        const loggedinuser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionreq = await Connrequest.find({
            $or:[
                {fromuserId: loggedinuser._id},
                {touserId: loggedinuser._id}
            ]
        }).select("fromuserId touserId")// select only shows that fields which are mentioned 
        // .populate("fromuserId","firstName")
        // .populate("touserId","firstName");

        const hidefromuserfeed = new Set();
        connectionreq.forEach((req) => {
            hidefromuserfeed.add(req.fromuserId.toString());
            hidefromuserfeed.add(req.touserId.toString());
        });

        const users = await User.find({
            $and:[
                { _id: {$nin: Array.from(hidefromuserfeed)}},
                { _id: {$ne:loggedinuser._id}},
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            message: "User's feed is",
            data: users
        })
    }
    catch(err){
        res.status(404).send("error: "+ err.message)
    }
})



module.exports = userRouter