import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Paperclip, Check, CheckCheck } from 'lucide-react';

function ChatWindow({ messages = [], loggedInUser, typingStatus, sendMessage, sendTyping, selectedChat, setMessages }) {
  const [message, setMessage] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Identify the other user
  useEffect(() => {
    if (selectedChat && loggedInUser) {
      const otherUser = selectedChat.user1.id === loggedInUser.id ? selectedChat.user2 : selectedChat.user1;
      setSelectedChatUser(otherUser);
    } else {
      setSelectedChatUser(null);
    }
  }, [selectedChat, loggedInUser]);

  // Load messages on chat change
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?.id) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/${selectedChat.id}`);
        setMessages(response.data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // Scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send text or file message
  const handleSend = async () => {
    if ((!message.trim()) || !loggedInUser || !selectedChatUser) return;

    const formData = new FormData();
    formData.append('senderId', loggedInUser.id);
    formData.append('chatId', selectedChat.id);
    formData.append('content', message.trim());

    try {
      const response = await axios.post('http://localhost:8080/api/messages/send', formData);
      sendMessage(response.data);
      setMessages(prev => [...prev, response.data]);
      setMessage('');
    } catch (err) {
      console.error("Sending text failed:", err);
    }
  };

  // Send file
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChatUser || !loggedInUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", loggedInUser.id);
    formData.append("chatId", selectedChat.id);

    try {
      const response = await axios.post("http://localhost:8080/api/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      sendMessage(response.data);
      setMessages(prev => [...prev, response.data]);
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  // Typing handler
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (selectedChatUser) {
      sendTyping({
        senderId: loggedInUser.id,
        senderName: loggedInUser.userName,
        receiverId: selectedChatUser.id,
      });
    }
  };

  // Typing indicator
  const getTypingText = () => {
    if (!typingStatus || !selectedChatUser) return 'Online';
    return typingStatus.senderId === selectedChatUser.id ? `${typingStatus.senderName} is typing...` : 'Online';
  };

  // Format time
  const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex-1 flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <div className="flex items-center p-3 bg-white border-b border-gray-200 shadow-sm">
        <img
          src={selectedChatUser?.profilePic || `https://ui-avatars.com/api/?name=${selectedChatUser?.userName || 'Chat'}&background=0D8ABC&color=fff`}
          alt="Chat Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">{selectedChatUser?.userName || 'Select a chat'}</h2>
          <p className="text-sm text-gray-500">{getTypingText()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === loggedInUser.id ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div className={`max-w-xs p-3 rounded-lg text-white text-sm ${msg.senderId === loggedInUser.id ? 'bg-blue-500' : 'bg-gray-600'}`}>
              <p>{msg.content}</p>
              <div className="flex justify-end items-center mt-1 text-[10px] text-white/80 gap-1">
                <span>{formatTime(msg.timestamp)}</span>
                {msg.senderId === loggedInUser.id && (
                  <>
                    {msg.status === 'SEEN' ? <CheckCheck size={14} /> : <Check size={14} />}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input */}
      <div className="bg-white p-4 flex items-center border-t border-gray-200">
        <input
          type="file"
          onChange={handleFileChange}
          hidden
          ref={fileInputRef}
        />
        <button onClick={() => fileInputRef.current.click()} className="text-gray-500 hover:text-blue-500 p-2">
          <Paperclip size={22} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
