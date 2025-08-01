import React from 'react';

function MessageInput() {
  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none mr-2"
        />
        <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none">
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;