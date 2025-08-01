package com.whatsapp.Whatsapp.Controller;

import com.whatsapp.Whatsapp.DTO.ChatMessageDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin
public class WebSocketChatController {

    @MessageMapping("/chat.sendMessage") // Receives messages from client
    @SendTo("/topic/messages")           // Broadcasts to subscribers
    public ChatMessageDTO sendMessage(ChatMessageDTO message) {
        // Optionally save message to DB here
        return message;
    }
}
