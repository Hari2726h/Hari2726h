import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import axios from "axios";
import "./TutorMarks.css";

const TutorMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState(null);
 
  const API_URL = "https://json-server-backend-6y18.onrender.com";

  const normalizeMarks = (data) => {
    if (Array.isArray(data)) {
      return data; // Already flat array
    }
    return Object.keys(data)
      .filter((key) => !isNaN(key)) // Include only numeric keys
      .map((key) => data[key]);
  };

  // Handle search functionality
  const handleSearch = () => {
    const filtered = marksData.filter((record) => record.date === searchDate);
    setFilteredData(filtered);
  };

  // Toggle details visibility
  const handleToggleDetails = (id) => {
    setVisibleDetails(visibleDetails === id ? null : id);
  };

  // Download the marks data as PDF
  const handleDownload = () => {
    const element = document.getElementById("marks-page");

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("MarksPage.pdf");
    });
  };

  // Convert Excel date format to JS Date
  const excelDateToJSDate = (serial) => {
    const date = new Date((serial - 25569) * 86400 * 1000);
    return date.toISOString().split("T")[0];
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid Excel file.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Extract columns correctly
      const newMarksData = jsonData.slice(1).map((row, index) => {
        const [studentId, name, marks, testId, topic] = row;
        return {
          id: (Date.now() + index).toString(), // Unique ID
          studentId: String(studentId),
          name: name || "Unknown",
          marks: marks || 0,
          testId: testId || "N/A",
          topic: topic || "N/A",
          uploadedByTutorId: 1, // Replace with dynamic tutor ID if needed
        };
      });
  
      try {
        const { data: existingMarks } = await axios.get(`${API_URL}/marks`);
        const normalizedExisting = normalizeMarks(existingMarks);
  
        // Filter out duplicates
        const uniqueData = newMarksData.filter(
          (newRecord) =>
            !normalizedExisting.some(
              (existingRecord) =>
                existingRecord.studentId === newRecord.studentId &&
                existingRecord.name === newRecord.name
            )
        );
  
        if (uniqueData.length === 0) {
          alert("No new unique marks records to upload.");
          return;
        }
  
        // Post unique data to backend
        await Promise.all(
          uniqueData.map((record) => axios.post(`${API_URL}/marks`, record))
        );
  
        alert("Marks uploaded successfully!");
        setMarksData([...marksData, ...uniqueData]);
      } catch (error) {
        console.error("Error uploading marks:", error);
        alert("Failed to upload marks.");
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  // Fetch marks data from the backend
  React.useEffect(() => {
    axios
      .get(`${API_URL}/marks`)
      .then((response) => {
        let marksData = response.data;
        marksData = normalizeMarks(marksData); // Normalize data
        setMarksData(marksData); // Set normalized data
        setFilteredData(marksData); // Prepare filtered data
      })
      .catch((error) => console.error("Error fetching marks data:", error));
  }, []);

  return (
    <div id="marks-page" className="marks-page">
      <header className="header">
        <h1 className="title">Marks Tracker</h1>
      </header>
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
            Upload Marks (Excel)
          </label>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
        <div className="marks-details">
          <table className="marks-table">
          <thead>
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Marks</th>
    <th>Test ID</th>
    <th>Topic</th>
    <th>Details</th>
  </tr>
</thead>
<tbody>
  {filteredData.map((record, index) => (
    <React.Fragment key={index}>
      <tr>
        <td>{record.studentId}</td>
        <td>{record.name}</td>
        <td>{record.marks}</td>
        <td>{record.testId}</td>
        <td>{record.topic}</td>
        <td>
          <button onClick={() => handleToggleDetails(index)}>
            {visibleDetails === index ? "Hide" : "Show"} Details
          </button>
        </td>
      </tr>
      {visibleDetails === index && (
        <tr>
          <td colSpan="6">
            <div className="details">
              <p>Student ID: {record.studentId}</p>
              <p>Name: {record.name}</p>
              <p>Marks: {record.marks}</p>
              <p>Test ID: {record.testId}</p>
              <p>Topic: {record.topic}</p>
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

export default TutorMarks;
