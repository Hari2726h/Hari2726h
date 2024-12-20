import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Tutors from "./components/Tutor";
import Reports from "./components/Reports";
import Academics from "./components/Academics";
import Admin from "./components/Admin";
import Logout from "./components/Logout";
import MyProfile from "./components/MyProfile";
import Cutoff from "./components/Cutoff";
import Anchors from "./components/Anchors";
import FamilyDetails from "./components/FamilyDetails";
import "./App.css";
import AttendancePage from "./components/AttendancePage";
import MarksRecord from "./components/MarksRecord";
import AttendanceTutor from "./components/AttendanceTutor";
import TutorMarks from "./components/TutorMarks";
import Admin1 from "./components/Admin1";
import Tprofile from "./components/Tprofile";
import NotificationPage from "./components/NotificationPage";
import FeedbackPage from "./components/FeedbackPage";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Role Selection Page */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/Feedback" element={<FeedbackPage />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/tp" element={<Tprofile />} />
        <Route path="/admin1" element={<Admin1 />} />
        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/academics" element={<Academics />} />
<Route path="/admin" element={<Admin />} />
        {/* <Route path="/student-dashboard" element={<StudentDashboard />} /> */}
        {/* Students Management Route */}
        <Route path="/students" element={<Students />} />
        <Route path="/profile/:id" element={<MyProfile />} />


        {/* Tutors Management Route */}
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tm" element={<TutorMarks />} />
          
        {/* Attendance Tracking Route */}
                              <Route path="/logout" element={<Logout />} />
        {/* Reports Route */}
        <Route path="/family-details" element={<FamilyDetails />} />
<Route path="/reports" element={<Reports />} />
<Route path="/anchors" element={<Anchors />} />
<Route path="/cutoff" element={<Cutoff />} />
<Route path="/attendance" element={<AttendancePage />} />
<Route path="/marks" element={<MarksRecord />} />
<Route path="/at" element={<AttendanceTutor />} />

      </Routes>
    </Router>
  );
};

export default App;
