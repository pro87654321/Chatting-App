package com.whatsapp.Whatsapp.Controller;

import com.whatsapp.Whatsapp.Service.AuthService;
import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.entity.Chat;

import com.whatsapp.Whatsapp.Service.ChatService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private AuthService authService;

    @PostMapping("/private")
    public ResponseEntity<Chat> createOrGetPrivateChat(@RequestBody PrivateChatRequest request) {
        Chat chat = chatService.createOrGetPrivateChat(request.getUserId(), request.getOtherUserId());
        System.out.println(request.getUserId()+" "+ request.getOtherUserId());
        return ResponseEntity.ok(chat);
    }

    // DTO class inside controller or separate file
    public static class PrivateChatRequest {
        private Long userId;
        private Long otherUserId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getOtherUserId() {
            return otherUserId;
        }

        public void setOtherUserId(Long otherUserId) {
            this.otherUserId = otherUserId;
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AppUser> updateUserProfile(@PathVariable Long id, @RequestBody AppUser userDetails) {
        try {
            AppUser updatedUser = authService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
