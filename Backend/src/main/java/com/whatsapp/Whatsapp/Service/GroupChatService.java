package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.entity.GroupChat;
import com.whatsapp.Whatsapp.Reposatory.GroupChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupChatService {

    @Autowired
    private GroupChatRepository groupChatRepository;

    public List<GroupChat> getGroupChatsForUser(Long userId) {
        return groupChatRepository.findGroupChatsByUserId(userId);
    }
}
