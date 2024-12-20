import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import html2pdf from "html2pdf.js";
import axios from "axios";
import "./MarksRecord.css";

const MarksRecord = () => {
  const chartRef = useRef(null);
  const [academicTerm, setAcademicTerm] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const studentId = localStorage.getItem("loggedInStudentId");
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (!studentId) {
      alert("Student ID is missing. Please log in again.");
      return;
    }

    const fetchMarks = async () => {
      try {
        const marksResponse = await axios.get(`${API_URL}/marks`);
        const studentResponse = await axios.get(`${API_URL}/students/${studentId}`);

        const studentMarks = marksResponse.data.filter(
          (record) => record.studentId === studentId
        );
        setMarksData(studentMarks);
        setFilteredResults(studentMarks);

        const student = studentResponse.data;
        setStudentName(student.name);
        setStudentClass(student.class);
        setStudentEmail(student.email);
      } catch (error) {
        console.error("Error fetching marks data:", error);
        alert("An error occurred while fetching marks data.");
      }
    };

    fetchMarks();
  }, [studentId]);

  useEffect(() => {
    let chartInstance;

    if (chartRef.current && filteredResults.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: filteredResults.map((r) => r.testId),
          datasets: [
            {
              label: "Marks",
              data: filteredResults.map((r) => r.marks), // Fix the data to reflect the marks
              backgroundColor: [
                "#4CAF50", "#FFC107", "#FF5722", "#2196F3", "#9C27B0", "#FF9800",
              ],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} marks`; // Fix the tooltip format
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [filteredResults]);

  const handleSearch = () => {
    const filtered = marksData.filter((record) => {
      const matchesTerm = academicTerm.trim()
        ? record.testId.toString().includes(academicTerm.trim())
        : true;

      return matchesTerm;
    });

    setFilteredResults(filtered);
  };

  const downloadPage = () => {
    const element = document.querySelector(".marks-record-container");
    const options = {
      margin: 1,
      filename: "marks-record.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  const calculateCumulativePercentage = () => {
    if (filteredResults.length === 0) return 0;
    const totalMarks = filteredResults.reduce((sum, record) => sum + Number(record.marks), 0);
    const percentage = (totalMarks / (filteredResults.length * 100)) * 100; // Assuming max marks are 100 per test
    return percentage.toFixed(2);
  };

  return (
    <div className="marks-record-container">
      <header className="marks-header">
        <div className="logo">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180"
            alt="Logo"
          />
        </div>
        <h1>Marks Record for {studentName}</h1>
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
          <label>Test ID</label>
          <input
            type="text"
            placeholder="Enter Test ID"
            value={academicTerm}
            onChange={(e) => setAcademicTerm(e.target.value)}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="download-button" onClick={downloadPage}>
          Download
        </button>
      </div>

      <table className="marks-table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Name</th>
            <th>Marks</th>
            <th>Test ID</th>
            <th>Topic</th>
            <th>Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.length > 0 ? (
            filteredResults.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.marks}</td>
                <td>{row.testId}</td>
                <td>{row.topic}</td>
                <td>Anchor {row.uploadedByTutorId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="cumulative-percentage">
        <h3>
          Cumulative Percentage: <span>{calculateCumulativePercentage()}%</span>
        </h3>
      </div>
      <div className="chart-section">
        <canvas ref={chartRef} width="300" height="300"></canvas>
      </div>
    </div>
  );
};

export default MarksRecord;
