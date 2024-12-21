import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
const backendURL = "https://json-server-backend-6y18.onrender.com";
  
const Reports = () => {
  const [reportFile, setReportFile] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("loggedInStudentId");

    if (studentId) {
      axios
        .get(`${backendURL}/students/${studentId}`)
        .then((response) => {
          setReportFile(response.data.reports?.file || null);
        })
        .catch((error) => console.error("Error fetching reports:", error));
    }
  }, []);

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {reportFile ? (
        <div className="report-card">
          <p>Your report is ready to download:</p>
          <a href={`/reports/${reportFile}`} download>
            Download Report
          </a>
        </div>
      ) : (
        <p>No report available for you.</p>
      )}
    </div>
  );
};

export default Reports;
