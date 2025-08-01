package com.whatsapp.Whatsapp.Reposatory;

import com.whatsapp.Whatsapp.entity.MessageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageAttachmentRepository extends JpaRepository<MessageAttachment, Long> {
}
