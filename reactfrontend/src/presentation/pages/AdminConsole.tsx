import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, CircularProgress, Box, Card, CardContent, Grid } from "@mui/material";

export const AdminConsole: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8090/api/v1/role/dashboard", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const data = await response.json();
            console.log("Fetched dashboard data:", data); // Log the fetched data
            setPosts(data.posts || []); // Set posts from the response
            setUsers(data.users || []); // Set users from the response
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Admin Console
            </Typography>
            <Typography variant="h6" gutterBottom>
                Manage Posts and Users
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={4}>
                    {/* Posts Section */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            Posts
                        </Typography>
                        <List>
                            {posts.map((post) => (
                                <Card
                                    key={post.id}
                                    sx={{
                                        marginBottom: "10px",
                                        boxShadow: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1" gutterBottom>
                                            {post.content}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Author: {post.username} | Created At: {post.createdAt} | Likes: {post.likes}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
                    </Grid>

                    {/* Users Section */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            Users
                        </Typography>
                        <List>
                            {users.map((user) => (
                                <Card
                                    key={user.id}
                                    sx={{
                                        marginBottom: "10px",
                                        boxShadow: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1" gutterBottom>
                                            {user.username || "No Username"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Email: {user.email}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};