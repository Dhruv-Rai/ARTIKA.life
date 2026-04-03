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
    phoneCountryCode: editMember?.phoneCountryCode || "+91",
    phoneNumber: editMember?.phoneNumber || "",
    medication: editMember?.medication || "",
    duration: editMember?.duration || "",
    frequency: editMember?.frequency || 0,
    times: editMember?.times || [],
    // Growth Centre fields
    weight: editMember?.weight || "",
    height: editMember?.height || "",
    bloodGroup: editMember?.bloodGroup || "",
    allergies: editMember?.allergies || "",
  });

  const [showGrowthCentre, setShowGrowthCentre] = useState(
    !!(editMember?.weight || editMember?.height || editMember?.bloodGroup || editMember?.allergies)
  );
  const [showVaccineTracker, setShowVaccineTracker] = useState(false);

  const isKid = formData.category === "Kid";
  const isNewborn = formData.category === "Newborn";
  const isKidOrNewborn = isKid || isNewborn;

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

      setFormData((prev) => ({ ...prev, age, category }));
    }
  }, [formData.dob]);

  // Reset growth centre when category changes to Adult
  useEffect(() => {
    if (!isKidOrNewborn) {
      setShowGrowthCentre(false);
    }
  }, [formData.category]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = JSON.parse(localStorage.getItem("familyMembers") || "[]");

    const dataToSave = {
      ...formData,
      weight: showGrowthCentre ? formData.weight : "",
      height: showGrowthCentre ? formData.height : "",
      bloodGroup: showGrowthCentre ? formData.bloodGroup : "",
      allergies: showGrowthCentre ? formData.allergies : "",
    };

    if (editMember) {
      const index = members.findIndex((m) => m.id === editMember.id);
      members[index] = dataToSave;
    } else {
      // Generate sequential ID: ART001, ART002 ...
      const maxNum = members.reduce((max, m) => {
        const num = parseInt((m.id || "").replace("ART", ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const nextNum = String(maxNum + 1).padStart(3, "0");
      const newMember = {
        ...dataToSave,
        id: "ART" + nextNum,
      };
      members.push(newMember);
    }

    localStorage.setItem("familyMembers", JSON.stringify(members));
    alert(editMember ? "Member Updated!" : "Member Added!");
    navigate("/user");
  };

  return (
    <div className="add-member-container page">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={220}
        forceHoverState={false}
        backgroundColor="#03080f"
      />

      <Header />
      <div className="content">
        <div className="form-card">
          <h2>{editMember ? "Update Member" : "Add New Family Member"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="photo-section">
                <div
                  className="photo-preview"
                  style={{ backgroundImage: `url(${formData.photo})` }}
                >
                  {!formData.photo && <span>No Photo</span>}
                </div>
                <input
                  type="file"
                  id="photo-upload"
                  hidden
                  onChange={handlePhotoChange}
                />
                <label htmlFor="photo-upload" className="upload-btn">
                  Upload Photo
                </label>
              </div>

              <div className="inputs-section">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <div className="dob-age">
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                  <span className="age-display">Age: {formData.age} yrs</span>
                </div>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Newborn">Newborn</option>
                  <option value="Kid">Kid</option>
                  <option value="Adult">Adult</option>
                </select>

                <select
                  value={formData.sex}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Relation (e.g. SON, MOTHER)"
                  required
                  value={formData.relation}
                  onChange={(e) =>
                    setFormData({ ...formData, relation: e.target.value })
                  }
                />

                {/* Phone Number with Country Code */}
                <div className="phone-field">
                  <select
                    className="country-code-select"
                    value={formData.phoneCountryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneCountryCode: e.target.value })
                    }
                  >
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+1">🇺🇸 +1 (USA)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+61">🇦🇺 +61 (Australia)</option>
                    <option value="+81">🇯🇵 +81 (Japan)</option>
                    <option value="+86">🇨🇳 +86 (China)</option>
                    <option value="+49">🇩🇪 +49 (Germany)</option>
                    <option value="+33">🇫🇷 +33 (France)</option>
                    <option value="+39">🇮🇹 +39 (Italy)</option>
                    <option value="+34">🇪🇸 +34 (Spain)</option>
                    <option value="+7">🇷🇺 +7 (Russia)</option>
                    <option value="+55">🇧🇷 +55 (Brazil)</option>
                    <option value="+27">🇿🇦 +27 (South Africa)</option>
                    <option value="+82">🇰🇷 +82 (South Korea)</option>
                    <option value="+65">🇸🇬 +65 (Singapore)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                    <option value="+92">🇵🇰 +92 (Pakistan)</option>
                    <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                    <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
                    <option value="+977">🇳🇵 +977 (Nepal)</option>
                    <option value="+1-242">🇧🇸 +1-242 (Bahamas)</option>
                    <option value="+1-246">🇧🇧 +1-246 (Barbados)</option>
                    <option value="+20">🇪🇬 +20 (Egypt)</option>
                    <option value="+254">🇰🇪 +254 (Kenya)</option>
                    <option value="+234">🇳🇬 +234 (Nigeria)</option>
                    <option value="+358">🇫🇮 +358 (Finland)</option>
                    <option value="+46">🇸🇪 +46 (Sweden)</option>
                    <option value="+47">🇳🇴 +47 (Norway)</option>
                    <option value="+45">🇩🇰 +45 (Denmark)</option>
                    <option value="+31">🇳🇱 +31 (Netherlands)</option>
                    <option value="+41">🇨🇭 +41 (Switzerland)</option>
                    <option value="+48">🇵🇱 +48 (Poland)</option>
                    <option value="+351">🇵🇹 +351 (Portugal)</option>
                    <option value="+30">🇬🇷 +30 (Greece)</option>
                    <option value="+90">🇹🇷 +90 (Turkey)</option>
                    <option value="+62">🇮🇩 +62 (Indonesia)</option>
                    <option value="+60">🇲🇾 +60 (Malaysia)</option>
                    <option value="+63">🇵🇭 +63 (Philippines)</option>
                    <option value="+66">🇹🇭 +66 (Thailand)</option>
                    <option value="+84">🇻🇳 +84 (Vietnam)</option>
                    <option value="+64">🇳🇿 +64 (New Zealand)</option>
                    <option value="+1-876">🇯🇲 +1-876 (Jamaica)</option>
                    <option value="+52">🇲🇽 +52 (Mexico)</option>
                    <option value="+56">🇨🇱 +56 (Chile)</option>
                    <option value="+54">🇦🇷 +54 (Argentina)</option>
                    <option value="+57">🇨🇴 +57 (Colombia)</option>
                    <option value="+51">🇵🇪 +51 (Peru)</option>
                    <option value="+972">🇮🇱 +972 (Israel)</option>
                    <option value="+98">🇮🇷 +98 (Iran)</option>
                    <option value="+964">🇮🇶 +964 (Iraq)</option>
                    <option value="+93">🇦🇫 +93 (Afghanistan)</option>
                  </select>
                  <input
                    type="tel"
                    className="phone-number-input"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ── Kid: Growth Centre toggle ── */}
            {isKid && (
              <div className="growth-toggle-wrapper">
                <label className="growth-toggle-label">
                  <div className="custom-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="growthCentreToggle"
                      checked={showGrowthCentre}
                      onChange={(e) => setShowGrowthCentre(e.target.checked)}
                      className="custom-checkbox-input"
                    />
                    <span className="custom-checkbox-box">
                      {showGrowthCentre && (
                        <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="growth-toggle-text">
                      🌱 Fill details for Growth Centre
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* ── Newborn: Vaccination Tracker toggle ── */}
            {isNewborn && (
              <div className="growth-toggle-wrapper">
                <label className="growth-toggle-label">
                  <div className="custom-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="vaccineTrackerToggle"
                      checked={showVaccineTracker}
                      onChange={(e) => setShowVaccineTracker(e.target.checked)}
                      className="custom-checkbox-input"
                    />
                    <span className="custom-checkbox-box vaccine-box">
                      {showVaccineTracker && (
                        <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="growth-toggle-text vaccine-toggle-text">
                      💉 Record Data in Vaccination Tracker?
                    </span>
                  </div>
                </label>

                {showVaccineTracker && (
                  <div className="vaccine-message">
                    <span className="vaccine-message-emoji">🎉</span>
                    <p>Welcome to Artika.life!
                      Your newborn has been successfully added. From now on, we’ll take care of your child’s vaccination tracking, ensuring no important vaccine is ever missed. You’ll receive timely reminders directly on your WhatsApp.
                      You can check the complete vaccination schedule anytime on the Vaccination Tracker page.
                      Your child’s health is now our priority. 💙!</p>
                  </div>
                )}
              </div>
            )}

            {/* Growth Centre Fields */}
            {isKidOrNewborn && showGrowthCentre && (
              <div className="growth-centre-section">
                <div className="growth-centre-header">
                  <span className="growth-centre-icon">📊</span>
                  <h3>Growth Centre Details</h3>
                </div>
                <div className="growth-grid">
                  <div className="growth-field">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 25.5"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                  <div className="growth-field">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 120.0"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                  </div>
                  <div className="growth-field">
                    <label>Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) =>
                        setFormData({ ...formData, bloodGroup: e.target.value })
                      }
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="growth-field growth-field-full">
                    <label>Allergies</label>
                    <input
                      type="text"
                      placeholder="e.g. Peanuts, Dust, Dairy"
                      value={formData.allergies}
                      onChange={(e) =>
                        setFormData({ ...formData, allergies: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="medication-section">
              <h3>Medication Reminders</h3>
              <div className="med-grid">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={formData.medication}
                  onChange={(e) =>
                    setFormData({ ...formData, medication: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Days"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
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
                        placeholder={`Time ${i + 1}`}
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
