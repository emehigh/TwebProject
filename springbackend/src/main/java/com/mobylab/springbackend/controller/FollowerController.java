package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.FollowerService;
import com.mobylab.springbackend.service.dto.FollowerDTO;
import com.mobylab.springbackend.service.dto.FollowStatusDTO;
import com.mobylab.springbackend.exception.UserNotFoundException;
import com.mobylab.springbackend.exception.AlreadyFollowingException;
import com.mobylab.springbackend.exception.NotFollowingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/v1/follow")
public class FollowerController {

    private final FollowerService followerService;
    private static final Logger logger = LoggerFactory.getLogger(FollowerController.class);

    @Autowired
    public FollowerController(FollowerService followerService) {
        this.followerService = followerService;
    }

    @PostMapping("/{username}")
    public ResponseEntity<String> followUser(@PathVariable String username, @RequestParam String followerUsername) {
        try {
            logger.info("Request to follow user {} by {}", username, followerUsername);
            followerService.followUser(username, followerUsername);
            logger.info("Successfully followed user {} by {}", username, followerUsername);
            return ResponseEntity.ok("Successfully followed the user.");
        } catch (UserNotFoundException e) {
            logger.error("Follow failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (AlreadyFollowingException e) {
            logger.error("Follow failed: {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage()); // 409 Conflict
        } catch (Exception e) {
            logger.error("Unexpected error during follow: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<String> unfollowUser(@PathVariable String username, @RequestParam String followerUsername) {
        try {
            logger.info("Request to unfollow user {} by {}", username, followerUsername);
            followerService.unfollowUser(username, followerUsername);
            logger.info("Successfully unfollowed user {} by {}", username, followerUsername);
            return ResponseEntity.ok("Successfully unfollowed the user.");
        } catch (UserNotFoundException e) {
            logger.error("Unfollow failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (NotFollowingException e) {
            logger.error("Unfollow failed: {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage()); // 409 Conflict
        } catch (Exception e) {
            logger.error("Unexpected error during unfollow: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String username) {
        try {
            logger.info("Request to get followers for user {}", username);
            List<FollowerDTO> followers = followerService.getFollowers(username);
            logger.info("Successfully retrieved followers for user {}", username);
            return ResponseEntity.ok(followers);
        } catch (UserNotFoundException e) {
            logger.error("Get followers failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (Exception e) {
            logger.error("Unexpected error during get followers: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String username) {
        try {
            logger.info("Request to get following for user {}", username);
            List<FollowerDTO> following = followerService.getFollowing(username);
            logger.info("Successfully retrieved following for user {}", username);
            return ResponseEntity.ok(following);
        } catch (UserNotFoundException e) {
            logger.error("Get following failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (Exception e) {
            logger.error("Unexpected error during get following: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    @GetMapping("/{username}/status")
    public ResponseEntity<?> getFollowStatusAndCounts(@PathVariable String username, @RequestParam String followerUsername) {
        try {
            logger.info("Request to get follow status for user {} by {}", username, followerUsername);
            FollowStatusDTO followStatus = followerService.getFollowStatusAndCounts(username, followerUsername);
            logger.info("Successfully retrieved follow status for user {} by {}", username, followerUsername);
            return ResponseEntity.ok(followStatus);
        } catch (UserNotFoundException e) {
            logger.error("Get follow status failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (Exception e) {
            logger.error("Unexpected error during get follow status: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }
}