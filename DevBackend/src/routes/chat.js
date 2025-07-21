const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetuserId', userAuth, async (req, res) => {
  const { targetuserId } = req.params;
  const userId = req.user._id;
  const before = req.query.before;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetuserId] }
    }).populate({
      path: 'messages.senderId',
      select: 'firstName',
    });

    if (!chat) {
      // create if doesn't exist
      chat = new Chat({ participants: [userId, targetuserId], messages: [] });
      await chat.save();
      return res.json({ messages: [] });
    }

    let filteredMessages = chat.messages;

    if (before) {
      filteredMessages = filteredMessages.filter(msg =>
        new Date(msg.createdAt) < new Date(before)
      );
    }

    // ✅ sort oldest → newest, take last 7
    filteredMessages = filteredMessages
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-7);

    return res.json({ messages: filteredMessages });
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = chatRouter;
