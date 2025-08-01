package com.whatsapp.Whatsapp.Controller;

import com.whatsapp.Whatsapp.entity.AppUser;
import com.whatsapp.Whatsapp.Reposatory.AppUserRepository;
import com.whatsapp.Whatsapp.Service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/users")
@CrossOrigin
public class AppUserController {

    private final AppUserService userService;

    public AppUserController(AppUserService userService) {
        this.userService = userService;
    }

    @Autowired
    private AppUserRepository appUserRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
            @RequestParam String query,
            @RequestParam Long excludeId) {

        List<AppUser> users = userService.searchUsers(query, excludeId);

        List<Map<String, Object>> result = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("userName", user.getUserName());
            map.put("email", user.getEmail());
            map.put("phone", user.getPhone());
            map.put("profilePicUrl", "/api/auth/profilePic/" + user.getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
    @GetMapping("/all")
    public ResponseEntity<List<AppUser>> getAllUsersExcept(@RequestParam Long excludeId) {
        List<AppUser> users = appUserRepository.findByIdNot(excludeId);
        return ResponseEntity.ok(users);
    }


}
