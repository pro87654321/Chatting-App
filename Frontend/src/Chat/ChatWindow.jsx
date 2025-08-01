import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Check, CheckCheck } from 'lucide-react';
import axios from 'axios';

function ChatWindow({ messages = [], loggedInUser, typingStatus, sendMessage, sendTyping, selectedChat, setMessages }) {
  const [message, setMessage] = useState('');
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  // Handle typing status text
  const getTypingText = () => {
    if (!typingStatus || !selectedChatUser) return 'Online';
    if (typingStatus.senderId === selectedChatUser.id) {
      return `${typingStatus.senderName} is typing...`;
    }
    return 'Online';
  };

  // Determine other user in chat
useEffect(() => {
  if (!selectedChat || !selectedChat.user) {
    setSelectedChatUser(null);
    return;
  }

  setSelectedChatUser(selectedChat.user);
}, [selectedChat]);





  // Auto scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a text message
  const handleSend = () => {
    if (!message.trim() || !loggedInUser || !selectedChatUser) return;

    const msgObj = {
      senderId: loggedInUser.id,
      receiverId: selectedChatUser.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'SENT',
      type: 'TEXT',
    };

    if (typeof setMessages === 'function') {
      setMessages(prev => [...prev, msgObj]);
    }

    sendMessage(msgObj);
    setMessage('');
  };

  // Handle typing event
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

  // Upload file
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChatUser || !loggedInUser || !selectedChat?.id) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", loggedInUser.id);
    formData.append("receiverId", selectedChatUser.id);
    formData.append("chatId", selectedChat.id);

    try {
      const response = await axios.post("http://localhost:8080/api/message/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      sendMessage(response.data); // Optionally emit via socket
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Guard for missing chat or user
  if (!selectedChatUser) {
  return <div className="p-4 text-gray-500">Select a chat to start messaging</div>;
}

if (!selectedChat || !selectedChat.id || !loggedInUser) {
  return <div className="p-4 text-gray-500">Select a chat to start messaging</div>;
}



  return (
    <div className="flex-1 flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <div className="flex items-center p-3 bg-white border-b border-gray-200 shadow-sm">
          <img
      src={
        selectedChatUser?.profilePic
          ? selectedChatUser.profilePic
          : `https://ui-avatars.com/api/?name=${selectedChatUser?.userName || 'User'}&background=0D8ABC&color=fff`
      }
      alt="Chat Avatar"
      className="w-12 h-12 rounded-full object-cover"
/>

        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">{selectedChatUser.userName}</h2>
          <p className="text-sm text-gray-500">{getTypingText()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages
          .filter(msg =>
            (msg.senderId === loggedInUser.id && msg.receiverId === selectedChatUser.id) ||
            (msg.senderId === selectedChatUser.id && msg.receiverId === loggedInUser.id)
          )
          .map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderId === loggedInUser.id ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-white text-sm ${
                  msg.senderId === loggedInUser.id ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <p>{msg.content}</p>
                <div className="flex justify-end items-center mt-1 text-[10px] text-white/80 gap-1">
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.senderId === loggedInUser.id &&
                    (msg.status === 'SEEN' ? <CheckCheck size={14} /> : <Check size={14} />)}
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
