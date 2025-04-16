package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    // Find posts by username with pagination
    Page<Post> findByUsername(String username, Pageable pageable);

    List<Post> findByUsername(String username);

    // Find posts by a list of usernames with pagination
    Page<Post> findByUsernameIn(List<String> usernames, Pageable pageable);
}