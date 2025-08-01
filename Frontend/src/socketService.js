import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectSocket = (onMessageReceived, onTypingReceived, onStatusUpdate) => {
  const socket = new SockJS('http://localhost:8080/ws'); // Must match your backend endpoint
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe('/topic/messages', (msg) => {
        onMessageReceived(JSON.parse(msg.body));
      });

      stompClient.subscribe('/topic/typing', (typing) => {
        onTypingReceived(JSON.parse(typing.body));
      });

      stompClient.subscribe('/topic/status', (status) => {
        onStatusUpdate(JSON.parse(status.body));
      });
    },
    onStompError: (frame) => {
      console.error('Broker error:', frame.headers['message']);
    }
  });

  stompClient.activate();
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }
};

export const sendTyping = (typingData) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(typingData),
    });
  }
};

export const sendStatus = (statusData) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.status',
      body: JSON.stringify(statusData),
    });
  }
};
