import React from 'react';

function MessageItem({ message }) {
  const isMe = message.sender === "me";
  const messageClass = isMe ? "bg-blue-200 ml-auto" : "bg-gray-200 mr-auto";

  return (
    <div className={`mb-2 p-2 rounded-lg max-w-xs ${messageClass}`}>
      <p className="text-sm">{message.text}</p>
      <p className="text-xs text-gray-600 text-right">{message.timestamp}</p>
    </div>
  );
}

export default MessageItem;