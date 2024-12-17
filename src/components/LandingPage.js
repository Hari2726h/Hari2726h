import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import tree from '../images/tree.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="logo-container">
        <img src={tree} alt="Tree Logo" className="tree-logo" />
        <h3 className="slogan">Transformation through education</h3>
        <button onClick={() => navigate("/role-selection")} className="get-started-button">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
