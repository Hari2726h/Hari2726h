import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Tutor.css";
import notify from "../images/notify.png";
import logout from "../images/logout.png";
import profile from "../images/profile.png";
import { useNavigate } from "react-router-dom";

const Tutor = () => {
  const navigate = useNavigate();
  const [tutorData, setTutorData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]); // State for storing feedback
  const [showFeedback, setShowFeedback] = useState(false); // State to toggle feedback display

  useEffect(() => {
    const loggedInTutorId = localStorage.getItem("loggedInTutorId");

    if (!loggedInTutorId) {
      alert("No tutor is currently logged in.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/tutors/${loggedInTutorId}`)
      .then((response) => {
        setTutorData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tutor data:", error);
        alert("Failed to fetch tutor data. Please try again.");
      });

    // Fetch feedback for this tutor
    axios
      .get(`http://localhost:5000/feedback`)
      .then((response) => {
        // Filter feedback by tutor id (assuming feedback has tutorId or similar)
        setFeedbackData(response.data.filter((item) => item.tutorId === loggedInTutorId));
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
      });
  }, [navigate]);

  const handleFeedbackClick = () => {
    setShowFeedback(!showFeedback); // Toggle feedback display
  };

  if (!tutorData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="tutor-profile-container">
      {/* Header Section */}
      <header className="headers">
        <div className="logo">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180"
            alt="Logo"
          />
        </div>
        <h1 className="title">Tutor Profile</h1>
        <div className="header-icons">
          <img
            src={profile}
            alt="Notification Bell"
            onClick={() => navigate("/tp")}
            style={{ cursor: "pointer" }}
            className="header-icon"
          />
          <img
            src={logout}
            alt="Logout Icon"
            className="header-icon"
            onClick={() => navigate("/logout")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-picture">
          <div className="profile-initials">
            {tutorData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
        <div className="personal-info">
          <h2>Personal Information</h2>
          <div className="info-row">
            <strong>Name:</strong>
            <p>{tutorData.name}</p>
          </div>
          <div className="info-row">
            <strong>College Name:</strong>
            <p>{tutorData.college || "N/A"}</p>
          </div>
          <div className="info-row">
            <strong>Email:</strong>
            <p>{tutorData.email}</p>
          </div>
          <div className="info-row">
            <strong>Phone Number:</strong>
            <p>{tutorData.contact}</p>
          </div>
          <div className="info-row">
            <strong>Address:</strong>
            <p>{tutorData.address}</p>
          </div>
          <div className="info-row">
            <strong>Date of Birth:</strong>
            <p>{tutorData.dob}</p>
          </div>
          <div className="info-row">
            <strong>Graduation Year:</strong>
            <p>{tutorData.graduationYear}</p>
          </div>
          <div className="info-row">
            <strong>Experience:</strong>
            <p>{tutorData.parentContact}</p>
          </div>
          <div className="info-row">
            <strong>Gender:</strong>
            <p>{tutorData.gender}</p>
          </div>
          <div className="info-row">
            <strong>Designation:</strong>
            <p>{tutorData.designation}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="info-cards">
        <div className="info-card">Students</div>
        <div className="info-card" onClick={handleFeedbackClick}>
          Student's Feedback
        </div>
        <div className="info-card">Volunteering Works</div>
        <div className="info-card">Achievements</div>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className="feedback-section">
          <h2>Feedback for {tutorData.name}</h2>
          {feedbackData.length > 0 ? (
            feedbackData.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <p><strong>Student ID:</strong> {feedback.studentId}</p>
                <p><strong>Feedback:</strong> {feedback.feedback}</p>
                <p><strong>Timestamp:</strong> {feedback.timestamp}</p>
              </div>
            ))
          ) : (
            <p>No feedback available for this tutor.</p>
          )}
        </div>
      )}

      {/* Role Section */}
      <div className="role-section">
        <h2>Role: KK Tutor</h2>
        <div className="role-buttons">
          <button className="role-btn" onClick={() => navigate("/at")}>
            Attendance Record
          </button>
          <button className="role-btn" onClick={() => navigate("/tm")}>
            Test Scores
          </button>
          <button className="role-btn">Upcoming Classes</button>
          <button className="role-btn">Total Classes Conducted</button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
