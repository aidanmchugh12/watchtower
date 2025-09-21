import { useState } from "react";

export default function TimeControl() {
  const [timePaused, setTimePaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  async function setScale(value) {
    setTimeScale(value);
    await fetch("http://localhost:8080/api/simulation/setScale", {
      method: "POST",
      body: value,
    });
  }

  async function pause() {
    setTimePaused(true);
    await fetch("http://localhost:8080/api/simulation/stop", { method: "POST" });
}

async function play() {
    setTimePaused(false);
    await fetch("http://localhost:8080/api/simulation/start", { method: "POST" });
  }

  return (
    <div className="time-controls">
      <button
        className={`control-button pause-button ${timePaused ? "disabled" : ""}`}
        onClick={pause}
      >
        ⏸
      </button>

      <div id="time-slider">
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={timeScale}
          disabled={timePaused}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          onMouseUp={() => setScale(timeScale)}
          onTouchEnd={() => setScale(timeScale)}
        />
        <p id="time-label">{timeScale.toFixed(1)} Speed</p>
      </div>

      <button
        className={`control-button resume-button ${
          !timePaused ? "disabled" : ""
        }`}
        onClick={play}
      >
        ▶
      </button>
    </div>
  );
}