const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetuserId', userAuth, async (req, res) => {
    const { targetuserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetuserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName",
        });

        if (!chat) {
            chat = new Chat({
                participant: [userId, targetuserId],
                messages: [],
            });
            await chat.save();
        }
        res.json(chat);
    } catch (err) {
        console.log("Error fetching chat:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = chatRouter;