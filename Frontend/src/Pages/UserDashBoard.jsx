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
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      localStorage.setItem("familyMembers", JSON.stringify(updated));
    }
  };

  const updateMember = (member) => {
    navigate("/add", { state: { member } });
  };

  const adults = members.filter(
    (m) => m.category === "Adult"
  );
  const kids = members.filter(
    (m) => m.category === "Kid" || m.category === "Newborn"
  );

  const MemberCard = ({ member }) => (
    <div className="member-card" key={member.id}>
      <div className="card-id">ID: {member.id}</div>
      <div
        className="card-photo"
        style={{ backgroundImage: `url(${member.photo})` }}
      >
        {!member.photo && "👤"}
      </div>
      <div className="card-info">
        <h3>{member.name}</h3>
        <div className="card-badge">{member.relation}</div>
        <div className="card-details">
          <p>
            <strong>Age:</strong> {member.age} yrs ({member.category})
          </p>
          <p>
            <strong>Medication:</strong> {member.medication || "None"}
          </p>
          {member.medication && (
            <p className="med-time">
              ⏰ {member.frequency}x daily for {member.duration} days
            </p>
          )}
          {/* Growth Centre Info for Kids */}
          {(member.category === "Kid" || member.category === "Newborn") &&
            (member.weight || member.height || member.bloodGroup || member.allergies) && (
              <div className="growth-info">
                <p className="growth-info-title">🌱 Growth Centre</p>
                {member.weight && (
                  <p>
                    <strong>Weight:</strong> {member.weight} kg
                  </p>
                )}
                {member.height && (
                  <p>
                    <strong>Height:</strong> {member.height} cm
                  </p>
                )}
                {member.bloodGroup && (
                  <p>
                    <strong>Blood Group:</strong> {member.bloodGroup}
                  </p>
                )}
                {member.allergies && (
                  <p>
                    <strong>Allergies:</strong> {member.allergies}
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
      <div className="card-actions">
        <button className="edit-btn" onClick={() => updateMember(member)}>
          Update
        </button>
        <button className="del-btn" onClick={() => deleteMember(member.id)}>
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container page">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={220}
        forceHoverState={false}
        backgroundColor="#03080f"
      />

      <Header />

      <div className="content">
        <div className="dashboard-header">
          <h1>Family Members</h1>
          <div className="button-row">
            <button className="add-btn" onClick={() => navigate("/add")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              Add New Member
            </button>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="no-members">
            <p>No family members added yet.</p>
          </div>
        ) : (
          <div className="dashboard-sections">
            {/* ── Adults Section ── */}
            <div className="section-panel">
              <div className="section-heading adults-heading">
                <h2>Adults</h2>
                <span className="section-count">{adults.length}</span>
              </div>
              <div className="member-grid adults-grid">
                {adults.length > 0 ? (
                  adults.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))
                ) : (
                  <div className="section-empty">No adults added yet.</div>
                )}
              </div>
            </div>

            {/* ── Kids Section ── */}
            <div className="section-panel">
              <div className="section-heading kids-heading">
                <h2>Kids &amp; Newborns</h2>
                <span className="section-count kids-count">{kids.length}</span>
              </div>
              <div className="member-grid kids-grid">
                {kids.length > 0 ? (
                  kids.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))
                ) : (
                  <div className="section-empty">No kids added yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
