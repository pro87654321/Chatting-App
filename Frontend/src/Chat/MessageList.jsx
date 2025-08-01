import React from 'react';
import MessageItem from './MessageItem';

function MessageList() {
  // Replace with actual message data
  const messages = [
    { id: 1, sender: "me", text: "Hello!", timestamp: "10:00 AM" },
    { id: 2, sender: "them", text: "Hi there!", timestamp: "10:01 AM" },
    // ... more messages
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;