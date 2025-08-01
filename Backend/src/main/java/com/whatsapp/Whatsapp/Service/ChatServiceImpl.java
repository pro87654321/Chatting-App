package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.entity.Chat;

import com.whatsapp.Whatsapp.Reposatory.ChatRepository;
import com.whatsapp.Whatsapp.Reposatory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Chat createOrGetPrivateChat(Long userId, Long otherUserId) {
        Optional<Chat> existingChat = chatRepository.findPrivateChatBetweenUsers(userId, otherUserId);

        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        AppUser user1 = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        AppUser user2 = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + otherUserId));

        Chat chat = new Chat();
        chat.setGroup(false);
        chat.setUser1(user1);
        chat.setUser2(user2);
        chat.setCreatedBy(user1); // optional
        chat.setCreatedAt(Instant.now());

        return chatRepository.save(chat);
    }

    @Override
    public List<Chat> getChatsForUser(Long userId) {
        return List.of();
    }


}
