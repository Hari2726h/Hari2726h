import React, { useState, useEffect } from "react";
import "./Admin1.css";
import logout from '../images/logout.png';
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";

const Admin1 = () => {
    const [activeTab, setActiveTab] = useState("Tutors");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // Add/Edit for Tutor/Student
    const [formData, setFormData] = useState({});
    const [filter, setFilter] = useState("");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch Tutors and Students Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
          const tutorsResponse = await fetch("http://localhost:5000/tutors");
          const studentsResponse = await fetch("http://localhost:5000/students");
          
          if (!tutorsResponse.ok || !studentsResponse.ok) {
              throw new Error("Failed to fetch data from server");
            }
            
            const tutorsData = await tutorsResponse.json();
            const studentsData = await studentsResponse.json();
            
            setTutors(tutorsData);
            setStudents(studentsData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
}, []);

const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFilter(""); // Reset the filter when switching tabs
};

const handleAddClick = (type) => {
    setModalType(`Add ${type}`);
    setFormData({});
    setShowModal(true);
};

const navigate = useNavigate(); // Initialize navigate
  const handleEditClick = (type, item) => {
    setModalType(`Edit ${type}`);
    setFormData(item);
    setShowModal(true);
  };

  const handleDeleteClick = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const endpoint = type === "Tutor" ? `http://localhost:5000/tutors/${id}` : `http://localhost:5000/students/${id}`;
        const response = await fetch(endpoint, { method: "DELETE" });

        if (!response.ok) {
          throw new Error("Failed to delete data");
        }

        if (type === "Tutor") {
          setTutors(tutors.filter((tutor) => tutor.id !== id));
        } else {
          setStudents(students.filter((student) => student.id !== id));
        }

        alert(`${type} has been deleted.`);
      } catch (err) {
        console.error("Error deleting data:", err);
        alert("Failed to delete data. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    const endpoint = modalType.includes("Tutor")
      ? "http://localhost:5000/tutors"
      : "http://localhost:5000/students";
  
    const method = modalType.includes("Add") ? "POST" : "PUT";
    const url = modalType.includes("Add") ? endpoint : `${endpoint}/${formData.id}`;
  
    // Ensure missing values are set to default values
    const studentData = {
      ...formData,
      name: formData.name || "",
      email: formData.email || "",
      contact: formData.contact || "",
      grade: formData.grade || "",
      address: formData.address || "-",  // Default to "-" if missing
      gender: formData.gender || "-",    // Default to "-" if missing
      age: formData.age || "-",          // Default to "-" if missing
      familyDetails: formData.familyDetails || {
        fatherName: "-",
        motherName: "-",
        guardianContact: "-",
      },  // Default to "-" if family details are missing
      cutoff: formData.cutoff || "-",    // Default to "-" if missing
    };
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
  
      const updatedData = await response.json();
  
      if (modalType.includes("Tutor")) {
        if (modalType.includes("Add")) {
          setTutors([...tutors, updatedData]);
        } else {
          setTutors(tutors.map((tutor) => (tutor.id === formData.id ? updatedData : tutor)));
        }
      } else {
        if (modalType.includes("Add")) {
          setStudents([...students, updatedData]);
        } else {
          setStudents(students.map((student) => (student.id === formData.id ? updatedData : student)));
        }
      }
  
      alert(`${modalType.includes("Add") ? "Added" : "Updated"} successfully!`);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data. Please try again.");
    } finally {
      setShowModal(false);
    }
  };
  
  const filteredData = activeTab === "Tutors" ? tutors : students;
  const filteredList = filteredData.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <header className="header">
        <img
          src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180"
          alt="Logo"
          className="logo"
        />
        <div className="admin-management" ><h1 style={{color:'green'}}>Admin Management</h1></div>
        <input
          type="text"
          className="search-bar"
          placeholder={`Search ${activeTab}...`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="header-icons">
          <span className="icon">
            🔔 <span className="notification-badge"style={{color:'green'}}>3</span>
          </span>
          <div className="profile-dropdown">
          <img
            src={logout}
            alt="Logout Icon"
            className="header-icon"
            onClick={() => navigate("/logout")} // Navigate to the Logout component
            style={{ cursor: "pointer" }}
          />
          </div>
        </div>
      </header>

      {/* Sidebar Navigation
      <aside className="sidebar">
        <ul>
          <li onClick={() => handleTabSwitch("Dashboard")}>Dashboard</li>
          <li onClick={() => handleTabSwitch("Tutors")}>Tutors</li>
          <li onClick={() => handleTabSwitch("Students")}>Students</li>
          <li onClick={() => handleTabSwitch("Attendance")}>Attendance</li>
          <li onClick={() => handleTabSwitch("Reports")}>Reports</li>
          <li onClick={() => handleTabSwitch("Settings")}>Settings</li>
          <li onClick={() => handleTabSwitch("Help")}>Help</li>
        </ul>
      </aside> */}

      {/* Main Content Area */}
      <main className="main-content">
        <div className="tabs">
          <button
            className={activeTab === "Tutors" ? "active-tab" : ""}
            onClick={() => handleTabSwitch("Tutors")}
          >
            Tutors
          </button>
          <button
            className={activeTab === "Students" ? "active-tab" : ""}
            onClick={() => handleTabSwitch("Students")}
          >
            Students
          </button>
        </div>

        {/* Render Data */}
        {activeTab === "Tutors" && (
          <div>
            <h2>Tutors</h2>
            <button className="add-btn" onClick={() => handleAddClick("Tutor")}>
              Add New Tutor
            </button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                                        <td>{item.email}</td>
                    <td>{item.subject}</td>
                    <td>{item.contact}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick("Tutor", item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick("Tutor", item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Students" && (
          <div>
            <h2>Students</h2>
            <button className="add-btn" onClick={() => handleAddClick("Student")}>
              Add New Student
            </button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Grade</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.grade}</td>
                    <td>{item.contact}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick("Student", item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick("Student", item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              {modalType.includes("Tutor") && (
                <label>
                  Subject:
                  <input
                    type="text"
                    value={formData.subject || ""}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </label>
              )}
              {modalType.includes("Student") && (
                <label>
                  Grade:
                  <input
                    type="text"
                    value={formData.grade || ""}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  />
                </label>
              )}
              <label>
                Contact:
                <input
                  type="text"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin1;

