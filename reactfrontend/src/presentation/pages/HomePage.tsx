import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Button, Grid, Box } from "@mui/material";
import { Fragment, memo } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { Link } from "react-router-dom";

export const HomePage = memo(() => {
    return (
        <Fragment>
            <Seo title="Welcome to SocialConnect" />
            <WebsiteLayout user={null} setUser={() => {}}>
                <Box
                    sx={{
                        textAlign: "center",
                        padding: "50px",
                        minHeight: "100vh",
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Welcome to <span style={{ color: "#1976d2" }}>SocialConnect</span>
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Connect with friends, share your moments, and explore the world.
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "30px" }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                component={Link}
                                to=""
                            >
                                Get Started
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                component={Link}
                                to=""
                            >
                                Log In
                            </Button>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            marginTop: "50px",
                            padding: "20px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            maxWidth: "800px",
                            margin: "50px auto",
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Why Join SocialConnect?
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            - Share your favorite moments with friends and family.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            - Discover new connections and communities.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            - Stay updated with the latest trends and news.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            - Enjoy a secure and user-friendly platform.
                        </Typography>
                    </Box>
                </Box>
            </WebsiteLayout>
        </Fragment>
    );
});