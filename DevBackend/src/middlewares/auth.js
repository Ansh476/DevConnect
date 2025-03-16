const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Please Login!!!!!")
        }

        const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);


        const { _id } = verifyUser;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send("Error: " + error.message);
    }
};
module.exports = {userAuth};