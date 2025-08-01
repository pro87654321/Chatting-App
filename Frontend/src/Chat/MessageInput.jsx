import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Paperclip, Send } from 'lucide-react'; // Icon package, install via: npm install lucide-react

function MessageInput({ senderId, chatId, onMessageSent }) {
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!messageText && !selectedFile) return;

    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("chatId", chatId);
    if (messageText) formData.append("content", messageText);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8080/api/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Notify parent and reset
      onMessageSent(response.data);
      setMessageText('');
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    // Optionally emit typing event here
  };

  return (
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
        value={messageText}
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
  );
}

export default MessageInput;
