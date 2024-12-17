import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Avatar, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import m from '../images/m.jpg';
import notify from '../images/notify.png';
import logout from '../images/logout.png';
import goal from '../images/goal.png';
import home from '../images/home.png';

// Sample Data
const badges = [
  { name: 'Gold Badge', img: 'https://via.placeholder.com/50' },
  { name: 'Silver Badge', img: 'https://via.placeholder.com/50' },
  { name: 'Bronze Badge', img: 'https://via.placeholder.com/50' },
];

const leaderboardData = [
  { name: 'Alice', points: 1200, avatar: 'https://via.placeholder.com/50' },
  { name: 'Bob', points: 1100, avatar: 'https://via.placeholder.com/50' },
  { name: 'Charlie', points: 1000, avatar: 'https://via.placeholder.com/50' },
];

const Academics = () => {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <div style={{ backgroundColor: '#ffd966' }}>
      <Box
        sx={{
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: '#ffd966',
          padding: 4,
          borderRadius: 2,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <header className="dashboard-header">
          <h2>Academics</h2>
          <div className="header-icons">
            <img src={home} alt="Home Icon" className="header-icon" />
            <img src={notify} alt="Notification Bell" className="header-icon" />
            <img
              src={logout}
              alt="Logout Icon"
              className="header-icon"
              onClick={() => navigate("/logout")} // Navigate to the Logout component
              style={{ cursor: 'pointer' }}
            />
          </div>
        </header>

        {/* Academic Progress Section */}
        <Box textAlign="center" mb={4}>
          <img src={m} alt="Logo" style={{ width: '150px' }} />
          <Typography variant="h4" fontWeight="bold" mt={2}>
            Academic Progress
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track your progress and achievements!
          </Typography>
        </Box>

        {/* Points Section */}
        <Box display="flex" gap={3} mb={5}>
          <Card sx={{ flex: 1, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Progress
              </Typography>
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(to right, #007bff, #00d4ff)',
                    },
                  }}
                />
                <Typography variant="subtitle1" mt={1}>
                  75% Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" style={{ display: 'flex', alignItems: 'center' }}>
                Goals Achieved
                <img
                  src={goal}
                  alt="Logo"
                  style={{
                    width: '90px',
                    height: '80px',
                    marginLeft: '40px',
                    objectFit: 'center',
                  }}
                />
              </Typography>
              <Typography variant="h4" fontWeight="bold" mt={2}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Badges Section */}
        <Box mb={5}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Your Badges
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            {badges.map((badge, index) => (
              <Card key={index} sx={{ textAlign: 'center', padding: 2, boxShadow: 2 }}>
                <Avatar src={badge.img} alt={badge.name} sx={{ width: 60, height: 60, margin: '0 auto' }} />
                <Typography variant="subtitle1" mt={1}>
                  {badge.name}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Leaderboard Section */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Leaderboard
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={user.avatar} alt={user.name} sx={{ width: 35, height: 35, marginRight: 2 }} />
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Academics;
