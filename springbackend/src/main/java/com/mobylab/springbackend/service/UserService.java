package com.mobylab.springbackend.service;

import com.mobylab.springbackend.service.dto.UserDTO;
import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getUsername(), user.getEmail());
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getUsername(), user.getEmail());
    }

    public List<UserDTO> searchUsers(String query) {
    List<User> users = userRepository.findAll(); // Fetch all users from the database
    return users.stream()
            .filter(user -> (user.getUsername() != null && user.getUsername().toLowerCase().contains(query.toLowerCase())))
            .map(user -> new UserDTO(user.getUsername(), user.getEmail()))
            .collect(Collectors.toList());
}
}