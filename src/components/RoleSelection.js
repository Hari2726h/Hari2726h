import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";
import m from '../images/m.jpg';
const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection">
      <img src={m} alt="Maatram Logo" className="maatram-logo" />
      <h2 className="role-heading">WHO ARE YOU?</h2>
      <div className="role-buttons">
      <button onClick={() => navigate("/login", { state: { role: "tutor" } })} className="role-button">
  TUTOR
</button>

<button onClick={() => navigate("/login", { state: { role: "student" } })} className="role-button">STUDENT
</button>
<button onClick={() => navigate("/login", { state: { role: "admin" } })} className="role-button">
  ADMIN
</button>

      </div>
    </div>
  );
};

export default RoleSelection;
