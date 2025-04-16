package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.NotificationService;
import com.mobylab.springbackend.service.dto.NotificationDTO;
import com.mobylab.springbackend.exception.UserNotFoundException;
import com.mobylab.springbackend.exception.NotificationServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Endpoint to get all notifications for a user
    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestParam String username) {
        try {
            if (username == null || username.trim().isEmpty()) {
                logger.error("Invalid request: username is missing or empty");
                return ResponseEntity.badRequest().body("Username is required."); // 400 Bad Request
            }

            logger.info("Request to get notifications for user {}", username);
            List<NotificationDTO> notifications = notificationService.getNotificationsForUser(username);
            logger.info("Successfully retrieved notifications for user {}", username);
            return ResponseEntity.ok(notifications); // 200 OK
        } catch (UserNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (NotificationServiceException e) {
            logger.error("Notification service error: {}", e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage()); // 500 Internal Server Error
        } catch (Exception e) {
            logger.error("Unexpected error while retrieving notifications: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }
}