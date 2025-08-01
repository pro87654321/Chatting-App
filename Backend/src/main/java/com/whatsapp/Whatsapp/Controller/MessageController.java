package com.whatsapp.Whatsapp.Controller;

import com.whatsapp.Whatsapp.DTO.ChatMessageDTO;
import com.whatsapp.Whatsapp.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin("*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Send a message (text or with file)
    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestParam("senderId") Long senderId,
            @RequestParam("chatId") Long chatId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        ChatMessageDTO messageDTO = messageService.sendMessage(senderId, chatId, content, file);
        return ResponseEntity.ok(messageDTO);
    }

    // Get all messages of a chat
    @GetMapping("/{chatId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesByChat(@PathVariable Long chatId) {
        List<ChatMessageDTO> messages = messageService.getMessagesByChat(chatId);
        return ResponseEntity.ok(messages);
    }
}
