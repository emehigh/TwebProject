package com.mobylab.springbackend.service.dto;

import java.time.LocalDateTime;

public class NotificationDTO {
    private String type; // "like", "comment", "follow"
    private String message;
    private LocalDateTime createdAt;

    public NotificationDTO(String type, String message, LocalDateTime createdAt) {
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}