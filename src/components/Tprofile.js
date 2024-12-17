import React, { useEffect, useState } from "react";
import { Avatar, Typography, Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import axios from "axios";

const Tprofile = () => {
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTutor, setUpdatedTutor] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gender: "",
    designation: "",
    college: "",
    parentContact: "",
    graduationYear: "",
    dob: "",
  });

  useEffect(() => {
    const tutorId = localStorage.getItem("loggedInTutorId");

    if (tutorId) {
      axios
        .get(`http://localhost:5000/tutors/${tutorId}`)
        .then((response) => {
          setTutor(response.data);
          setUpdatedTutor(response.data); // Set initial state for editing
        })
        .catch((error) => {
          setError("Error fetching tutor details. Please try again.");
          console.error("Error fetching tutor details:", error);
        });
    } else {
      setError("No tutor ID found in localStorage. Please log in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTutor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const tutorId = localStorage.getItem("loggedInTutorId");

    axios
      .put(`http://localhost:5000/tutors/${tutorId}`, updatedTutor)
      .then(() => {
        setTutor(updatedTutor); // Update UI with the updated data
        setIsEditing(false); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating tutor details:", error);
      });
  };

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!tutor) {
    return <Typography>Loading...</Typography>;
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
      <Box
        sx={{
          backgroundColor: "#f5c41c",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          My Profile
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              fontSize: "32px",
              backgroundColor: "#f5c41c",
            }}
          >
            {tutor.name ? tutor.name[0] : "-"}
          </Avatar>
          {isEditing ? (
            <TextField
              name="name"
              label="Name"
              value={updatedTutor.name}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
              {tutor.name || "-"}
            </Typography>
          )}
          {isEditing ? (
            <TextField
              name="email"
              label="Email"
              value={updatedTutor.email}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {tutor.email || "-"}
            </Typography>
          )}
        </Box>

        {isEditing ? (
          <TextField
            name="contact"
            label="Contact"
            value={updatedTutor.contact}
            onChange={handleChange}
            fullWidth
            sx={{ marginTop: 2 }}
          />
        ) : (
          <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
            <Grid item>
              <PhoneIcon color="action" />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {tutor.contact || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        {isEditing ? (
          <TextField
            name="address"
            label="Address"
            value={updatedTutor.address}
            onChange={handleChange}
            fullWidth
            sx={{ marginTop: 2 }}
          />
        ) : (
          <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
            <Grid item>
              <LocationOnIcon color="action" />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {tutor.address || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        {isEditing ? (
          <TextField
            name="designation"
            label="Designation"
            value={updatedTutor.designation}
            onChange={handleChange}
            fullWidth
            sx={{ marginTop: 2 }}
          />
        ) : (
          <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
            <Grid item>
              <SchoolIcon color="action" />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {tutor.designation || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        {isEditing ? (
          <>
            <TextField
              name="college"
              label="College"
              value={updatedTutor.college}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              name="graduationYear"
              label="Graduation Year"
              value={updatedTutor.graduationYear}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              name="parentContact"
              label="Parent Contact"
              value={updatedTutor.parentContact}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              name="dob"
              label="Date of Birth"
              value={updatedTutor.dob}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
          </>
        ) : (
          <>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              College: {tutor.college || "-"}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              Graduation Year: {tutor.graduationYear || "-"}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              Parent Contact: {tutor.parentContact || "-"}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              Date of Birth: {tutor.dob || "-"}
            </Typography>
          </>
        )}

        <Box sx={{ textAlign: "center", marginTop: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f5c41c",
              "&:hover": { backgroundColor: "#ffd966" },
            }}
            onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          >
            {isEditing ? "Save Changes" : "Update your profile"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#f5c41c",
          color: "white",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">© 2024 Your App Name</Typography>
      </Box>
    </Box>
  );
};

export default Tprofile;
