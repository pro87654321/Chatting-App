import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import ChatList from './ChatList';
import UserProfileHeader from './UserProfileHeader';
import UserProfileModal from './UserProfileModal';
import axios from 'axios';

function Sidebar({ onChatSelect, selectedChatId }) {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]); // search result
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("loggedInEmail");
        if (!email) {
          console.warn("No email in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/auth/users/email?email=${email}`);
        console.log(response);
        setLoggedInUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  // Fetch all users except logged-in user initially
  useEffect(() => {
  const fetchChats = async () => {
    try {
      const email = localStorage.getItem("loggedInEmail");
      
      if (!email) {
        console.warn("No loggedInEmail in localStorage");
        return;
      }

      const currentUserRes = await axios.get(`http://localhost:8080/api/auth/users/by-email?email=${email}`);
      
      const currentUser = currentUserRes.data;
      console.log(currentUser);

      if (!currentUser || !currentUser.id) {
        console.warn("User not found or missing ID");
        return;
      }

      console.log("User Id:", currentUser.id);

      const res = await axios.get(`http://localhost:8080/api/auth/users/all?excludeId=${currentUser.id}`);
      const formattedChats = res.data.map((user) => ({
        id: user.id,
        name: user.userName || user.name,
        isGroup: false,
        user,
      }));
      setChats(formattedChats);
    } catch (err) {
      console.error("Failed to fetch chat list:", err);
    }
  };

  fetchChats();
}, []);


  // Handle search results from SearchBox
  const handleSearchResults = (results) => {
    setFilteredChats(results);
  };
  

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 h-screen flex flex-col">
      {/* Top Profile Header */}
      <UserProfileHeader user={loggedInUser} onClick={() => setShowProfileModal(true)} />

      {/* Search bar */}
      <SearchBox onSearch={handleSearchResults} />

      {/* Chat List - shows search results if available, else full list */}
      <ChatList
  onChatSelect={onChatSelect}
  selectedChatId={selectedChatId}
  chats={filteredChats.length > 0 ? filteredChats : chats}
/>


      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfileModal 
          user={loggedInUser} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}

export default Sidebar;
