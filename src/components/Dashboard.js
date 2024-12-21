import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import oip from '../images/m.jpg';
import att from '../images/att.png';
import per from '../images/per.png';
import home from '../images/home.png';
import profile from '../images/profile.png';
import edu from '../images/edu.png';
import achi from '../images/achi.png';
import time from '../images/time.png';
import notify from '../images/notify.png';
import logout from '../images/logout.png';
import NotificationPage from "./NotificationPage";
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Push a state to prevent the default back navigation behavior
    window.history.pushState(null, "", window.location.href);

    // Block back navigation and navigate to the Logout page
    const handlePopState = (event) => {
      event.preventDefault(); // Prevent the default behavior of the back button
      navigate("/logout"); // Redirect to the logout page
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={oip} alt="Logo" className="sidebar-logo" />
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")} className="sidebar-item">
            <img src={home} alt="Home Icon" className="sidebar-icon" />
            Dashboard
          </li>
          <li
  onClick={() => {
    const loggedInStudentId = localStorage.getItem("loggedInStudentId");
    if (loggedInStudentId) {
      navigate(`/profile/${loggedInStudentId}`);
    } else {
      alert("User not logged in");
    }
  }}
  className="sidebar-item"
>
  <img src={profile} alt="Profile Icon" className="sidebar-icon" />
  Profile
</li>



          <li onClick={() => navigate("/academics")} className="sidebar-item">
            <img src={edu} alt="Academics Icon" className="sidebar-icon" />
            Academics
          </li>
          <li onClick={() => navigate("/programs")} className="sidebar-item">
            <img src={achi} alt="Achievements Icon" className="sidebar-icon" />
            Our Programs
          </li>
          <li onClick={() => navigate("/up")} className="sidebar-item">
            <img src={time} alt="Timetable Icon" className="sidebar-icon" />
            Timetable
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h2>Hello Name</h2>
          <p>Maatram welcomes you to Transformation through Education</p>
          <div className="header-icons">
            <img src={notify} alt="Notification Bell" onClick={() => navigate("/notifications")} // Navigate to the Logout component
              style={{ cursor: "pointer" }} className="header-icon" />
            <img
              src={logout}
              alt="Logout Icon"
              className="header-icon"
              onClick={() => navigate("/logout")} // Navigate to the Logout component
              style={{ cursor: "pointer" }}
            />
          </div>
        </header>

        {/* Performance Sections */}
        <div className="performance-sections">
  <div className="card" onClick={() => navigate("/attendance")}>
    <h3>Attendance</h3>
    <img src={att} alt="Attendance Chart" className="card-image" />
  </div>
  <div className="card" onClick={() => navigate("/marks")}>
    <h3>Subjects Grade</h3>
    <img src={per} alt="Subjects Grade Chart" className="card-image" />
  </div>
</div>


        {/* Updated Details Section */}
        <div className="details-section">
          <div className="details-grid">
            <div
              className="details-card"
              onClick={() => navigate("/cutoff")}
            >
              Cutoff
            </div>
            <div
              className="details-card"
              onClick={() => navigate("/anchors")}
            >
              Anchors
            </div>
            <div
              className="details-card"
              onClick={() => navigate("/family-details")}
            >
              Family Details
            </div>
            <div
              className="details-card"
              onClick={() => navigate("/feedback")}
            >
             Feedback
            </div>
          </div>
          <div className="info-grid">
            <div className="info-card">Badges Earned</div>
            <div className="info-card">Leaderboard</div>
            <div className="info-card">Upcoming Meetings</div>
            <div className="info-card">Participation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
