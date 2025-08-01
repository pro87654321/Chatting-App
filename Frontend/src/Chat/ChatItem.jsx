import React from 'react';

function ChatItem({ key,chat, onClick, isSelected }) {
  console.log(key, chat);
  const isSearchResult = !!chat.user;

  const name = isSearchResult
    ? chat.user.userName || chat.user.name
    : chat.name;

  const email = isSearchResult ? chat.user.email : '';
  const phone = isSearchResult ? chat.user.phone : '';
  const status = isSearchResult ? chat.user.status : '';

  const profilePic = isSearchResult
    ? `http://localhost:8080/api/auth/profilePic/${email}`
    : `http://localhost:8080/api/auth/profilePic/${chat.user?.email || name}`;

  const lastMessage = !isSearchResult && chat.lastMessage ? chat.lastMessage.text : '';

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 ${
        isSelected ? 'bg-gray-200' : ''
      }`}
    >
      <img
        src={profilePic}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }}
      />
      <div className="ml-3 flex flex-col">
        <p className="text-sm font-semibold">{name}</p>
        {isSearchResult ? (
          <>
            <p className="text-xs text-gray-500">{email}</p>
            <p className="text-xs text-gray-500">{phone}</p>
            {status && <p className="text-xs text-gray-400 italic">Status: {status}</p>}
          </>
        ) : (
          <p className="text-xs text-gray-500">{lastMessage}</p>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
