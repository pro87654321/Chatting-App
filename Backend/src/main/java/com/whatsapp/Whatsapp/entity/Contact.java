package com.whatsapp.Whatsapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private AppUser owner;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private AppUser contact;

    private String aliasName;
}
