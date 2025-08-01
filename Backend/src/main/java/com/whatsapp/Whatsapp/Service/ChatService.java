package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.entity.Chat;

import java.util.List;

public interface ChatService {
    Chat createOrGetPrivateChat(Long userId, Long otherUserId);

    List<Chat> getChatsForUser(Long userId);

}
