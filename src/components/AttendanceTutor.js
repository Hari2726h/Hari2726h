import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import axios from "axios";
import "./AttendanceTutor.css";

const API_URL = "https://json-server-backend-6y18.onrender.com";

const AttendanceTutor = ({ loggedInTutorId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [tutorData, setTutorData] = useState(null); // New state for tutor details
  const [searchDate, setSearchDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState(null);


  const normalizeAttendance = (data) => {
    return Array.isArray(data) ? data : Object.values(data);
  };

  // Filter attendance records by date and tutor
  const handleSearch = () => {
    const filtered = attendanceData.filter(
      (record) =>
        record.Date === searchDate &&
        record.uploadedByTutorId === loggedInTutorId
    );
    setFilteredData(filtered);
  };

  // Toggle details visibility
  const handleToggleDetails = (id) => {
    setVisibleDetails(visibleDetails === id ? null : id);
  };

  // Download attendance as PDF
  const handleDownload = () => {
    const element = document.getElementById("attendance-page");

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("AttendancePage.pdf");
    });
  };

  const excelDateToJSDate = (serial) => {
    const date = new Date((serial - 25569) * 86400 * 1000);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Fetch attendance data
    axios
      .get(`${API_URL}/attendance`)
      .then((response) => {
        let attendanceData = normalizeAttendance(response.data);
  
        // Filter attendance for the logged-in tutor only
        const tutorAttendance = attendanceData.filter(
          (record) => record.uploadedByTutorId === loggedInTutorId
        );
  
        setAttendanceData(tutorAttendance);
        setFilteredData(tutorAttendance);
      })
      .catch((error) => console.error("Error fetching attendance data:", error));
  
    // Fetch tutor data
    axios
      .get(`${API_URL}/tutors`) // Fixed URL formatting
      .then((response) => {
        const tutor = response.data.find((tutor) => tutor.id === loggedInTutorId);
        setTutorData(tutor); // Ensure tutor data is correctly set
      })
      .catch((error) => console.error("Error fetching tutor data:", error));
  }, [loggedInTutorId]);
  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const [header, ...rows] = jsonData;
  
      const newAttendanceData = rows.map((row, index) => {
        const record = {};
        header.forEach((key, colIndex) => {
          record[key] = row[colIndex] || "Unknown";
        });
  
        return {
          ...record,
          id: Date.now() + index, // Generate unique ID
          uploadedByTutorId: loggedInTutorId, // Assign current tutor's ID
        };
      });
  
      try {
        await Promise.all(
          newAttendanceData.map((record) =>
            axios.post(`${API_URL}/attendance`, record)
          )
        );
  
        alert("Attendance uploaded successfully!");
  
        // Fetch updated data for the current tutor
        const updatedAttendance = [...attendanceData, ...newAttendanceData];
        const tutorSpecificAttendance = updatedAttendance.filter(
          (record) => record.uploadedByTutorId === loggedInTutorId
        );
  
        setAttendanceData(tutorSpecificAttendance);
      } catch (error) {
        console.error("Error uploading attendance:", error);
        alert("Failed to upload attendance.");
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/tutors`)
      .then((response) => {
        console.log("Fetched tutors:", response.data);
        const tutor = response.data.find((tutor) => tutor.id === loggedInTutorId);
        console.log("Fetched tutor:", tutor);
        setTutorData(tutor);
      })
      .catch((error) => console.error("Error fetching tutor data:", error));
  }, [loggedInTutorId]);
  
  
  return (
    <div id="attendance-page" className="attendance-page">
      <header className="header">
        <h1 className="title">Attendance Tracker</h1>
      </header>
      <div className="student-info">
  <img
    className="student-photo"
    src="https://www.w3schools.com/w3images/avatar2.png"
    alt="Tutor"
  />
  <div className="student-details">
    {tutorData ? (
      <>
        <h2>{tutorData.name || "Name not available"}</h2>
        <p>{tutorData.college || "College information not available"}</p>
        <p>Email: {tutorData.email || "Email not available"}</p>
      </>
    ) : (
      <p>Loading tutor information...</p>
    )}
  </div>
</div>




      <div className="tracker-container">
        <div className="search-section">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="date-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-label">
            Upload Attendance (Excel)
          </label>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
        <div className="attendance-details">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{record["Student ID"]}</td>
                    <td>{record.Name || "Unknown"}</td>
                    <td>{record.Date}</td>
                    <td>{record.Status}</td>
                    <td>
                      <button onClick={() => handleToggleDetails(index)}>
                        {visibleDetails === index ? "Hide" : "Show"} Details
                      </button>
                    </td>
                  </tr>
                  {visibleDetails === index && (
                    <tr>
                      <td colSpan="5">
                        <div className="details">
                          {Object.entries(record).map(([key, value]) => (
                            <p key={key}>{`${key}: ${value}`}</p>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="download-section">
          <button className="download-btn" onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTutor;
