package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.UserService;
import com.mobylab.springbackend.service.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query) {
        if (query.length() < 3) {
            return ResponseEntity.ok(List.of()); // Return an empty list if the query is too short
        }

        List<UserDTO> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}