import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import axios from "axios";
const backendURL = "https://json-server-backend-6y18.onrender.com";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const studentId = localStorage.getItem("loggedInStudentId"); // Get logged-in student's ID

  // Fetch tutors from db.json
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`${backendURL}/tutors`);
        setTutors(response.data);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      }
    };
    fetchTutors();
  }, []);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleTutorChange = (event) => {
    setSelectedTutor(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setError("Please enter your feedback.");
      return;
    }
    if (!selectedTutor) {
      setError("Please select a tutor.");
      return;
    }
    try {
      // Sending feedback to backend (replace with actual API endpoint)
      await axios.post(`${backendURL}/feedback`, {
        studentId,
        tutorId: selectedTutor,
        feedback,
        timestamp: new Date().toISOString(),
      });
      setSuccess(true);
      setError(null);
      setFeedback(""); // Clear feedback input after successful submission
      setSelectedTutor(""); // Clear selected tutor
    } catch (err) {
      setError("Error submitting feedback. Please try again.");
      console.error("Error submitting feedback:", err);
    }
  };

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
          Feedback
        </Typography>
      </Box>

      {/* Feedback Form */}
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {success && (
          <Typography variant="body1" color="primary" align="center" sx={{ marginBottom: "20px" }}>
            Thank you for your feedback!
          </Typography>
        )}
        {error && (
          <Typography variant="body1" color="error" align="center" sx={{ marginBottom: "20px" }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Avatar
            sx={{
              backgroundColor: "#f5c41c",
            }}
          >
            <FeedbackIcon />
          </Avatar>
          <Typography variant="h6" sx={{ marginLeft: "10px" }}>
            Share Your Feedback
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <InputLabel>Select Tutor</InputLabel>
          <Select
            value={selectedTutor}
            onChange={handleTutorChange}
            label="Select Tutor"
          >
            {tutors.map((tutor) => (
              <MenuItem key={tutor.id} value={tutor.id}>
                {tutor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Your Feedback"
          multiline
          rows={6}
          variant="outlined"
          fullWidth
          value={feedback}
          onChange={handleFeedbackChange}
          sx={{ marginBottom: "20px" }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            color="primary"
            sx={{ padding: "10px 20px" }}
          >
            Submit Feedback
          </Button>
        </Box>
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
          onClick={() => setFeedback("")} // Clear the feedback input field
        >
          Clear Feedback
        </Button>
      </Box>
    </Box>
  );
};

export default FeedbackPage;
