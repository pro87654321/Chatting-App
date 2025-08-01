package com.whatsapp.Whatsapp.DTO;

import java.time.Instant;
import java.util.List;

public class ChatMessageDTO {
    private Long id;
    private String content;
    private Instant timestamp;
    private String status;
    private Long senderId;
    private String senderName;
    private List<String> attachmentUrls;

    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, String content, Instant timestamp, String status,
                          Long senderId, String senderName, List<String> attachmentUrls) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status;
        this.senderId = senderId;
        this.senderName = senderName;
        this.attachmentUrls = attachmentUrls;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Long getSenderId() {
        return senderId;
    }
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public List<String> getAttachmentUrls() {
        return attachmentUrls;
    }
    public void setAttachmentUrls(List<String> attachmentUrls) {
        this.attachmentUrls = attachmentUrls;
    }
}
