package com.whatsapp.Whatsapp.Controller;

import com.whatsapp.Whatsapp.entity.GroupChat;
import com.whatsapp.Whatsapp.Service.GroupChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin
public class GroupChatController {

    @Autowired
    private GroupChatService groupChatService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupChat>> getUserGroupChats(@PathVariable Long userId) {
        List<GroupChat> chats = groupChatService.getGroupChatsForUser(userId);
        return ResponseEntity.ok(chats);
    }
}
