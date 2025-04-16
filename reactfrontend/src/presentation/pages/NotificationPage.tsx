import React, { useEffect, useState, memo } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";

interface Notification {
  type: string; // "like", "comment", "follow"
  message: string;
  createdAt: string;
}
interface FeedPageProps {
    username: string | null;
}

export const NotificationPage = memo(({ username }: FeedPageProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!username) {
      console.error("Username is required to fetch notifications.");
      return;
    }
  
    fetch(`http://localhost:8090/api/v1/notifications?username=${username}`, {
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
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Card key={index} sx={{ width: "100%", maxWidth: "600px", marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="body1">{notification.message}</Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          No notifications yet.
        </Typography>
      )}
    </Box>
  );
});

export default NotificationPage;