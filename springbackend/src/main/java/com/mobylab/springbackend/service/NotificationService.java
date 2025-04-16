package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.Comment;
import com.mobylab.springbackend.entity.Follower;
import com.mobylab.springbackend.entity.Like;
import com.mobylab.springbackend.repository.CommentRepository;
import com.mobylab.springbackend.repository.FollowerRepository;
import com.mobylab.springbackend.repository.LikeRepository;
import com.mobylab.springbackend.repository.PostRepository;
import com.mobylab.springbackend.service.dto.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import com.mobylab.springbackend.entity.Post;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowerRepository followerRepository;
    private final PostRepository postRepository;

    @Autowired
    public NotificationService(LikeRepository likeRepository, CommentRepository commentRepository,
                               FollowerRepository followerRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.followerRepository = followerRepository;
        this.postRepository = postRepository;
    }
public List<NotificationDTO> getNotificationsForUser(String username) {
    List<NotificationDTO> notifications = new ArrayList<>();

    // Get all posts by the user
    List<Post> userPosts = postRepository.findByUsername(username);
    List<UUID> userPostIds = new ArrayList<>();
    for (Post post : userPosts) {
        userPostIds.add(post.getId()); // Extract the UUID of each post
    }
    // Get likes for the user's posts

    List<Like> likes = new ArrayList<>();
    for (UUID postId : userPostIds) {
        likes.addAll(likeRepository.findByPostId(postId)); // Fetch likes for each post ID
    }
    for (Like like : likes) {
        notifications.add(new NotificationDTO(
                "like",
                "User " + like.getUsername() + " liked your post.",
                like.getCreatedAt()
        ));
    }

    // Get comments for the user's posts
    List<Comment> comments = new ArrayList<>();
    for (UUID postId : userPostIds) {
        comments.addAll(commentRepository.findByPostId(postId)); // Fetch comments for each post ID
    }
    for (Comment comment : comments) {
        notifications.add(new NotificationDTO(
                "comment",
                "User " + comment.getUsername() + " commented on your post: '" + comment.getContent() + "'",
                comment.getCreatedAt()
        ));
    }

    // Get followers for the user
    List<Follower> followers = followerRepository.findByFollower_Username(username);
    for (Follower follower : followers) {
        notifications.add(new NotificationDTO(
                "follow",
                "User " + follower.getFollower().getUsername() + " started following you.",
                LocalDateTime.now()
        ));
    }

    return notifications;
}
}