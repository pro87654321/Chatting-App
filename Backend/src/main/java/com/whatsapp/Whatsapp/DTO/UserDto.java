package com.whatsapp.Whatsapp.DTO;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String profilePic;

    // Constructors
    public UserDto() {}

    public UserDto(Long id, String name, String email, String profilePic) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePic = profilePic;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}
