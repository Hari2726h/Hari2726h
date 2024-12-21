import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const backendURL = "https://json-server-backend-6y18.onrender.com";
 
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const studentId = localStorage.getItem("loggedInStudentId");  // Get logged-in student's ID

  useEffect(() => {
    // Fetch notifications from the backend (db.json file)
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backendURL}/notifications`);
        // Filter notifications for the logged-in student based on studentId
        const filteredNotifications = response.data.filter(
          (notification) => notification.studentId === studentId
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        setError("Error fetching notifications. Please try again.");
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [studentId]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDeleteNotification = async (id) => {
    try {
      // Send DELETE request to the backend
      await axios.delete(` ${backendURL}/notifications/${id}`);
      // Update the state to remove the deleted notification
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (err) {
      setError("Error deleting notification. Please try again.");
      console.error("Error deleting notification:", err);
    }
  };
  

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#f5c41c",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Notifications
        </Typography>
      </Box>

      {/* Notifications List */}
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {notifications.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            No new notifications.
          </Typography>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  backgroundColor: notification.read ? "#e0e0e0" : "white",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: "#f5c41c",
                    }}
                  >
                    <NotificationsActiveIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    onClick={() => handleMarkAsRead(notification.id)}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginRight: "8px" }}
                  >
                    Mark as Read
                  </Button>
                  <IconButton
                    onClick={() => handleDeleteNotification(notification.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          backgroundColor: "#f5c41c",
          color: "white",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f5c41c",
            "&:hover": { backgroundColor: "#ffd966" },
          }}
          onClick={handleClearNotifications}
          disabled={notifications.length === 0}
        >
          Clear All Notifications
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationPage;
