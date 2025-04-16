import { Fragment, memo, useState, useEffect, useCallback, useRef } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink, CircularProgress } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { Link } from "react-router-dom";

interface Post {
    id: number;
    content: string;
    username: string;
}

interface FeedPageProps {
    username: string | null;
}

export const FeedPage = memo(({ username }: FeedPageProps) => {
    const [newPost, setNewPost] = useState<string>("");
    const [postList, setPostList] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0); // Current page
    const [hasMore, setHasMore] = useState<boolean>(true); // Whether there are more posts to load

    const pageRef = useRef(0);
const loadingRef = useRef(false);

const fetchPosts = useCallback(() => {
    if (!hasMore || loadingRef.current) return;
    if (!username) {
        return;
    }

    setLoading(true);
    loadingRef.current = true;

    fetch(`http://localhost:8090/api/v1/posts/getPosts?username=${username}&page=${pageRef.current}&size=10`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length < 10) {
                setHasMore(false);
            }
            setPostList((prevPosts) => [...prevPosts, ...data]);
            pageRef.current += 1; // Increment the ref
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
            setError("Failed to load posts. Please try again later.");
        })
        .finally(() => {
            setLoading(false);
            loadingRef.current = false;
        });
}, [hasMore, username]);

    useEffect(() => {
        fetchPosts(); // Fetch the first page of posts on component mount
    }, [fetchPosts]);

    const handleScroll = useCallback(() => {
        // Check if the user has scrolled near the bottom of the page
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {

            fetchPosts(); // Fetch the next page of posts
        }
    }, [fetchPosts]);

    useEffect(() => {
        if (hasMore) {
            window.addEventListener("scroll", handleScroll); // Attach scroll event listener
        }
    
        return () => {
            if (hasMore) {
                // window.removeEventListener("scroll", handleScroll); // Cleanup on unmount or when there are no more posts
            }
        };
    }, [handleScroll, hasMore]);

    const handlePostSubmit = () => {
        if (!newPost.trim()) {
            alert("Post cannot be empty!");
            return;
        }

        if (!username) {
            alert("You must be logged in to create a post!");
            return;
        }

        fetch("http://localhost:8090/api/v1/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                content: newPost,
                username: username,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create post");
                }
                return response.json();
            })
            .then((data) => {
                setPostList((prevPosts) => [
                    { id: data.id, content: data.content, username: data.username },
                    ...prevPosts,
                ]);
                setNewPost("");
            })
            .catch((error) => {
                console.error("Error creating post:", error);
                setError("Failed to create post. Please try again.");
            });
    };

    return (
        <Fragment>
            <Seo title="MobyLab Web App | Feed" />
            <Box sx={{ padding: "20px 50px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card sx={{ width: "700px", margin: "0 auto", padding: "16px" }}>
                    <TextField
                        fullWidth
                        placeholder="What's on your mind?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: "10px" }}
                        onClick={handlePostSubmit}
                    >
                        Post
                    </Button>
                </Card>

                {error && (
                    <Typography color="error" sx={{ textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                {postList.map((post, index) => (
                    <Card key={`${post.id}-${index}`} sx={{ width: "800px", margin: "0 auto" }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
                                <strong>Created By: </strong>
                                <MuiLink
                                    component={Link}
                                    to={`/profile/${post.username}`}
                                    underline="hover"
                                    color="primary"
                                >
                                    {post.username}
                                </MuiLink>
                            </Typography>
                            <Typography
                                component={Link}
                                to={`/posts/${post.id}`}
                                variant="body1"
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                    padding: "16px",
                                    backgroundColor: "#fff",
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "block",
                                }}
                            >
                                {post.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </Fragment>
    );
});