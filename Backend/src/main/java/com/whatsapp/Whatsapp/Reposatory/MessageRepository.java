package com.whatsapp.Whatsapp.Reposatory;

import com.whatsapp.Whatsapp.entity.Chat;
import com.whatsapp.Whatsapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChat(Chat chat);
    List<Message> findByChatIdOrderByTimestampAsc(Long chatId);

}
