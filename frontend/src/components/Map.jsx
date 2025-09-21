import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";
import Log from "./Log"

export default function Map() {
  const mapRef = useRef(null); // div container
  const location = useLocation();
  const { policeStations, fireStations, hospitals } = useAppContext();
  const leafletMapRef = useRef(null); // store Leaflet map instance
  const [showModal, setShowModal] = useState(false);
  const [timePaused, setTimePaused] = useState(false);


  const dummyStations = [
    { lat: 40.4406, lon: -79.9959, type: "F", capacity: 10, id: 100 },
    { lat: 40.4606, lon: -79.97, type: "P", capacity: 5, id: 100 },
    { lat: 40.42, lon: -80.03, type: "H", capacity: 2, id: 100 },
  ];
  const [allStations, setAllStations] = useState(dummyStations);
  const [unitData, setUnitData] = useState(null);
  const [allMovingUnits, setAllMovingUnits] = useState(null);

  const totalCapacity = (stations) =>
    stations.reduce((sum, station) => sum + (station.capacity || 0), 0);
  // Add method to populate stations
  // Add method to populate police cars, fire trucks, and ambulances
  // Add method to populate moving unit data
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

      // Populate stations on map
      var StationaryIcon = L.Icon.extend({
        options: {
          iconSize: [40, 40], // size of the icon
          iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -20], // point from which the popup should open relative to the iconAnchor
        },
      });

      const icons = {
        P: new StationaryIcon({ iconUrl: "../icons/policeicon.png" }),
        H: new StationaryIcon({ iconUrl: "../icons/hospitalicon.png" }),
        F: new StationaryIcon({ iconUrl: "../icons/firehouseicon.png" }),
      };

      // Loop over all stations and add markers
      allStations.forEach((station) => {
        const icon = icons[station.type] || icons["F"]; // fallback
        L.marker([station.lat, station.lon], { icon })
          .addTo(leafletMap)
          .bindPopup(
            `<b>${station.type === "P"
              ? "Police"
              : station.type === "H"
                ? "Hospital"
                : "Firehouse"
            }</b><br/>
             Capacity: ${station.capacity}<br/>`
          );
      });

      // save to ref so it persists across renders
      leafletMapRef.current = leafletMap;
    }
  }, []);

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
        <Log logs={[
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
        ]}></Log>
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
          className={`control-button pause-button ${timePaused ? "disabled" : ""
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
          className={`control-button resume-button ${!timePaused ? "disabled" : ""
            }`}
          onClick={() => setTimePaused(false)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
