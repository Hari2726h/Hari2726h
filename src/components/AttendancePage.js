import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Chart from "chart.js/auto"; // Import Chart.js
import "./AttendancePage.css";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const studentId = localStorage.getItem("loggedInStudentId");
  const API_URL = "http://localhost:5000";

  // Ref for the bar chart
  const barChartRef = useRef(null);

  useEffect(() => {
    if (!studentId) {
      alert("Student ID is missing. Please log in again.");
      return;
    }

    const fetchAttendance = async () => {
      try {
        const attendanceResponse = await axios.get(`${API_URL}/attendance`);
        const studentResponse = await axios.get(`${API_URL}/students/${studentId}`);
        const studentAttendance = attendanceResponse.data.filter(
          (record) => record["Student ID"] === studentId
        );
        setAttendanceData(studentAttendance);
        setFilteredData(studentAttendance);
        setStudentName(studentResponse.data.name);
        setStudentClass(studentResponse.data.class);
        setStudentEmail(studentResponse.data.email);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("An error occurred while fetching attendance data.");
      }
    };

    fetchAttendance();
  }, [studentId]);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    const filtered = attendanceData.filter((entry) => {
      const entryDate = new Date(entry.Date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      return entryDate >= startDate && entryDate <= endDate;
    });

    setFilteredData(filtered);
  };

  const handleDownload = () => {
    const element = document.getElementById("attendance-details");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("AttendanceDetails.pdf");
    });
  };

  const calculateAttendancePercentage = () => {
    const totalRecords = filteredData.length;
    const totalPresent = filteredData.filter((record) => record.Status === "Present").length;
    const percentage = totalRecords
      ? ((totalPresent / totalRecords) * 100).toFixed(2)
      : 0;
    return percentage;
  };

  const attendancePercentage = calculateAttendancePercentage();

  // Bar Chart Effect
  useEffect(() => {
    let barChartInstance;

    if (barChartRef.current && filteredData.length > 0) {
      const ctx = barChartRef.current.getContext("2d");

      // Destroy existing chart instance to avoid duplication
      if (barChartInstance) {
        barChartInstance.destroy();
      }

      // Create new bar chart instance
      barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: filteredData.map((record) => record.Date), // Dates as labels
          datasets: [
            {
              label: "Attendance Percentage",
              data: filteredData.map((record) =>
                record.Status === "Present" ? 100 : 0
              ), // 100% for present, 0% for absent
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100, // Maximum percentage is 100
              title: {
                display: true,
                text: "Attendance Percentage (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Dates",
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    }

    return () => {
      if (barChartInstance) {
        barChartInstance.destroy();
      }
    };
  }, [filteredData]);

  return (
    <div className="attendance-page" id="attendance-details">
      <header className="header">
        <div className="logo">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180"
            alt="Logo"
          />
        </div>
        <h1>Attendance Details for {studentName}</h1>
      </header>
      <div className="student-info">
        <img
          className="student-photo"
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="Student"
        />
        <div className="student-details">
          <h2>{studentName}</h2>
          <p>{studentClass} - Sri Krishna College of Technology</p>
          <p>Email: {studentEmail}</p>
        </div>
      </div>

      <div className="filters">
        <div className="date-picker">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="date-picker">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="download-button" onClick={handleDownload}>
          Download
        </button>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Date</th>
            <th>Status</th>
            <th>Meeting</th>
            <th>Hours Present</th>
            <th>Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.Date}</td>
                <td>{row.Status}</td>
                <td>{row.Meeting}</td>
                <td>{row["Hours Present"]}</td>
                <td>{row.uploadedByTutorId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {filteredData.length > 0 && (
        <div className="attendance-summary">
          <h2>Cumulative Attendance Percentage: {attendancePercentage}%</h2>
        </div>
      )}

      {/* Bar Chart */}
      <div className="chart-section">
        <canvas ref={barChartRef} width="400" height="300"></canvas>
      </div>
    </div>
  );
};

export default AttendancePage;
