import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";
import Log from "./Log";

export default function Map() {
  const mapRef = useRef(null);
  const location = useLocation();
  const { policeStations, fireStations, hospitals } = useAppContext();
  const leafletMapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [timePaused, setTimePaused] = useState(false);

  // const dummyStations = [
  //   { lat: 40.4406, lon: -79.9959, type: "F", capacity: 10, id: 100 },
  //   { lat: 40.4606, lon: -79.97, type: "P", capacity: 5, id: 101 },
  //   { lat: 40.42, lon: -80.03, type: "H", capacity: 2, id: 102 },
  // ];
  const [stations, setStations] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [movingUnits, setMovingUnits] = useState([]);

  const totalCapacity = (stations) =>
    stations.reduce((sum, station) => sum + (station.capacity || 0), 0);
  // SSE listener
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/simulation/stream"
    );

    eventSource.onmessage = (e) => {
      console.log("SSE received:", e.data);
      try {
        const data = JSON.parse(e.data);
        setStations(data.stations || []);
        setDisasters(data.disasters || []);
        setMovingUnits(data.movingUnits || []);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Initialize map + stations once
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      const leafletMap = L.map(mapRef.current, {
        center: [40.4406, -79.9959],
        zoom: 13,
        minZoom: 13,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
        }
      ).addTo(leafletMap);

      leafletMap.setMaxBounds([
        [40.3, -80.1],
        [40.55, -79.85],
      ]);
      leafletMap.options.maxBoundsViscosity = 1.0;

      // Station icons
      var StationaryIcon = L.Icon.extend({
        options: {
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        },
      });

      const icons = {
        p: new StationaryIcon({ iconUrl: "../icons/policeicon.png" }),
        a: new StationaryIcon({ iconUrl: "../icons/hospitalicon.png" }),
        f: new StationaryIcon({ iconUrl: "../icons/firehouseicon.png" }),
      };

      // Add stations
      stations.forEach((station) => {
        const icon = icons[station.type] || icons["f"];
        L.marker([station.lat, station.lon], { icon })
          .addTo(leafletMap)
          .bindPopup(
            `<b>${
              station.type === "p"
                ? "Police"
                : station.type === "a"
                ? "Hospital"
                : "Firehouse"
            }</b><br/>Capacity: ${station.capacity}<br/>`
          );
      });

      // Save reference
      leafletMapRef.current = leafletMap;
    }
  }, [stations]);

  // Update disasters dynamically
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove old layer if it exists
    if (leafletMapRef.current._disasterLayer) {
      leafletMapRef.current.removeLayer(leafletMapRef.current._disasterLayer);
    }

    const disasterLayer = L.layerGroup();
    disasters.forEach((disaster) => {
      L.circle([disaster.lat, disaster.lon], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: disaster.severityLevel * 100,
      }).addTo(disasterLayer);
    });

    disasterLayer.addTo(leafletMapRef.current);
    leafletMapRef.current._disasterLayer = disasterLayer;
  }, [disasters]);

  // Update moving units dynamically
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove old layer if it exists
    if (leafletMapRef.current._movingUnitsLayer) {
      leafletMapRef.current.removeLayer(
        leafletMapRef.current._movingUnitsLayer
      );
    }

    const unitLayer = L.layerGroup();

    movingUnits.forEach((unit) => {
      let color;
      switch (unit.type) {
        case "f": // firetruck
          color = "red";
          break;
        case "p": // police
          color = "blue";
          break;
        case "a": // ambulance
          color = "green";
          break;
        default:
          color = "gray";
      }

      L.circleMarker([unit.lat, unit.lon], {
        radius: 6,
        color,
        fillColor: color,
        fillOpacity: 0.9,
      })
        .addTo(unitLayer)
        .bindPopup(`<b>Unit ${unit.id}</b><br/>Type: ${unit.type}`);
    });

    unitLayer.addTo(leafletMapRef.current);
    leafletMapRef.current._movingUnitsLayer = unitLayer;
  }, [movingUnits]);

  return (
    <div>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />

      {/* Resource Box */}
      <div className="map-box top-left">
        <p className="centered">
          <strong>Resources</strong>
        </p>
        <p>Police Cars: {totalCapacity(policeStations)}</p>
        <div className="progress-bar">
          <div className="progress-section section-1">5</div>
          <div className="progress-section section-2">3</div>
          <div className="progress-section section-3">2</div>
        </div>
        <p>Fire Trucks: {totalCapacity(fireStations)}</p>
        <div className="progress-bar">
          <div className="progress-section section-1">2</div>
          <div className="progress-section section-2">7</div>
          <div className="progress-section section-3">1</div>
        </div>
        <p>Ambulances: {totalCapacity(hospitals)}</p>
        <div className="progress-bar">
          <div className="progress-section section-1">2</div>
          <div className="progress-section section-2">6</div>
          <div className="progress-section section-3">2</div>
        </div>
      </div>

      {/* Log Box */}
      <div className="map-box top-right">
        <Log
          logs={[
            "this is a dummy log statement with no real contents",
            "this is a dummy log statement with no real contents",
            "it is 9:00 pm est. the sun has set",
            "success: fire has been put out",
            "this is a dummy log statement with no real contents",
            "notice: units have arrived at scene of emergency",
            "this is a dummy log statement with no real contents of any sort at all",
            "this is a dummy log statement with no real contents",
            "this is a dummy log statement with no real contents of any sort at all",
            "this is a dummy log statement with no real contents of any sort at all",
            "DISASTER: NEW FIRE OF SEVERITY LEVEL 5",
            "this is a dummy log statement with no real contents",
          ]}
        ></Log>
        <button onClick={() => setShowModal(true)}>Open</button>
      </div>

      {/* Capacity Bar */}
      <div id="capacity-bar">
        <div className="bar">
          <div className="fill" style={{ width: "75%" }}>
            Capacity: 75%
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-container show">
          <div className="modal">
            <h1>Decision</h1>
            <p>
              Our decision algorithm recommends you send{" "}
              <strong>3 Police Cars</strong> and <strong>2 Fire Trucks</strong>.
            </p>
            <br />
            <button
              onClick={() => setShowModal(false)}
              className="reject-button"
            >
              <strong>No</strong>
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="accept-button"
            >
              <strong>Yes</strong>
            </button>
          </div>
        </div>
      )}

      {/* Time Controls */}
      <div className="time-controls">
        <button
          className={`control-button pause-button ${
            timePaused ? "disabled" : ""
          }`}
          onClick={() => setTimePaused(true)}
        >
          ⏸
        </button>

        <div id="time-slider">
          <input type="range" min="0" max="24" step="1" disabled={timePaused} />
          <p id="time-label">Time</p>
        </div>

        <button
          className={`control-button resume-button ${
            !timePaused ? "disabled" : ""
          }`}
          onClick={() => setTimePaused(false)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
