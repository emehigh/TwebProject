import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // Empty heart icon
import FavoriteIcon from "@mui/icons-material/Favorite"; // Full heart icon
import CommentIcon from "@mui/icons-material/Comment"; // Comment icon
import { memo } from "react";
import { set } from "lodash";
// Define the interface for the post data
interface Post {
  title: string;
  content: string;
  likes: number;
  username: string; // Assuming the API returns username with the post
  comments: { id: string; username: string; content: string }[];
}

interface FeedPageProps {
    username: string | null;
}

export const PostPage = memo(({ username }: FeedPageProps) => {
  const { id } = useParams<{ id: string }>(); // Get the post ID from the URL
  const [post, setPost] = useState<Post | null>(null); // State for the post details
  const [likes, setLikes] = useState<number>(0); // State for likes
  const [likedByUser, setLikedByUser] = useState<boolean>(false); // State to track if the user liked the post
  const [comments, setComments] = useState<{ id: string; username: string; content: string }[]>([]); // State for comments
  const [newComment, setNewComment] = useState<string>(""); // State for the new comment

  // Fetch post details when the component loads
  useEffect(() => {
    if (id) {
      // Fetch post details
      fetch(`http://localhost:8090/api/v1/posts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: Post) => {
          setPost(data);
          setLikes(data.likes);
          setComments(data.comments || []);
  
          // Fetch likes for the post
          fetch(`http://localhost:8090/api/v1/posts/${id}/likes`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((likesData) => {
              // Check if the current user has liked the post
              const userLiked = likesData.some((like: { username: string }) => like.username === username);
              setLikes(likesData.length); // Update the likes count
              setLikedByUser(userLiked);
            })
            .catch((error) => {
              console.error("Error fetching likes:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
        });
        
        fetch(`http://localhost:8090/api/v1/posts/${id}/comments`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((commentsData) => {
              console.log(commentsData);
              setComments(commentsData);
            });
        

    }
  }, [id, username]);
  
  const handleLike = () => {
    const endpoint = likedByUser
      ? `http://localhost:8090/api/v1/posts/${id}/dislike`
      : `http://localhost:8090/api/v1/posts/${id}/like`;
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username }), // Folosește username din props
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Actualizează starea like-urilor
        setLikedByUser(!likedByUser);
        setLikes((prevLikes) => (likedByUser ? prevLikes - 1 : prevLikes + 1));
      })
      .catch((error) => {
        console.error("Error toggling like:", error);
      });
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      if (!username) {
        console.error("Username is required to add a comment.");
        return;
      }
  
      fetch(`http://localhost:8090/api/v1/posts/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment, username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse the response body as JSON
        })
        .then((data) => {
          console.log("Response body:", data); // Print the parsed response body
          setComments((prevComments) => [
            { id: data.id, username, content: newComment },
            ...prevComments,
          ]);
          setNewComment(""); // Clear the input field
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
        });
    }
  };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null); // State for the comment to delete

  const openDeleteModal = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State for edit modal visibility
  const [updatedContent, setUpdatedContent] = useState<string>(post?.content || ""); // State for updated content

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUpdatedContent(post?.content || ""); // Reset content
  };

const handleDeleteComment = (commentId: string) => {
  fetch(`http://localhost:8090/api/v1/posts/${id}/comment/${commentId}?username=${username}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      console.log(id);
      console.log(commentId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Remove the comment from the state
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      closeDeleteModal(); 
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
    });
};

const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState<boolean>(false); // State for post delete modal

const openDeletePostModal = () => {
  setIsDeletePostModalOpen(true);
};

const closeDeletePostModal = () => {
  setIsDeletePostModalOpen(false);
};

const handleDeletePost = () => {
  fetch(`http://localhost:8090/api/v1/posts/${id}?username=${username}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Redirect or update UI after post deletion
      closeDeletePostModal(); // Close the modal after deletion
      window.location.href = "/feed"; // Redirect to the feed page
      // add a success message
      alert("Post deleted successfully!");

    })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
};
  
  const handleUpdatePost = (updatedContent: string) => {
    fetch(`http://localhost:8090/api/v1/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: updatedContent }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedPost) => {
        setPost(updatedPost); // Update the post in the UI
        console.log("Post updated successfully");
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  return (
    <Box sx={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      {post ? (
        <Card sx={{ width: "800px" }}>
          <CardContent>
            {/* Post Title */}
            <strong>Created by: </strong>
            {post.username}
            <Typography variant="h5" sx={{ marginBottom: "16px" }}>
              {post.title}
            </Typography>

            {/* Post Content */}
            <Typography
              variant="body1"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                backgroundColor: "#fff",
                marginBottom: "16px",
              }}
            >
              {post.content}
            </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "16px" }}>
              {post.username === username && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setIsEditModalOpen(true)} // Open the edit modal
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={openDeletePostModal} // Delete the post
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>

            <Dialog open={isEditModalOpen} onClose={closeEditModal}>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogContent sx={{ width: "500px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeEditModal} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleUpdatePost(updatedContent);
                    closeEditModal();
                  }}
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={isDeletePostModalOpen} onClose={closeDeletePostModal}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this post? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDeletePostModal} color="primary">
      Cancel
    </Button>
    <Button onClick={handleDeletePost} color="error">
      Delete
    </Button>
  </DialogActions>
</Dialog>

            {/* Like and Comment Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <Button
                variant="outlined"
                startIcon={likedByUser ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                onClick={handleLike}
              >
                {likedByUser ? "Unlike" : "Like"} ({likes})
              </Button>
            </Box>

            {/* Comments Section */}
            <Typography variant="h6" sx={{ marginBottom: "8px" }}>
              Comments
            </Typography>
            <Box sx={{ marginBottom: "16px" }}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "8px",
                      marginBottom: "8px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{comment.username}:</strong> {comment.content}
                    </Typography>
                    {comment.username === username && (
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => openDeleteModal(comment.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No comments yet.
                </Typography>
              )}
            </Box>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                sx={{ marginBottom: "8px" }}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Typography>Loading post...</Typography>
      )}
          {/* Delete Confirmation Modal */}
        <Dialog open={isModalOpen} onClose={closeDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default PostPage;