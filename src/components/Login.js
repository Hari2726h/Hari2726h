import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Ll from '../images/Ll.png';
import oip from '../images/OIP.jpg';

const backendURL = "https://json-server-backend-6y18.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  useEffect(() => {
    // Block back navigation and redirect to logout page
    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/logout"); // Redirect to logout page
    };

    window.addEventListener("popstate", handlePopState);

    // Replace history state to prevent the user from going back to the login page
    window.history.replaceState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = role === "student" ? "students" : role === "tutor" ? "tutors" : "users";
    const apiUrl = `${backendURL}/${endpoint}`;

    try {
      const response = await axios.get(apiUrl);
      const validUser = response.data.find(
        (user) => user.email === email && user.password === password
      );

      if (validUser) {
        if (role === "student") {
          localStorage.setItem("loggedInStudentId", validUser.id);
          navigate("/dashboard");
        } else if (role === "tutor") {
          localStorage.setItem("loggedInTutorId", validUser.id);
          navigate("/tutors"); // Corrected path
        } else {
          navigate("/admin");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <img src={Ll} alt="Logo" className="login-logo" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login as {role?.toUpperCase() || "USER"}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <div className="login-options">
            <a href="#" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="google-login">
          <button className="google-login-button">
            <img src={oip} alt="Google Icon" className="google-icon" />
            <h3>Login with Google</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
