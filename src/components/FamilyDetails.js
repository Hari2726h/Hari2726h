import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FamilyDetails.css";

const FamilyDetails = () => {
  const [familyDetails, setFamilyDetails] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("loggedInStudentId");

    if (studentId) {
      axios
        .get(`http://localhost:5000/students/${studentId}`)
        .then((response) => {
          setFamilyDetails(response.data.familyDetails || null);
        })
        .catch((error) => console.error("Error fetching family details:", error));
    }
  }, []);

  return (
    <div className="family-details-container">
      <h2>Family Details</h2>
      {familyDetails ? (
        <div className="family-card">
          <p><strong>Father's Name:</strong> {familyDetails.fatherName}</p>
          <p><strong>Mother's Name:</strong> {familyDetails.motherName}</p>
          <p><strong>Guardian's Contact:</strong> {familyDetails.guardianContact}</p>
        </div>
      ) : (
        <p>Loading family details...</p>
      )}
    </div>
  );
};

export default FamilyDetails;
