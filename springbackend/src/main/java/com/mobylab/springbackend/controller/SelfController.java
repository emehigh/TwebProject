package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.dto.UserDTO;
import com.mobylab.springbackend.service.UserService;
import com.mobylab.springbackend.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1")
public class SelfController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(SelfController.class);

    @Autowired
    public SelfController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam("email") String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                logger.error("Invalid request: email is missing or empty");
                return ResponseEntity.badRequest().body("Email is required."); // 400 Bad Request
            }

            logger.info("Request to fetch user details for email {}", email);
            UserDTO userDTO = userService.getUserByEmail(email);

            if (userDTO == null) {
                throw new UserNotFoundException("User with email " + email + " not found.");
            }

            logger.info("Successfully fetched user details for email {}", email);
            return ResponseEntity.ok(userDTO); // 200 OK
        } catch (UserNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (Exception e) {
            logger.error("Unexpected error while fetching user details: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }
}