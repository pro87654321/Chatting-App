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
    if (chat) {
      setSelectedChat(chat);
      console.log("Selected Chat1:", chat);
    } else {
      console.error("Chat is null in handleChatSelect");
    }
  };

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

  useEffect(() => {
    if (!loggedInUser) return;

    connectSocket(
      (msg) => setMessages((prev) => [...prev, msg]),
      (typing) => {
        if (typing.receiverId === loggedInUser.id) {
          setTypingStatus(`${typing.senderName} is typing...`);
          setTimeout(() => setTypingStatus(null), 3000);
        }
      },
      (status) => setOnlineUsers(status.onlineUserIds)
    );

    sendStatus({ userId: loggedInUser.id, status: "ONLINE" });
  }, [loggedInUser]);

  const handleProfileUpdate = (updatedUser) => setLoggedInUser(updatedUser);
  const handleOpenProfile = () => setProfileModalOpen(true);
  const handleCloseProfile = () => setProfileModalOpen(false);

  console.log("Selected Chat2:", selectedChat);
  console.log("Logged in user:", loggedInUser);

  return (
    <div className="flex h-screen w-full font-sans">
      <Sidebar 
        onChatSelect={handleChatSelect}
        onlineUsers={onlineUsers}
        onProfileHeaderClick={handleOpenProfile} 
      />

      {loggedInUser && selectedChat ? (
        <ChatWindow 
          messages={messages}
          setMessages={setMessages}
          typingStatus={typingStatus}
          loggedInUser={loggedInUser}
          sendMessage={sendMessage}
          sendTyping={sendTyping}
          selectedChat={selectedChat}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
          {loggedInUser ? "Please select a chat to start messaging." : "Loading user..."}
        </div>
      )}

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
