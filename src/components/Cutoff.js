import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cutoff.css";

const backendURL = "https://json-server-backend-6y18.onrender.com";

const Cutoff = () => {
  const [cutoff, setCutoff] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("loggedInStudentId");

    if (studentId) {
      axios
        .get(`${backendURL}/students/${studentId}`)
        .then((response) => {
          setCutoff(response.data.cutoff);
        })
        .catch((error) => console.error("Error fetching cutoff:", error));
    }
  }, []);

  return (
    <div className="cutoff-container">
      <h2>Cutoff Details</h2>
      {cutoff !== null ? (
        <div className="cutoff-details">
          <p>Your cutoff is:</p>
          <h3>{cutoff}%</h3>
        </div>
      ) : (
        <p>Loading cutoff details...</p>
      )}
    </div>
  );
};

export default Cutoff;
