package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.Follower;
import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.repository.FollowerRepository;
import com.mobylab.springbackend.repository.UserRepository;
import com.mobylab.springbackend.service.dto.FollowerDTO;
import com.mobylab.springbackend.service.dto.FollowStatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowerService {

    private final FollowerRepository followerRepository;
    private final UserRepository userRepository;

    @Autowired
    public FollowerService(FollowerRepository followerRepository, UserRepository userRepository) {
        this.followerRepository = followerRepository;
        this.userRepository = userRepository;
    }

    public void followUser(String username, String followerUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Follower not found: " + followerUsername));

        if (!followerRepository.existsByUserAndFollower(user, follower)) {
            Follower follow = new Follower(user, follower);
            followerRepository.save(follow);
        }
    }

    public void unfollowUser(String username, String followerUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Follower not found: " + followerUsername));

        Follower follow = followerRepository.findByUserAndFollower(user, follower)
                .orElseThrow(() -> new IllegalArgumentException("Follow relationship not found."));
        followerRepository.delete(follow);
    }

    public List<FollowerDTO> getFollowers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return followerRepository.findByUser(user).stream()
                .map(follower -> new FollowerDTO(
                        follower.getUser().getUsername(),
                        follower.getFollower().getUsername()
                ))
                .toList();
    }

    public List<FollowerDTO> getFollowing(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return followerRepository.findByFollower(user).stream()
                .map(follower -> new FollowerDTO(
                        follower.getUser().getUsername(),
                        follower.getFollower().getUsername()
                ))
                .toList();
    }

    public FollowStatusDTO getFollowStatusAndCounts(String username, String followerUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Follower not found: " + followerUsername));

        boolean isFollowing = followerRepository.existsByUserAndFollower(user, follower);
        long followersCount = followerRepository.countByUser(user);
        long followingCount = followerRepository.countByFollower(user);

        return new FollowStatusDTO(isFollowing, followersCount, followingCount);
    }
}