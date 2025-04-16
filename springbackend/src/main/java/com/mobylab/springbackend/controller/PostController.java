package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.entity.Post;
import com.mobylab.springbackend.service.PostService;
import com.mobylab.springbackend.service.dto.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import com.mobylab.springbackend.entity.Comment;
import com.mobylab.springbackend.entity.Like;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mobylab.springbackend.exception.InvalidInputException;
import com.mobylab.springbackend.exception.PostNotFoundException;
import com.mobylab.springbackend.exception.UserNotFoundException;
import com.mobylab.springbackend.exception.AlreadyFollowingException;
import com.mobylab.springbackend.exception.NotFollowingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Endpoint to get all posts
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<PostDTO> posts = postService.getAllPosts(page, size);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("Error fetching posts: {}", e.getMessage());
            return ResponseEntity.status(500).body(null); // 500 Internal Server Error
        }
    }
    // Endpoint to create a new post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            if (post.getContent() == null || post.getContent().trim().isEmpty()) {
                throw new InvalidInputException("Post content cannot be empty.");
            }
            PostDTO createdPost = postService.createPost(post);
            return ResponseEntity.ok(createdPost);
        } catch (InvalidInputException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
        } catch (Exception e) {
            logger.error("Error creating post: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    // Endpoint to get posts by username
@GetMapping("/user/{username}")
public ResponseEntity<List<PostDTO>> getPostsByUsername(
        @PathVariable String username,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    List<PostDTO> posts = postService.getPostsByUsername(username, page, size);
    return ResponseEntity.ok(posts);
}

   @GetMapping("/getPosts")
public ResponseEntity<List<PostDTO>> getPosts(
        @RequestParam(required = true) String username,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    List<PostDTO> posts;


    if (username != null && !username.trim().isEmpty()) {
        // Fetch posts from the people the user is following with pagination
        posts = postService.getPostsFromFollowedUsers(username, page, size);
    } else {
        return ResponseEntity.badRequest().build(); // Return 400 Bad Request if username is missing
    }
    return ResponseEntity.ok(posts);
}
    

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            PostDTO post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (PostNotFoundException e) {
            logger.error("Post not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (Exception e) {
            logger.error("Error fetching post: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

@PostMapping("/{id}/like")
public ResponseEntity<Integer> likePost(
        @PathVariable String id,
        @RequestBody Map<String, String> requestBody) {
    String username = requestBody.get("username");

    if (username == null || username.trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    int updatedLikes = postService.likePost(id, username);
    return ResponseEntity.ok(updatedLikes);
}

@PostMapping("/{id}/dislike")
public ResponseEntity<Integer> dislikePost(
        @PathVariable String id,
        @RequestBody Map<String, String> requestBody) {
    String username = requestBody.get("username");

    if (username == null || username.trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    int updatedLikes = postService.dislikePost(id, username);
    return ResponseEntity.ok(updatedLikes);
}

@GetMapping("/{id}/likes")
public ResponseEntity<List<Like>> getLikesForPost(@PathVariable String id) {
    List<Like> likes = postService.getLikesForPost(id);
    return ResponseEntity.ok(likes);
}
@PostMapping("/{id}/comment")
public ResponseEntity<Comment> addComment(
        @PathVariable String id,
        @RequestBody Map<String, String> requestBody) {
    String username = requestBody.get("username");
    String content = requestBody.get("content");
    System.out.println("Username: " + username);
    System.out.println("Content: " + content);
    if (username == null || username.trim().isEmpty() || content == null || content.trim().isEmpty()) {
        return ResponseEntity.badRequest().build(); // Return 400 Bad Request if username or content is missing
    }

    Comment comment = postService.addComment(id, username, content);
    return ResponseEntity.ok(comment);
}

@GetMapping("/{id}/comments")
public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable String id) {
    List<Comment> comments = postService.getCommentsForPost(id);
    return ResponseEntity.ok(comments);
}

@DeleteMapping("/{id}/comment/{commentId}")
public ResponseEntity<Void> deleteComment(
        @PathVariable String id,
        @PathVariable Long commentId,
        @RequestParam String username) { 


    if (username == null || username.trim().isEmpty()) {
        return ResponseEntity.badRequest().build(); // Return 400 Bad Request if username is missing
    }

    boolean deleted = postService.deleteComment(id, commentId, username);
    if (deleted) {
        return ResponseEntity.noContent().build(); // Return 204 No Content if the comment was deleted
    } else {
        return ResponseEntity.status(403).build(); // Return 403 Forbidden if the user is not authorized
    }
}
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        try {
            String content = requestBody.get("content");
            if (content == null || content.trim().isEmpty()) {
                throw new InvalidInputException("Post content cannot be empty.");
            }
            PostDTO updatedPost = postService.updatePost(id, content);
            return ResponseEntity.ok(updatedPost);
        } catch (PostNotFoundException e) {
            logger.error("Post not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (InvalidInputException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
        } catch (Exception e) {
            logger.error("Error updating post: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestParam String username) {
        try {
            if (username == null || username.trim().isEmpty()) {
                throw new InvalidInputException("Username cannot be empty.");
            }
            boolean deleted = postService.deletePost(id, username);
            if (deleted) {
                return ResponseEntity.noContent().build(); // 204 No Content
            } else {
                throw new Exception("Post not found or user not authorized to delete this post.");
            }
        } catch (PostNotFoundException e) {
            logger.error("Post not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage()); // 404 Not Found
        } catch (InvalidInputException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
        } catch (Exception e) {
            logger.error("Error deleting post: {}", e.getMessage());
            return ResponseEntity.status(500).body("An unexpected error occurred."); // 500 Internal Server Error
        }
    }

}