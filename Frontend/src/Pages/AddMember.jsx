import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddMember.css";
import Header from "../Components/FixedComponents/Header";
import Orb from "../Components/Backgrounds/Orb";

export default function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();
  const editMember = location.state?.member;

  const [formData, setFormData] = useState({
    id: editMember?.id || "",
    photo: editMember?.photo || "",
    name: editMember?.name || "",
    dob: editMember?.dob || "",
    age: editMember?.age || 0,
    category: editMember?.category || "Adult",
    sex: editMember?.sex || "Male",
    address: editMember?.address || "",
    relation: editMember?.relation || "",
    medication: editMember?.medication || "",
    duration: editMember?.duration || "",
    frequency: editMember?.frequency || 0,
    times: editMember?.times || []
  });

  const handleFrequencyChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    const newTimes = [...formData.times];
    if (val > newTimes.length) {
      for (let i = newTimes.length; i < val; i++) newTimes.push("");
    } else {
      newTimes.splice(val);
    }
    setFormData({ ...formData, frequency: val, times: newTimes });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      let category = "Adult";
      if (age < 1) category = "Newborn";
      else if (age < 18) category = "Kid";

      setFormData(prev => ({ ...prev, age, category }));
    }
  }, [formData.dob]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = JSON.parse(localStorage.getItem("familyMembers") || "[]");
    
    if (editMember) {
      const index = members.findIndex(m => m.id === editMember.id);
      members[index] = formData;
    } else {
      const newMember = {
        ...formData,
        id: "ART" + Math.floor(Math.random() * 900000 + 100000),
      };
      members.push(newMember);
    }
    
    localStorage.setItem("familyMembers", JSON.stringify(members));
    alert(editMember ? "Member Updated!" : "Member Added! ID: " + (formData.id || "New"));
    navigate("/user");
  };

  return (
    <div className="add-member-container page">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={0}
        forceHoverState={false}
        backgroundColor="#000000"
      />
      
      <Header />
      <div className="content">
        <div className="form-card">
          <h2>{editMember ? "Update Member" : "Add New Family Member"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="photo-section">
                <div className="photo-preview" style={{ backgroundImage: `url(${formData.photo})` }}>
                  {!formData.photo && <span>No Photo</span>}
                </div>
                <input type="file" id="photo-upload" hidden onChange={handlePhotoChange} />
                <label htmlFor="photo-upload" className="upload-btn">Upload Photo</label>
              </div>

              <div className="inputs-section">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                
                <div className="dob-age">
                  <input 
                    type="date" 
                    required 
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                  />
                  <span className="age-display">Age: {formData.age} yrs</span>
                </div>

                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Newborn">Newborn</option>
                  <option value="Kid">Kid</option>
                  <option value="Adult">Adult</option>
                </select>

                <select 
                  value={formData.sex}
                  onChange={e => setFormData({...formData, sex: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Address" 
                  required 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />

                <input 
                  type="text" 
                  placeholder="Relation (e.g. SON, MOTHER)" 
                  required 
                  value={formData.relation}
                  onChange={e => setFormData({...formData, relation: e.target.value})}
                />
              </div>
            </div>

            <div className="medication-section">
              <h3>Medication Reminders</h3>
              <div className="med-grid">
                <input 
                  type="text" 
                  placeholder="Medicine Name" 
                  value={formData.medication}
                  onChange={e => setFormData({...formData, medication: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="Days" 
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="Times per day" 
                  value={formData.frequency}
                  onChange={handleFrequencyChange}
                />
              </div>

              {formData.times.length > 0 && (
                <div className="times-list">
                  <h4>Set Medication Times:</h4>
                  <div className="times-grid">
                    {formData.times.map((t, i) => (
                      <input 
                        key={i} 
                        type="time" 
                        value={t} 
                        onChange={(e) => handleTimeChange(i, e.target.value)} 
                        placeholder={`Time ${i+1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              {editMember ? "Save Changes" : "Register Member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
