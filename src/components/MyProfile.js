import React, { useEffect, useState } from "react";
import { Avatar, Typography, Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import axios from "axios";
 const backendURL = "https://json-server-backend-6y18.onrender.com";
  
const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    address: "",
    contact: "",
    class: "",
    familyDetails: {
      fatherName: "",
      motherName: "",
      guardianContact: "",
    },
  });

  useEffect(() => {
    const studentId = localStorage.getItem("loggedInStudentId");

    if (studentId) {
      axios
        .get(`${backendURL}/students/${studentId}`)
        .then((response) => {
          setStudent(response.data);
          setUpdatedStudent(response.data);  // Set initial state for editing
        })
        .catch((error) => {
          setError("Error fetching student details. Please try again.");
          console.error("Error fetching student details:", error);
        });
    } else {
      setError("No student ID found in localStorage. Please log in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prevState) => ({
      ...prevState,
      familyDetails: {
        ...prevState.familyDetails,
        [name]: value,
      },
    }));
  };

  const handleUpdate = () => {
    const studentId = localStorage.getItem("loggedInStudentId");

    axios
      .put(`${backendURL}/students/${studentId}`, updatedStudent)
      .then((response) => {
        setStudent(updatedStudent); // Update UI with the updated data
        setIsEditing(false); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating student details:", error);
      });
  };

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!student) {
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
            {student.name ? student.name[0] : "-"}
          </Avatar>
          {isEditing ? (
            <TextField
              name="name"
              label="Name"
              value={updatedStudent.name}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
              {student.name || "-"}
            </Typography>
          )}
          {isEditing ? (
            <TextField
              name="email"
              label="Email"
              value={updatedStudent.email}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {student.email || "-"}
            </Typography>
          )}
          {isEditing ? (
            <TextField
              name="age"
              label="Age"
              type="number"
              value={updatedStudent.age}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {student.age ? `${student.age} years` : "-"}
            </Typography>
          )}
          {isEditing ? (
            <TextField
              name="gender"
              label="Gender"
              value={updatedStudent.gender}
              onChange={handleChange}
              fullWidth
              sx={{ marginTop: 1 }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {student.gender || "-"}
            </Typography>
          )}
        </Box>

        {isEditing ? (
          <TextField
            name="address"
            label="Address"
            value={updatedStudent.address}
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
                {student.address || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        {isEditing ? (
          <TextField
            name="contact"
            label="Contact"
            value={updatedStudent.contact}
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
                {student.contact || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        {isEditing ? (
          <TextField
            name="class"
            label="Class"
            value={updatedStudent.class}
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
                {student.class || "-"}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 3 }}>
          Family Details
        </Typography>
        <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
          <Grid item>
            {isEditing ? (
              <TextField
                name="fatherName"
                label="Father's Name"
                value={updatedStudent.familyDetails.fatherName}
                onChange={handleFamilyChange}
                fullWidth
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Father: {student.familyDetails?.fatherName || "-"}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
          <Grid item>
            {isEditing ? (
              <TextField
                name="motherName"
                label="Mother's Name"
                value={updatedStudent.familyDetails.motherName}
                onChange={handleFamilyChange}
                fullWidth
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Mother: {student.familyDetails?.motherName || "-"}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
          <Grid item>
            {isEditing ? (
              <TextField
                name="guardianContact"
                label="Guardian Contact"
                value={updatedStudent.familyDetails.guardianContact}
                onChange={handleFamilyChange}
                fullWidth
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Guardian Contact: {student.familyDetails?.guardianContact || "-"}
              </Typography>
            )}
          </Grid>
        </Grid>

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

export default MyProfile;
