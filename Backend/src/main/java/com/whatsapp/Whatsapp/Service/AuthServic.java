package com.whatsapp.Whatsapp.Service;


import com.whatsapp.Whatsapp.DTO.SignupDTO;
import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.entity.Chat;

import java.util.List;

public interface AuthServic {
    AppUser registerUser(SignupDTO signupDTO);
    String login(String email, String password); // ✅ ADD THIS
    String resetPassword(String email, String newPassword); // optional
    AppUser getUserByEmail(String email); // optional
    AppUser updateUser(Long userId, AppUser userDetails); // optional

    List<Chat> getChatsForUser(Long userId);
}
