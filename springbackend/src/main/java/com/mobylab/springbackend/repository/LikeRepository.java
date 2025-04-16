package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPostId(UUID postId);
    boolean existsByPostIdAndUsername(UUID postId, String username);
    Optional<Like> findByPostIdAndUsername(UUID postId, String username);
}