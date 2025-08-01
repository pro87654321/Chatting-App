package com.whatsapp.Whatsapp.Controller;
import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.OtpRequest;

import com.whatsapp.Whatsapp.Reposatory.UserRepository;
import com.whatsapp.Whatsapp.Service.EmailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.whatsapp.Whatsapp.Service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {
        try {
            // Validate inputs (optional)
            if (user.getUserName() == null || user.getEmail() == null || user.getPassword() == null) {
                return ResponseEntity.badRequest().body("Missing fields");
            }

            // Check if user exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("User already exists");
            }

            // Save user
            AppUser savedUser = userRepository.save(user);

            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            e.printStackTrace(); // ✅ Logs error in console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed: " + e.getMessage());
        }
    }



    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        return "OTP sent to email: " + emailService.sendOtp(email);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        if (emailService.verifyOtp(email, otp)) {
            System.out.println("Email: " + email + ", OTP: " + otp);
            return ResponseEntity.ok("OTP verified successfully!");
        }

        return ResponseEntity.badRequest().body("Invalid OTP!");
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        return authService.login(email, password);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        try {
            authService.resetPassword(email, newPassword);
            return ResponseEntity.ok("Password reset successfully.");
        } catch (Exception e) {
            e.printStackTrace(); // helpful for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password.");
        }
    }

    @GetMapping("/users/email")
    public ResponseEntity<AppUser> getUserByEmail(@RequestParam String email) {
        AppUser user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    @GetMapping("/users/by-email")
    public ResponseEntity<AppUser> getUserByEmailByPath(@RequestParam String email) {
        AppUser user = authService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(user);
    }



    @PutMapping("/users/{id}")
    public ResponseEntity<AppUser> updateUserProfile(@PathVariable Long id, @RequestBody AppUser userDetails) {
        try {
            AppUser updatedUser = authService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


//    @GetMapping("/api/chats/user/{userId}")
//    public ResponseEntity<List<Chat>> getUserChats(@PathVariable Long userId) {
//        List<Chat> chats = chatService.getChatsForUser(userId);
//        return ResponseEntity.ok(chats);
//    }



}