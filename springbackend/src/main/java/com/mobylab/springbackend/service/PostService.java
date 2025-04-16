// filepath: c:\Users\Mihai\Desktop\tweb\springbackend\src\main\java\com\mobylab\springbackend\service\PostService.java
package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.Post;
import com.mobylab.springbackend.repository.PostRepository;
import com.mobylab.springbackend.service.dto.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mobylab.springbackend.repository.FollowerRepository;
import com.mobylab.springbackend.service.dto.UserDTO;
import com.mobylab.springbackend.service.UserService;
import com.mobylab.springbackend.service.dto.FollowerDTO;
import com.mobylab.springbackend.service.FollowerService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.UUID;
import com.mobylab.springbackend.repository.CommentRepository;
import java.util.List;
import java.util.ArrayList;
import com.mobylab.springbackend.entity.Comment;
import java.util.List;
import java.util.stream.Collectors;
import com.mobylab.springbackend.entity.Like;
import com.mobylab.springbackend.repository.LikeRepository;
import java.time.LocalDateTime;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final FollowerRepository followerRepository;
    private final UserService userService;
        private final CommentRepository commentRepository;

    private final FollowerService followerService;
        private final LikeRepository likeRepository;

    @Autowired
    public PostService(PostRepository postRepository, FollowerRepository followerRepository, UserService userService, FollowerService followerService, CommentRepository commentRepository, LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.followerRepository = followerRepository;
        this.userService = userService;
        this.followerService = followerService;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    public List<PostDTO> getAllPosts(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Post> postsPage = postRepository.findAll(pageable); // Use JpaRepository's built-in pagination
    return postsPage.getContent().stream()
            .map(post -> new PostDTO(
                    post.getId().toString(),
                    post.getContent(),
                    post.getUsername(),
                    post.getCreatedAt()
            ))
            .collect(Collectors.toList());
}

    public PostDTO createPost(Post post) {
        Post savedPost = postRepository.save(post);
        return new PostDTO(
                savedPost.getId().toString(),
                savedPost.getContent(),
                savedPost.getUsername(),
                savedPost.getCreatedAt()
        );
    }

    public List<PostDTO> getPostsByUsername(String username, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Post> postsPage = postRepository.findByUsername(username, pageable);
    return postsPage.getContent().stream()
            .map(post -> new PostDTO(
                    post.getId().toString(),
                    post.getContent(),
                    post.getUsername(),
                    post.getCreatedAt()
            ))
            .collect(Collectors.toList());
}

public List<PostDTO> getPostsFromFollowedUsers(String username, int page, int size) {
    // Get the list of usernames the current user is following
    List<FollowerDTO> following = followerService.getFollowing(username);

    // Extract the usernames of the followed users
    List<String> followedUsernames = following.stream()
            .map(FollowerDTO::getUsername)
            .collect(Collectors.toList());

    // Include the current user's username
    followedUsernames.add(username);

    Pageable pageable = PageRequest.of(page, size);
    Page<Post> postsPage = postRepository.findByUsernameIn(followedUsernames, pageable); // Use JpaRepository's built-in method
    System.out.println("Followed usernames: " + followedUsernames);
    return postsPage.getContent().stream()
            .map(post -> new PostDTO(
                    post.getId().toString(),
                    post.getContent(),
                    post.getUsername(),
                    post.getCreatedAt()
            ))
            .collect(Collectors.toList());
}
public PostDTO getPostById(String id) {
    return postRepository.findById(UUID.fromString(id))
            .map(post -> new PostDTO(
                    post.getId().toString(),
                    post.getContent(),
                    post.getUsername(),
                    post.getCreatedAt()
            ))
            .orElse(null); // Return null if the post is not found
}
public PostDTO updatePost(String postId, String content) {
    UUID postUuid = UUID.fromString(postId);
    Post post = postRepository.findById(postUuid)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    post.setContent(content); // Update the content of the post
    post = postRepository.save(post); // Save the updated post

    return new PostDTO(
            post.getId().toString(),
            post.getContent(),
            post.getUsername(),
            post.getCreatedAt()
    ); // Convert the updated post to a DTO and return it
}
public int likePost(String postId, String username) {
    UUID postUuid = UUID.fromString(postId);

    // Check if the user already liked the post
    if (likeRepository.existsByPostIdAndUsername(postUuid, username)) {
        throw new IllegalArgumentException("User has already liked this post");
    }

    // Fetch the post
    Post post = postRepository.findById(postUuid)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    // Create a new like
    Like like = new Like(post, username);
    likeRepository.save(like);

    // Return the total number of likes for the post
    return likeRepository.findByPostId(postUuid).size();
}

   public List<Post> findAll() {
        return postRepository.findAll();
    }

public int dislikePost(String postId, String username) {
    UUID postUuid = UUID.fromString(postId);

    // Check if the user has liked the post
    Like like = likeRepository.findByPostIdAndUsername(postUuid, username)
            .orElseThrow(() -> new IllegalArgumentException("User has not liked this post"));

    // Remove the like
    likeRepository.delete(like);

    // Return the total number of likes for the post
    return likeRepository.findByPostId(postUuid).size();
}

public List<Like> getLikesForPost(String postId) {
    UUID postUuid = UUID.fromString(postId);
    return likeRepository.findByPostId(postUuid);
}
    public Comment addComment(String postId, String username, String content) {
        Post post = postRepository.findById(UUID.fromString(postId))
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUsername(username);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsForPost(String postId) {
        UUID postUuid = UUID.fromString(postId);
        return commentRepository.findByPostId(postUuid);
    }

    public boolean deleteComment(String postId, Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!comment.getUsername().equals(username)) {
            return false; // User is not authorized to delete this comment
        }

        commentRepository.delete(comment);
        return true;
    }
    public boolean deletePost(String postId, String username) {
    UUID postUuid = UUID.fromString(postId);
    Post post = postRepository.findById(postUuid)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    // Check if the user is the creator of the post
    if (!post.getUsername().equals(username)) {
        return false; // User is not authorized to delete this post
    }

    postRepository.delete(post); // Delete the post
    return true;
}
    
}