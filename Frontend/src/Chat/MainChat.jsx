import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function MainChat() {
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
}

export default MainChat;