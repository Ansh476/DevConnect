const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const Connrequest = require('../models/connectionrequest');

const getsecretroomId = (userId, targetuserId) => {
   return crypto.createHash("sha256").update([userId, targetuserId].sort().join("_")).digest("hex");
}

const initializesocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        },
        pingInterval: 25000,  // Keep the connection alive
        pingTimeout: 60000,   // Wait longer before timing out
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, userId, targetuserId }) => {
            const roomId = getsecretroomId(userId, targetuserId);
            console.log(`${firstName} joined Room: ${roomId}`);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, userId, targetuserId, text }) => {
            try {
                const roomId = getsecretroomId(userId, targetuserId);
                console.log(`${firstName} sent: ${text}`);
        
                const friendcheck = await Connrequest.findOne({
                    $or: [
                        { fromuserId: userId, touserId: targetuserId, status: "accepted" },
                        { fromuserId: targetuserId, touserId: userId, status: "accepted" }
                    ]
                });
        
                if (!friendcheck) {
                    socket.emit("error", { message: "The two people are not friends" });
                    return;
                }
        
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetuserId] }
                });
        
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetuserId],
                        messages: [],
                    });
                }
        
                chat.messages.push({ senderId: userId, text });
                await chat.save();
        
                io.to(roomId).emit("messageReceived", { firstName, text });
            } catch (err) {
                console.error("Error sending message:", err);
            }
        });
        

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

module.exports = initializesocket;
