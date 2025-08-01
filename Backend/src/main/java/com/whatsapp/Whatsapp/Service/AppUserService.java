package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.entity.AppUser;

import com.whatsapp.Whatsapp.Reposatory.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppUserService {

    @Autowired
    private final AppUserRepository userRepository;

    public AppUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AppUser> searchUsers(String query, Long excludeId) {
        return userRepository.searchUsersByName(query, excludeId);
    }

    public Optional<AppUser> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
