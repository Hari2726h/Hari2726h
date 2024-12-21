import React, { useState, useEffect } from "react";
import axios from "axios";
const backendURL = "https://json-server-backend-6y18.onrender.com";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", class: "", contact: "" });
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    axios.get(`${backendURL}/students`).then((response) => {
      setStudents(response.data);
    });
  }, []);

  // Add new student with duplicate check
  const handleAddStudent = () => {
    const isDuplicate = students.some(
      (student) =>
        student.name.toLowerCase() === newStudent.name.toLowerCase() &&
        student.class.toLowerCase() === newStudent.class.toLowerCase() &&
        student.contact === newStudent.contact
    );
    if (isDuplicate) {
      alert("Student with the same details already exists.");
      return;
    }

    axios.post(`${backendURL}/students`, newStudent).then((response) => {
      setStudents([...students, response.data]);
      setNewStudent({ name: "", class: "", contact: "" });
    });
  };

  // Edit student details
  const handleEditStudent = () => {
    axios.put(` ${backendURL}/students/${editStudent.id}`, editStudent).then((response) => {
      setStudents(
        students.map((student) =>
          student.id === response.data.id ? response.data : student
        )
      );
      setEditStudent(null);
    });
  };

  // Delete a student
  const handleDeleteStudent = (id) => {
    axios.delete(` ${backendURL}/students/${id}`).then(() => {
      setStudents(students.filter((student) => student.id !== id));
    });
  };

  return (
    <div className="list-container">
      <h2>Manage Students</h2>

      <div>
        <h3>Add New Student</h3>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Class"
          value={newStudent.class}
          onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact"
          value={newStudent.contact}
          onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>

      {editStudent ? (
        <div>
          <h3>Edit Student</h3>
          <input
            type="text"
            value={editStudent.name}
            onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
          />
          <input
            type="text"
            value={editStudent.class}
            onChange={(e) => setEditStudent({ ...editStudent, class: e.target.value })}
          />
          <input
            type="text"
            value={editStudent.contact}
            onChange={(e) => setEditStudent({ ...editStudent, contact: e.target.value })}
          />
          <button onClick={handleEditStudent}>Save Changes</button>
          <button onClick={() => setEditStudent(null)}>Cancel</button>
        </div>
      ) : null}

      <h3>Students List</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.class} - {student.contact}
            <button onClick={() => setEditStudent(student)}>Edit</button>
            <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
