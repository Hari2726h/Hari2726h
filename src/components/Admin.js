import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logout from '../images/logout.png';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CardContent,
  Card,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Box,
  Avatar,
  Button,
} from '@mui/material';
import { Home, Notifications, Settings, Person, QuestionMark } from '@mui/icons-material';
import m from '../images/m.jpg';

// MenuItem component with navigation
const MenuItem = ({ icon, label, route }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(route)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#ffe4b3',
        },
        marginBottom: '8px',
      }}
    >
      <IconButton size="small" sx={{ marginRight: '8px' }}>
        {icon}
      </IconButton>
      <Typography variant="body1">{label}</Typography>
    </Box>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    // Fetch marks data from db.json
    fetch('http://localhost:5000/marks')
      .then((response) => response.json())
      .then((data) => setMarks(data))
      .catch((error) => console.error('Error fetching marks data:', error));

    // Prevent default back navigation behavior
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/logout");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', sm: 240 },
          backgroundColor: '#ffd966',
          padding: 2,
          height: '100vh',
          overflowY: 'auto',
          position: { xs: 'relative', sm: 'sticky' },
          top: 0,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          <img
            src={m}
            alt="Logo"
            style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain', paddingLeft: '0px' }}
          />
        </Typography>
        <Box style={{ paddingRight: '100px' }}>
          <MenuItem icon={<Home />} label="Dashboard" route="/" />
          <MenuItem icon={<Person />} label="Student Management" route="/admin1" />
          <MenuItem icon={<Person />} label="Tutor Management" route="/tutor-management" />
          <MenuItem icon={<Person />} label="Partner Institution" route="/partner-institution" />
          <MenuItem icon={<Settings />} label="Academic Performance" route="/academic-performance" />
          <MenuItem icon={<Settings />} label="Contact" route="/contact" />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Typography>
              <IconButton>
                <Notifications />
                <Avatar />
                <img
                  src={logout}
                  alt="Logout Icon"
                  className="header-icon"
                  onClick={() => navigate("/logout")}
                  style={{
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </IconButton>
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Top Cards */}
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#ffe4e1', minHeight: '150px' }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>Total Students</Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>1200</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e1ffe4', minHeight: '150px' }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>Total Tutors</Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>300</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e4e1ff', minHeight: '150px' }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>Mentors</Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>50</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Database Section */}
        <Box sx={{ marginTop: 3 }}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Database</Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Pass/Fail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {marks.map((mark) => (
    <TableRow key={mark.id}>
      <TableCell>{mark.name}</TableCell> {/* Corrected key */}
      <TableCell>{mark.marks}/100</TableCell>
      <TableCell>12/12/2023 10 PM</TableCell>
      <TableCell>
        {mark.marks >= 85 ? 'Excellent' : mark.marks >= 60 ? 'Good' : 'Poor'}
      </TableCell>
      <TableCell>{mark.marks >= 50 ? 'Pass' : 'Fail'}</TableCell>
    </TableRow>
  ))}
</TableBody>


              </Table>
            </TableContainer>
          </Paper>
        </Box>
           {/* Bottom Cards */}
           <Grid container spacing={3} sx={{ marginTop: 3 }}>
  <Grid item xs={12} sm={3}>
    <Card sx={{ backgroundColor: '#ffe4e1', textAlign: 'center', minHeight: { xs: '120px', sm: '150px' } }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.2rem' } // Adjust font size for smaller screens
          }}
        >
          Our Programs
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={3}>
    <Card sx={{ backgroundColor: '#e1ffe4', textAlign: 'center', minHeight: { xs: '120px', sm: '150px' } }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.2rem' } // Adjust font size for smaller screens
          }}
        >
          Timetable
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={3}>
    <Card sx={{ backgroundColor: '#e4e1ff', textAlign: 'center', minHeight: { xs: '120px', sm: '150px' } }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.2rem' } // Adjust font size for smaller screens
          }}
        >
          Upcoming Meeting
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={3}>
    <Card sx={{ backgroundColor: '#fff4e1', textAlign: 'center', minHeight: { xs: '120px', sm: '150px' } }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.2rem' } // Adjust font size for smaller screens
          }}
        >
          Support
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>


      </Box>
    </Box>
  );
};

export default Admin;
