package com.whatsapp.Whatsapp.Service;

import com.whatsapp.Whatsapp.DTO.SignupDTO;
import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.Reposatory.UserRepository;
import com.whatsapp.Whatsapp.entity.Chat;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService implements AuthServic {

    @Autowired
    private UserRepository repo;

    @Override
    public AppUser registerUser(SignupDTO dto) {
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        AppUser user = new AppUser();
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setProfilePic(dto.getProfilePic());

        return repo.save(user);
    }

    public String signup(AppUser user) {
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists!";
        }
        repo.save(user);
        return "Signup successful!";
    }

    public String login(String email, String password) {
        Optional<AppUser> optionalUser = repo.findByEmail(email);
        if (optionalUser.isPresent() && optionalUser.get().getPassword().equals(password)) {
            return "Login successful!";
        }
        return "Invalid credentials!";
    }

    public String resetPassword(String email, String newPassword) {
        Optional<AppUser> optionalUser = repo.findByEmail(email);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            user.setPassword(newPassword);
            repo.save(user);
            return "Password reset successful!";
        }
        return "User not found!";
    }

    public AppUser getUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null); // ✅ safe access
    }


    public AppUser updateUser(Long userId, AppUser userDetails) {
        AppUser userToUpdate = repo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        userToUpdate.setUserName(userDetails.getUserName());
        userToUpdate.setPhone(userDetails.getPhone());

        if (userDetails.getProfilePic() != null && !userDetails.getProfilePic().isEmpty()) {
            userToUpdate.setProfilePic(userDetails.getProfilePic());
        }

        return repo.save(userToUpdate);
    }

    @Override
    public List<Chat> getChatsForUser(Long userId) {
        return List.of();
    }
}
