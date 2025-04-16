package com.mobylab.springbackend.service.dto;

public class FollowStatusDTO {
    private boolean isFollowing; // Whether the user is following
    private long followersCount; // Number of followers
    private long followingCount; // Number of users being followed

    public FollowStatusDTO(boolean isFollowing, long followersCount, long followingCount) {
        this.isFollowing = isFollowing;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }

    // Getters and Setters
    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    public long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(long followingCount) {
        this.followingCount = followingCount;
    }
}