import { useEffect, useState } from "react";

export default function Resources({ policeStations, fireStations, hospitals }) {
  const [r, setResources] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("http://localhost:8080/api/resources");
      const data = await res.json();
      setResources(data);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 500); // poll every 0.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="map-box top-left">
        <p className="centered">
          <strong>Resources</strong>
        </p>
        <p>
          Police Cars:{" "}
          {r.policeCarsAvailable + r.policeCarsEnRoute + r.policeCarsAtScene}
        </p>
        <div className="progress-bar">
          {r.policeCarsAvailable > 0 && (
            <div
              className="progress-section section-3"
              style={{ flex: r.policeCarsAvailable }}
            >
              {r.policeCarsAvailable}
            </div>
          )}
          {r.policeCarsEnRoute > 0 && (
            <div
              className="progress-section section-2"
              style={{ flex: r.policeCarsEnRoute }}
            >
              {r.policeCarsEnRoute}
            </div>
          )}
          {r.policeCarsAtScene > 0 && (
            <div
              className="progress-section section-1"
              style={{ flex: r.policeCarsAtScene }}
            >
              {r.policeCarsAtScene}
            </div>
          )}
        </div>
        <p>
          Fire Trucks:{" "}
          {r.fireTrucksAvailable + r.fireTrucksEnRoute + r.fireTrucksAtScene}
        </p>
        <div className="progress-bar">
          {r.fireTrucksAvailable > 0 && (
            <div
              className="progress-section section-3"
              style={{ flex: r.fireTrucksAvailable }}
            >
              {r.fireTrucksAvailable}
            </div>
          )}
          {r.fireTrucksEnRoute > 0 && (
            <div
              className="progress-section section-2"
              style={{ flex: r.fireTrucksEnRoute }}
            >
              {r.fireTrucksEnRoute}
            </div>
          )}
          {r.fireTrucksAtScene > 0 && (
            <div
              className="progress-section section-1"
              style={{ flex: r.fireTrucksAtScene }}
            >
              {r.fireTrucksAtScene}
            </div>
          )}
        </div>
        <p>
          Ambulances:{" "}
          {r.ambulancesAvailable + r.ambulancesEnRoute + r.ambulancesAtScene}
        </p>
        <div className="progress-bar">
          {r.ambulancesAvailable > 0 && (
            <div
              className="progress-section section-3"
              style={{ flex: r.ambulancesAvailable }}
            >
              {r.ambulancesAvailable}
            </div>
          )}
          {r.ambulancesEnRoute > 0 && (
            <div
              className="progress-section section-2"
              style={{ flex: r.ambulancesEnRoute }}
            >
              {r.ambulancesEnRoute}
            </div>
          )}
          {r.ambulancesAtScene > 0 && (
            <div
              className="progress-section section-1"
              style={{ flex: r.ambulancesAtScene }}
            >
              {r.ambulancesAtScene}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
