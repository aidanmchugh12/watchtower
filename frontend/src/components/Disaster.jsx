import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./disasterStyle.css";

export default function HomeInput() {
  const [fire, setFire] = useState(5);
  const [flood, setFlood] = useState(5);
  const [crime, setCrime] = useState(5);
  const navigate = useNavigate();



  const handleLast = () => {
    const values = { fire, flood, crime };
    navigate("/Map", values);
  };

  return (
    <div class="headingPage">
      <div class="heading-content">
        <h1 id="pageHeading">Disasters</h1>
      </div>


      <div class="disaster-selection">
        <h1> Select Disaster Likeliness:</h1>
      </div>

      <div class="selection-box">
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

      <div class="simulatePage">
        <button class="simulateText" onClick={handleLast}>Simulate</button>
      </div>
    </div>
  );
}