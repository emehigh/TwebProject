package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Follower;
import com.mobylab.springbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowerRepository extends JpaRepository<Follower, Long> {
    boolean existsByUserAndFollower(User user, User follower);

    Optional<Follower> findByUserAndFollower(User user, User follower);

    List<Follower> findByUser(User user);

    List<Follower> findByFollower(User follower);

    long countByUser(User user);

    long countByFollower(User follower);

    List<Follower> findByFollower_Username(String username);
}