import React, { useCallback, useEffect, useRef, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import FeedIcon from "@mui/icons-material/DynamicFeed";
import ProfileIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotebookIcon from "@mui/icons-material/Note";
import { Link } from "react-router-dom";
import { AppRoute } from "routes";
import { useIntl } from "react-intl";
import { useAppDispatch, useAppSelector } from "@application/store";
import { IconButton, Typography, TextField, List, ListItem, ListItemText } from "@mui/material";
import { resetProfile } from "@application/state-slices";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { UserRoleEnum } from "@infrastructure/apis/client";

// Define the NavbarProps interface
interface NavbarProps {
    user: any; // Replace 'any' with the appropriate type for 'user'
    setUser: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the appropriate type for 'setUser'
}

export const Navbar: React.FC<NavbarProps> = ({ user, setUser = () => {} }) => {
    const { formatMessage } = useIntl();
    const { loggedIn } = useAppSelector((x) => x.profileReducer);
    const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);
    const dispatch = useAppDispatch();
    const { redirectToHome } = useAppRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const logout = useCallback(() => {
        dispatch(resetProfile());
        redirectToHome();
    }, [dispatch, redirectToHome]);
    const searchRef = useRef<HTMLDivElement>(null); // Reference for the search list
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false); // Track if the search list is open

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode the token
                const decodedToken: any = jwtDecode(token);

                // Extract email (sub) from the token
                const email = decodedToken.sub;

                // Make a GET request using the email
                fetch(`http://localhost:8090/api/v1/me?email=${email}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch user details");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setUsername(data.username); // Assuming the API returns { username: "JohnDoe" }
                        setUser(data.username); // Set the username in the state
                    })
                    .catch((error) => {
                        console.error("Error fetching user details:", error);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false); // Close the search list
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 3) {
            fetch(`http://localhost:8090/api/v1/users/search?query=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch search results");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSearchResults(data);
                    setIsSearchOpen(true); // Open the search list
                })
                .catch((error) => {
                    console.error("Error fetching search results:", error);
                });
        } else {
            setSearchResults([]);
            setIsSearchOpen(false); // Close the search list
        }
    };



    return (
        <>
            <div className="w-full top-0 z-50 fixed">
                <AppBar>
                    <Toolbar>
                        <div className="grid grid-cols-12 gap-y-5 gap-x-10 justify-center items-center">
                            <div className="col-span-1">
                                <Link to={AppRoute.Index}>
                                    <IconButton>
                                        <HomeIcon style={{ color: "white" }} fontSize="large" />
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="col-span-2">
                                {loggedIn && (
                                    <div className="flex flex-row gap-x-10">
                                        {/* Feed Button */}
                                        <Button color="inherit">
                                            <Link
                                                style={{ color: "white", display: "flex", alignItems: "center" }}
                                                to={AppRoute.Feed}
                                            >
                                                <FeedIcon style={{ marginRight: "8px" }} />
                                                Feed
                                            </Link>
                                        </Button>

                                        {/* Profile Button */}
                                        <Button color="inherit">
                                            <Link
                                                style={{ color: "white", display: "flex", alignItems: "center" }}
                                                to={AppRoute.Profile.replace(":id", username || "")}
                                            >
                                                <ProfileIcon style={{ marginRight: "8px" }} />
                                                Profile
                                            </Link>
                                        </Button>

                                        {/* Notifications Button */}
                                        <Button color="inherit">
                                            <Link
                                                style={{
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "60px",
                                                }}
                                                to={AppRoute.Notifications}
                                            >
                                                <NotificationsIcon />
                                                Notifications
                                            </Link>
                                        </Button>

                                        <Button color="inherit">
                                            <Link
                                                style={{
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "110px",
                                                }}
                                                to='/Feedback'
                                            >
                                                <NotebookIcon style={{ marginRight: "8px" }} />
                                                Feedback
                                            </Link>
                                        </Button>
                                        <div className="col-span-6" ref={searchRef}>
    <TextField
        placeholder="Search users..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        style={{ backgroundColor: "white", borderRadius: "4px", marginLeft: "150px" }}
    />
    {isSearchOpen && searchResults.length > 0 && (
        <List
            sx={{
                position: "absolute",
                zIndex: 1300,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
                mt: 1,
                ml: 18,
                color: "black",
                width: "300px",
                maxHeight: 300,
                overflowY: "auto",
            }}
        >
            {searchResults.map((user) => (
                <ListItem
                    key={user.username}
                    disablePadding
                    sx={{
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    <Link
                        to={`/profile/${user.username}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                            padding: "12px 16px",
                            display: "block",
                        }}
                    >
                        <ListItemText primary={user.username} />
                    </Link>
                </ListItem>
            ))}
        </List>
    )}
</div>
                                    </div>
                                )}
                            </div>

                            <div className="-col-end-1 col-span-1 -ml-40     flex items-center gap-x-10">
                            {isAdmin && (
                                        <Button color="inherit" style={{ marginLeft: "-50px" }}>
                                            <Link style={{ color: "white"}} to={'/Dashboard'}>
                                                Dashboard
                                            </Link>
                                        </Button>
                                    )}
                                {loggedIn && username && (
                                    <Typography style={{ color: "white", marginRight: "16px" }}>
                                        Logged in as: {isAdmin ? "Admin" : username}
                                    </Typography>)}
                                    
                                    
                                
                                {!loggedIn ? (
                                    <>
                                        <Button color="inherit">
                                            <Link style={{ color: "white" }} to={AppRoute.Login}>
                                                Login
                                            </Link>
                                        </Button>
                                        <Button color="inherit">
                                            <Link style={{ color: "white" }} to={AppRoute.Register}>
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <Button color="inherit" onClick={logout}>
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="h-24" 
            
            ></div> {/* Spacer for the fixed navbar */}
            
        </>
    );
};