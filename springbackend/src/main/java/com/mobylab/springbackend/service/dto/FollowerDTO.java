package com.mobylab.springbackend.service.dto;

public class FollowerDTO {
    private String username; // The username of the user being followed
    private String followerUsername; // The username of the follower

    public FollowerDTO(String username, String followerUsername) {
        this.username = username;
        this.followerUsername = followerUsername;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFollowerUsername() {
        return followerUsername;
    }

    public void setFollowerUsername(String followerUsername) {
        this.followerUsername = followerUsername;
    }
}