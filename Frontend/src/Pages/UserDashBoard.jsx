import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashBoard.css";
import Header from "../Components/FixedComponents/Header";
import Orb from "../Components/Backgrounds/Orb";

export default function UserDashBoard() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem("familyMembers") || "[]");
    setMembers(savedMembers);
  }, []);

  const deleteMember = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      localStorage.setItem("familyMembers", JSON.stringify(updated));
    }
  };

  const updateMember = (member) => {
    navigate("/add", { state: { member } });
  };

  return (
    <div className="dashboard-container page">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={0}
        forceHoverState={false}
        backgroundColor="#000000"
      />
      
      <Header />
      
      <div className="content">
        <div className="dashboard-header">
          <h1>Family Members</h1>
          <div className="button-row">
            <button className="add-btn" onClick={() => navigate("/add")}>
              + Add New Member
            </button>
          </div>
        </div>

        <div className="member-grid">
          {members.length > 0 ? (
            members.map((member) => (
              <div className="member-card" key={member.id}>
                <div className="card-id">ID: {member.id}</div>
                <div className="card-photo" style={{ backgroundImage: `url(${member.photo})` }}>
                  {!member.photo && "👤"}
                </div>
                <div className="card-info">
                  <h3>{member.name}</h3>
                  <div className="card-badge">{member.relation}</div>
                  <div className="card-details">
                    <p><strong>Age:</strong> {member.age} yrs ({member.category})</p>
                    <p><strong>Medication:</strong> {member.medication || "None"}</p>
                    {member.medication && (
                      <p className="med-time">⏰ {member.frequency}x daily for {member.duration} days</p>
                    )}
                  </div>
                </div>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => updateMember(member)}>Update</button>
                  <button className="del-btn" onClick={() => deleteMember(member.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-members">
              <p>No family members added yet.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
