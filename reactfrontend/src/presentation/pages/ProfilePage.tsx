import { Fragment, memo, useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Link as MuiLink } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { useParams, Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // Empty heart icon
import FavoriteIcon from "@mui/icons-material/Favorite"; // Full heart icon
import CommentIcon from "@mui/icons-material/Comment"; // Comment icon
import { is } from "@infrastructure/utils/typeUtils";

interface Post {
    id: number;
    content: string;
    username: string;
}

export const ProfilePage = memo(({ user, setUser }: { user: string | null; setUser: (username: string | null) => void }) => {
    const { id: username } = useParams<{ id: string }>(); // Get the username from the URL
    const [posts, setPosts] = useState<Post[]>([]); // State to hold the posts of the profile
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set()); // State to track liked posts
    const [isFollowing, setIsFollowing] = useState<boolean>(false); // State to track follow/unfollow status
    const [followersCount, setFollowersCount] = useState<number>(0); // State to track followers count
    const [followingCount, setFollowingCount] = useState<number>(0); // State to track following count
    const [error, setError] = useState<string | null>(null); // State to handle errors

    // Fetch posts of the profile being viewed
    useEffect(() => {
        fetch(`http://localhost:8090/api/v1/posts/user/${username}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data); // Assuming API returns an array of posts
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts. Please try again later.");
            });
    }, [username]);

    // Fetch follow status and counts
    useEffect(() => {
        if (user && username) {
            fetch(`http://localhost:8090/api/v1/follow/${username}/status?followerUsername=${user}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch follow status");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsFollowing(data.isFollowing); // API returnează { isFollowing: true/false }
                    setFollowersCount(data.followersCount); // API returnează { followersCount: number }
                    setFollowingCount(data.followingCount); // API returnează { followingCount: number }
                })
                .catch((error) => {
                    console.error("Error fetching follow status:", error);
                });
        }
    }, [user, username]);
    
    useEffect(() => {
        fetch(`http://localhost:8090/api/v1/follow/${username}/followers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch followers");
                }
                return response.json();
            })
            .then((data) => {
                // Check if any followerUsername matches the current user
                const isUserFollowing = data.some((follower: { followerUsername: string }) => follower.followerUsername === user);
                setIsFollowing((prev) => prev || isUserFollowing); // Update isFollowing state
                console.log(isFollowing);
            })
            .catch((error) => {
                console.error("Error fetching followers:", error);
            });
    }, [username, user, isFollowing]);
    

    useEffect(() => {
        fetch(`http://localhost:8090/api/v1/follow/${username}/following`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch following");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Following:", data); // Afișează lista de following
            })
            .catch((error) => {
                console.error("Error fetching following:", error);
            });
    }, [username]);
    // Handle follow/unfollow button click
    const handleFollowToggle = () => {
        const url = `http://localhost:8090/api/v1/follow/${username}`;
        const method = isFollowing ? "DELETE" : "POST"; // DELETE pentru unfollow, POST pentru follow
    
        fetch(`${url}?followerUsername=${user}`, {
            method,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to toggle follow status");
                }
                return response.text(); // Backend-ul returnează un mesaj simplu
            })
            .then(() => {
                setIsFollowing(!isFollowing); // Schimbă statusul follow/unfollow
                setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1)); // Actualizează numărul de followers
            })
            .catch((error) => {
                console.error("Error toggling follow status:", error);
            });
    };
    // Handle like toggle
    const toggleLike = (postId: number) => {
        setLikedPosts((prevLikedPosts) => {
            const updatedLikedPosts = new Set(prevLikedPosts);
            if (updatedLikedPosts.has(postId)) {
                updatedLikedPosts.delete(postId); // Unlike the post
            } else {
                updatedLikedPosts.add(postId); // Like the post
            }
            return updatedLikedPosts;
        });
    };

    return (
        <Fragment>
            <Seo title={`MobyLab Web App | ${username}'s Profile`} />
            <Box sx={{ padding: "20px 50px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Profile Header */}
                <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
                    {/* Profile Name */}
                    <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "left" }}>
                        {username}
                    </Typography>

                    {/* Followers/Following and Follow Button */}
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                            <strong>{followersCount}</strong> Followers
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                            <strong>{followingCount}</strong> Following
                        </Typography>
                        {user && user !== username && (
                            <Button
                                variant="contained"
                                color={isFollowing ? "secondary" : "primary"}
                                onClick={handleFollowToggle}
                                sx={{ marginTop: "10px" }}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Error Message */}
                {error && (
                    <Typography color="error" sx={{ textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                {/* Display Posts */}
                {posts.length === 0 && (
                    <Typography variant="body1" sx={{ textAlign: "center", marginTop: "20px" }}>
                        No posts available.
                    </Typography>
                )}
                        {posts.map((post) => (
                    <Card key={post.id} sx={{ width: "800px", margin: "0 auto" }}>
                        <CardContent>
                            {/* Link to User's Profile */}
                            <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
                                <strong>Created By: </strong>
                                <MuiLink
                                    component={Link}
                                    to={`/profile/${post.username}`} // Link to the user's profile
                                    underline="hover"
                                    color="primary"
                                >
                                    {post.username}
                                </MuiLink>
                            </Typography>

                            {/* Link to Post Details */}
                            <Typography
                                component={Link}
                                to={`/posts/${post.id}`} // Link to the post details page
                                variant="body1"
                                sx={{
                                    border: "1px solid #ddd", // Light gray border
                                    borderRadius: "8px", // Rounded corners
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                    padding: "16px", // Inner padding
                                    backgroundColor: "#fff", // White background
                                    textDecoration: "none", // Remove underline
                                    color: "inherit", // Inherit text color
                                    display: "block", // Make the entire area clickable
                                }}
                            >
                                {post.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Fragment>
    );
});