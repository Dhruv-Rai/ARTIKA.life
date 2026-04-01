import React, { useState, useEffect } from "react";
import "./VaccineTracker.css";
import Header from "../Components/FixedComponents/Header";
import DarkVeil from "../Components/Backgrounds/DarkVeil";

export default function VaccineTracker() {
  const initialVaccines = [
    { id: 1, name: "BCG", time: "At Birth", status: "Scheduled" },
    { id: 2, name: "Hepatitis B", time: "At Birth", status: "Scheduled" },
    { id: 3, name: "Polio (OPV)", time: "6-14 Weeks", status: "Scheduled" },
    { id: 4, name: "Malaria", time: "4-5 Years", status: "Scheduled" },
    { id: 5, name: "Measles (MMR)", time: "9-12 Months", status: "Scheduled" },
    { id: 6, name: "DTwP Booster", time: "16-24 Months", status: "Scheduled" },
  ];

  const [meds, setMeds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("fixedVaccineList"));
    if (saved && saved.length > 0) {
      setMeds(saved);
    } else {
      setMeds(initialVaccines);
      localStorage.setItem("fixedVaccineList", JSON.stringify(initialVaccines));
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    const newList = meds.map(med => 
      med.id === id ? { ...med, status: newStatus } : med
    );
    setMeds(newList);
    localStorage.setItem("fixedVaccineList", JSON.stringify(newList));
  };

  const getRowClass = (status) => {
    switch (status) {
      case "Done": return "row-done";
      case "Scheduled": return "row-scheduled";
      case "Not Done": return "row-missed";
      default: return "";
    }
  };

  return (
    <div className="vaccine-container page">
      <DarkVeil
        hueShift={0}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={1}
        scanlineFrequency={0}
        warpAmount={0}
      />
      
      <Header />
      <div className="content">
        <div className="tracker-card">
          <h1>Vaccination Tracker</h1>
          <p className="intro-text">Hi I am Diwakar</p>
          <p className="sub-header-text">Track your essential immunizations below</p>

          <table className="med-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Recommended Time</th>
                <th>Status Management</th>
              </tr>
            </thead>
            <tbody>
              {meds.map(med => (
                <tr key={med.id} className={getRowClass(med.status)}>
                  <td>
                    <strong>{med.name}</strong>
                  </td>
                  <td>{med.time}</td>
                  <td>
                    <div className="row-status-grp">
                      <label>
                        <input 
                          type="radio" 
                          name={`status-${med.id}`}
                          value="Done" 
                          checked={med.status === "Done"}
                          onChange={() => updateStatus(med.id, "Done")}
                        /> Done
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name={`status-${med.id}`} 
                          value="Scheduled" 
                          checked={med.status === "Scheduled"}
                          onChange={() => updateStatus(med.id, "Scheduled")}
                        /> Scheduled
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name={`status-${med.id}`} 
                          value="Not Done" 
                          checked={med.status === "Not Done"}
                          onChange={() => updateStatus(med.id, "Not Done")}
                        /> Not Done
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
