import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import UserProfileModal from './UserProfileModal';
import { connectSocket, sendMessage, sendTyping, sendStatus } from '../socketService';

function ChatScreen() {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    console.log("Selected Chat1:", chat);
  };
  console.log("Selected Chat2:", selectedChat);
;


  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("loggedInEmail");
      if (!email) {
        console.error("No logged-in email found.");
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8080/api/auth/users/email?email=${email}`);
        setLoggedInUser(res.data);
      } catch (err) {
        console.error("Failed to fetch main user data:", err);
      }
    };
    fetchUser();
  }, []);

  // Setup WebSocket connection after user is loaded
  useEffect(() => {
    if (!loggedInUser) return;

    connectSocket(
      (msg) => {
        setMessages((prev) => [...prev, msg]);
      },
      (typing) => {
        if (typing.receiverId === loggedInUser.id) {
          setTypingStatus(`${typing.senderName} is typing...`);
          setTimeout(() => setTypingStatus(null), 3000);
        }
      },
      (status) => {
        // Update online user list
        setOnlineUsers(status.onlineUserIds);
      }
    );

    // Send login status (optional)
    sendStatus({ userId: loggedInUser.id, status: "ONLINE" });

  }, [loggedInUser]);
  //console.log(messages,typingStatus, loggedInUser, onlineUsers);

  const handleProfileUpdate = (updatedUser) => setLoggedInUser(updatedUser);
  const handleOpenProfile = () => setProfileModalOpen(true);
  const handleCloseProfile = () => setProfileModalOpen(false);
  console.log("Wolwerine  "+selectedChat);

  return (
    <div className="flex h-screen w-full font-sans">
      <Sidebar 
        onChatSelect={handleChatSelect}
        onlineUsers={onlineUsers}
        onProfileHeaderClick={handleOpenProfile} 
      />
      
      <ChatWindow 
        messages={messages}
        setMessages={setMessages}
        typingStatus={typingStatus}
        loggedInUser={loggedInUser}
        sendMessage={sendMessage}
        sendTyping={sendTyping}
        selectedChat={selectedChat}
      />

      {isProfileModalOpen && loggedInUser && (
        <UserProfileModal 
          user={loggedInUser} 
          onClose={handleCloseProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

export default ChatScreen;
