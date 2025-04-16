package com.mobylab.springbackend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "followers", schema = "project") 
public class Follower {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Automatically generate UUID for the ID
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // The user being followed
    private User user;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false) // The user who is following
    private User follower;

    public Follower() {
    }

    public Follower(User user, User follower) {
        this.user = user;
        this.follower = follower;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }
}