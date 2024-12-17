import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Anchors.css";

const Anchors = () => {
  const [anchors, setAnchors] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("loggedInStudentId");

    if (studentId) {
      axios
        .get(`http://localhost:5000/students/${studentId}`)
        .then((response) => {
          setAnchors(response.data.anchors || []);
        })
        .catch((error) => console.error("Error fetching anchors:", error));
    }
  }, []);

  return (
    <div className="anchors-container">
      <h2>Anchors</h2>
      {anchors.length > 0 ? (
        <ul className="anchors-list">
          {anchors.map((anchor) => (
            <li key={anchor.id} className="anchor-card">
              <h3>{anchor.name}</h3>
              <p>Subject: {anchor.subject}</p>
              <p>Contact: {anchor.contact}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No anchors found for you.</p>
      )}
    </div>
  );
};

export default Anchors;
