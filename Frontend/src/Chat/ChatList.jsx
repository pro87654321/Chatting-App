import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatItem from "./ChatItem";
import ChatScreen from "./ChatScreen";

function ChatList({ onChatSelect, selectedChatId, chats, onUserLoad }) {
  const [allChats, setAllChats] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Fetch logged-in user
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const email = localStorage.getItem("loggedInEmail");
      if (!email) return;
      
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/users/email?email=${email}`
        );
        setLoggedInUser(response.data);
        
        if (typeof onUserLoad === "object") {
          onUserLoad(response.data); // ✅ Inform parent if needed
        }
      } catch (err) {
        console.error("Error fetching logged-in user:", err);
        setError("Error loading user data");
      }
    };
    
    fetchLoggedInUser();
  }, [onUserLoad]);
  
  // Load user's chats (if not provided via props)
  useEffect(() => {
    const fetchChats = async () => {
      if (chats && chats.length > 0) return;
      if (!loggedInUser || !loggedInUser.id) return;
      
      setLoading(true);
      try {
        const [individualChatsRes, groupChatsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/chats/user/${loggedInUser.id}`),
          axios.get(`http://localhost:8080/api/groups/user/${loggedInUser.id}`),
        ]);
        
        const individualChats = individualChatsRes.data.map((chat) => ({
          ...chat,
          isGroup: false,
        }));
        const groupChats = groupChatsRes.data.map((chat) => ({
          ...chat,
          isGroup: true,
        }));
        
        setAllChats([...individualChats, ...groupChats]);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [loggedInUser, chats]);
  
  // Handle chat item click or result from search
 const handleChatSelect = async (chat) => {
  if (!loggedInUser) return;

  try {
    if (!chat.isGroup && !chat.messages && chat.user) {
      // If it's a new user search result
      const res = await axios.post(
        "http://localhost:8080/api/chats/private",
        {
          userId: loggedInUser.id,
          otherUserId: chat.user.id,
        }
      );

      const newChat = res.data; // Assuming the response contains the newly created chat object
      console.log(newChat);

      if (typeof onChatSelect === "function") {
        onChatSelect(newChat); // Pass the new chat object to onChatSelect
      } else {
        console.error("onChatSelect is not a function");
      }
    } else {
      if (typeof onChatSelect === "function") {
        onChatSelect(chat);
      } else {
        console.error("onChatSelect is not a function1");
      }
    }
  } catch (err) {
    console.error("Error creating private chat:", err);
    setError("Failed to create chat");
  }
};
  // console.log("hello :",chat.id);
  
  const displayChats = chats && chats.length > 0 ? chats : allChats;
  console.log(chats,chats.user);
  
  if (loading) return <div className="p-4 text-center">Loading chats...</div>;
  if (error && displayChats.length === 0)
    return <div className="p-4 text-center text-red-500">{error}</div>;
  
  return (
    <div className="chat-list overflow-y-auto">
      {displayChats.map((chat) => (
        <>
        <ChatItem
          key={chat.id}
          chat={chat}
          onClick={() => handleChatSelect(chat)}
          isSelected={chat.id === selectedChatId}
        />
        </>
      ))}
 
      
    </div>
  );
}

export default ChatList;
