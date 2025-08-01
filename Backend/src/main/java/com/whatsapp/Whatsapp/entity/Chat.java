package com.whatsapp.Whatsapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isGroup;

    private String groupName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean group) {
        isGroup = group;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }



    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @ManyToOne
    @JoinColumn(name = "created_by_id") // optional: defines the FK column
    private AppUser createdBy;
    @ManyToMany
    @JoinTable(
            name = "chat_users",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<AppUser> users = new ArrayList<>();
    private Instant createdAt;

    @OneToMany(mappedBy = "chat")
    private List<Message> messages;

    @OneToMany(mappedBy = "chat")
    private List<ChatMember> members;

    @ManyToOne
    @JoinColumn(name = "user1_id")
    private AppUser user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private AppUser user2;

    public AppUser getUser1() {
        return user1;
    }

    public void setUser1(AppUser user1) {
        this.user1 = user1;
    }

    public AppUser getUser2() {
        return user2;
    }

    public void setUser2(AppUser user2) {
        this.user2 = user2;
    }

    public void setCreatedBy(AppUser user1) {
        this.user1 = user1;
    }
}
