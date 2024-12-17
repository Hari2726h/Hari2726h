import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Block back navigation and show confirmation prompt
    const handlePopState = (event) => {
      event.preventDefault();
      if (window.confirm("Are you sure you want to exit?")) {
        navigate("/role-selection");
      } else {
        // Do nothing; let the user stay on the current page.
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/role-selection");
  };

  const handleCancel = () => {
    // Simply navigate back to the previous page
    navigate(-1);
  };

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>Are you sure you want to log out?</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Logout;
