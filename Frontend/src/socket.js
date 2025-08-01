import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (onMessage) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("Connected");

    // Subscribe to receive broadcasted messages
    stompClient.subscribe("/topic/messages", (msg) => {
      const body = JSON.parse(msg.body);
      onMessage(body);
    });
  });
};

export const sendMessage = (msg) => {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
  }
};
