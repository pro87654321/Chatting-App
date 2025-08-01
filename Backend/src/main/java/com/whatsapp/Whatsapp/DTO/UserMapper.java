package com.whatsapp.Whatsapp.DTO;

import com.whatsapp.Whatsapp.entity.AppUser;


public class UserMapper {

    public static UserDto toDto(AppUser user) {
        return new UserDto(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getProfilePic()
        );
    }

    public static AppUser toEntity(UserDto dto) {
        AppUser user = new AppUser();
        user.setId(dto.getId());
        user.setUserName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setProfilePic(dto.getProfilePic());
        return user;
    }
}
