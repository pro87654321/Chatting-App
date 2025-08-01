package com.whatsapp.Whatsapp.Service;


import com.whatsapp.Whatsapp.DTO.SignupDTO;
import com.whatsapp.Whatsapp.Reposatory.ChatRepository;
import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.Reposatory.UserRepository;
import com.whatsapp.Whatsapp.entity.Chat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthServic {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AppUser registerUser(SignupDTO signupDTO) {
        if (userRepository.findByEmail(signupDTO.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + signupDTO.getEmail());
        }

        AppUser user = new AppUser();
        user.setUserName(signupDTO.getUserName());
        user.setEmail(signupDTO.getEmail());
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public String login(String email, String password) {
        return "";
    }

    @Override
    public String resetPassword(String email, String newPassword) {
        return "";
    }

    @Override
    public AppUser getUserByEmail(String email) {
        return null;
    }

    @Override
    public AppUser updateUser(Long userId, AppUser userDetails) {
        return null;
    }


    @Override
    public List<Chat> getChatsForUser(Long userId) {
        return chatRepository.findByUsers_Id(userId);
    }

}

