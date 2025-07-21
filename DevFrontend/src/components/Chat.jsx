import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketconnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import ShimmerMessages from './ShimmerMessages';

const Chat = () => {
  const { targetuserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // shimmer
  const [hasMore, setHasMore] = useState(true);

  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const fetchInitialMessages = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get(`${BASE_URL}/chat/${targetuserId}`, { withCredentials: true });
      const fetched = res.data.messages.map(msg => ({
        firstName: msg.senderId?._id === userId ? user.firstName : msg.senderId?.firstName,
        text: msg.text,
        createdAt: msg.createdAt,
      }));
      setMessages(fetched);
      setHasMore(fetched.length === 7);
      setTimeout(() => scrollToBottom(), 0);
    } catch (err) {
      console.error('Error fetching initial messages:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchOlderMessages = async (before) => {
    try {
      setLoadingOlder(true);
      const res = await axios.get(`${BASE_URL}/chat/${targetuserId}?before=${encodeURIComponent(before)}`, { withCredentials: true });
      const older = res.data.messages.map(msg => ({
        firstName: msg.senderId?._id === userId ? user.firstName : msg.senderId?.firstName,
        text: msg.text,
        createdAt: msg.createdAt,
      }));
      setMessages(prev => [...older, ...prev]);
      if (older.length < 7) setHasMore(false);
    } catch (err) {
      console.error('Error fetching older messages:', err);
    } finally {
      setLoadingOlder(false);
    }
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };


  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || loadingOlder || !hasMore) return;
    if (container.scrollTop <= 20 && messages.length) {
      const oldest = messages[0];
      if (oldest?.createdAt) {
        fetchOlderMessages(oldest.createdAt);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !socketRef.current?.connected) return;
    const timestamp = new Date().toISOString();
    const newMsg = { firstName, text: inputMessage, createdAt: timestamp };

    try {
      socketRef.current.emit('sendMessage', { firstName, userId, targetuserId, text: inputMessage, timestamp });
      await axios.post(`${BASE_URL}/chat/${targetuserId}`, { senderId: userId, text: inputMessage }, { withCredentials: true });
      setMessages(prev => [...prev, newMsg]);
      setTimeout(() => scrollToBottom(), 0);
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setInputMessage('');
  };

  
  useEffect(() => {
  const measureFetchTime = async () => {
    console.time("initialFetch");
    await fetchInitialMessages();
    console.timeEnd("initialFetch");
  };
  measureFetchTime();
  }, [targetuserId]);


  useEffect(() => {
    if (!userId) return;
    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current = createSocketconnection();
    }
    socketRef.current.emit('joinChat', { firstName, userId, targetuserId });
    socketRef.current.on('messageReceived', ({ firstName, text, timestamp }) => {
      setMessages(prev => [...prev, { firstName, text, createdAt: timestamp }]);
      setTimeout(() => scrollToBottom(), 0);
    });
    return () => socketRef.current?.disconnect();
  }, [userId, targetuserId]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex flex-col p-4">
        <div className="chat-window bg-white border border-black rounded-lg h-[70vh] w-[65%] mx-auto flex flex-col overflow-hidden">
          <div
            className="chat-messages flex-1 overflow-y-auto p-4"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {initialLoading ? (
                <ShimmerMessages/> 
            ) : (
              <>
                {loadingOlder && <div className="text-center text-xs mb-2">Loading older messages...</div>}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat ${user.firstName === msg.firstName ? 'chat-end' : 'chat-start'} mb-4`}>
                    <div>
                      <div className="chat-message">
                        <span className="font-semibold">{msg.firstName}</span>
                        <time className="text-xs opacity-50 ml-2">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <div className="chat-bubble p-2 rounded-lg w-fit max-w-[80%] break-words">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
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
