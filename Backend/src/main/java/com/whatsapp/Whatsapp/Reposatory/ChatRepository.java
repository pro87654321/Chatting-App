package com.whatsapp.Whatsapp.Reposatory;

import com.whatsapp.Whatsapp.entity.Chat;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c FROM Chat c WHERE (c.user1.id = :userId OR c.user2.id = :userId)")
    List<Chat> findAllChatsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Chat c " +
            "WHERE c.isGroup = false AND " +
            "((c.user1.id = :userId1 AND c.user2.id = :userId2) OR " +
            " (c.user1.id = :userId2 AND c.user2.id = :userId1))")
    Optional<Chat> findPrivateChatBetweenUsers(@Param("userId1") Long userId1,
                                               @Param("userId2") Long userId2);

    List<Chat> findByUsers_Id(Long userId);

}
