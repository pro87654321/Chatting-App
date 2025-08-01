package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.DTO.ChatMessageDTO;
import com.whatsapp.Whatsapp.Reposatory.AppUserRepository;
import com.whatsapp.Whatsapp.Reposatory.ChatRepository;
import com.whatsapp.Whatsapp.Reposatory.MessageAttachmentRepository;
import com.whatsapp.Whatsapp.Reposatory.MessageRepository;
import com.whatsapp.Whatsapp.entity.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageAttachmentRepository attachmentRepository;

    public ChatMessageDTO sendMessage(Long senderId, Long chatId, String content, MultipartFile file) throws IOException {
        AppUser sender = userRepository.findById(senderId).orElseThrow();
        Chat chat = chatRepository.findById(chatId).orElseThrow();

        Message message = new Message();
        message.setSender(sender);
        message.setChat(chat);
        message.setContent(content != null ? content : "");
        message.setTimestamp(Instant.now());
        message.setStatus(Message.MessageStatus.SENT);

        if (file != null && !file.isEmpty()) {
            String uploadDir = "uploads/";
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File targetFile = new File(uploadDir + filename);
            file.transferTo(targetFile);

            MessageAttachment attachment = new MessageAttachment();
            attachment.setFileUrl("/" + uploadDir + filename);
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setMessage(message);

            message.getAttachments().add(attachment);
        }

        Message savedMessage = messageRepository.save(message);
        return convertToDTO(savedMessage);
    }

    public List<ChatMessageDTO> getMessagesByChat(Long chatId) {
        List<Message> messages = messageRepository.findByChatIdOrderByTimestampAsc(chatId);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ChatMessageDTO convertToDTO(Message message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setStatus(message.getStatus().name());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getUserName());

        List<String> urls = message.getAttachments().stream()
                .map(MessageAttachment::getFileUrl)
                .collect(Collectors.toList());

        dto.setAttachmentUrls(urls);
        return dto;
    }
}
