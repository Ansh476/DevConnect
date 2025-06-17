import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketconnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
    const { targetuserId } = useParams();
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const firstName = user?.firstName;
    
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);

    // ✅ Fetch previous chat messages from MongoDB on component mount
    const fetchChatMessages = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/chat/${targetuserId}`, { withCredentials: true });
            if (response.data && response.data.messages) {
                const chatMessages = response.data.messages.map((msg) => ({
                    firstName: msg.senderId?._id === userId ? user.firstName : msg.senderId?.firstName,
                    text: msg.text,
                    timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }));
                setMessages(chatMessages);  
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, [targetuserId]); // ✅ Re-fetch when user switches chat

    useEffect(() => {
        if (!userId) return;

        if (!socketRef.current || !socketRef.current.connected) {
            socketRef.current = createSocketconnection();
        }

        socketRef.current.emit("joinChat", { firstName, userId, targetuserId });

        socketRef.current.on("messageReceived", ({ firstName, text, timestamp }) => {
            setMessages((prevMessages) => [...prevMessages, { firstName, text, timestamp }]);
        });

        // ✅ Handle tab reconnection
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && socketRef.current?.disconnected) {
                socketRef.current.connect();
                socketRef.current.emit("joinChat", { firstName, userId, targetuserId });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            socketRef.current?.disconnect();
        };
    }, [userId, targetuserId]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !socketRef.current || !socketRef.current.connected) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = { firstName, text: inputMessage, timestamp };

        try {
            // ✅ Emit message via socket
            socketRef.current.emit("sendMessage", { firstName, userId, targetuserId, text: inputMessage, timestamp });

            // ✅ Save to database
            await axios.post(`${BASE_URL}/chat/${targetuserId}`, { senderId: userId, text: inputMessage }, { withCredentials: true });

            // ✅ Update state immediately
            setMessages((prevMessages) => [...prevMessages, newMessage]);

        } catch (err) {
            console.error("Error sending message:", err);
        }

        setInputMessage('');
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Chat window */}
            <div className="flex-grow flex flex-col p-4">
                <div className="chat-window bg-white border border-black rounded-lg h-[70vh] w-[65%] mx-auto flex flex-col overflow-hidden">
                    <div className="chat-messages flex-1 overflow-y-auto p-4">
                        {user && messages.map((message, index) => (
                            <div key={index} className={`chat ${user.firstName === message.firstName ? "chat-end" : "chat-start"} mb-4`}>
                                {/* <div className="chat-image avatar mr-2">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User Avatar"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        />
                                    </div>
                                </div> */}
                                <div>
                                    <div className="chat-message">
                                        <span className="font-semibold">{message.firstName}</span>
                                        <time className="text-xs opacity-50 ml-2">{message.timestamp}</time>
                                    </div>
                                    <div className="chat-bubble p-2 rounded-lg w-fit max-w-[80%] break-words">{message.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input section */}
                    <div className="chat-input flex items-center p-2 border-t border-gray-300">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="input input-bordered w-full py-3 px-4 text-lg"
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage} className="btn btn-primary ml-2">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
