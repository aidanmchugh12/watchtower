import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./disasterStyle.css";

export default function HomeInput() {
  const [fire, setFire] = useState(5);
  const [flood, setFlood] = useState(5);
  const [crime, setCrime] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const { policeStations, fireStations, hospitals } = location.state;



  const handleLast = () => {
    const values = { fire, flood, crime };
    navigate("/Map", {
      state: { policeStations, fireStations, hospitals, fire, flood, crime },
    });
  };

  return (
    <div className="headingPage">
      <div className="heading-content">
        <h1 id="pageHeading">Disasters</h1>
      </div>


      <div className="disaster-selection">
        <h1> Select Disaster Likeliness:</h1>
      </div>

      <div className="selection-box">
        <div className="slider-row">
          <label>Fire:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={fire}
            onChange={(e) => setFire(Number(e.target.value))}
          />
          <span>{fire}</span>
        </div>

        <div className="slider-row">
          <label>Flood:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={flood}
            onChange={(e) => setFlood(Number(e.target.value))}
          />
          <span>{flood}</span>
        </div>

        <div className="slider-row">
          <label>Crime:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={crime}
            onChange={(e) => setCrime(Number(e.target.value))}
          />
          <span>{crime}</span>
        </div>
      </div>

      <div className="simulatePage">
        <button className="simulateText" onClick={handleLast}>Simulate</button>
      </div>
    </div>
  );
}