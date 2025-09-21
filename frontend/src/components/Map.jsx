import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

export default function Map() {
  const mapRef = useRef(null); // div container
  const leafletMapRef = useRef(null); // store Leaflet map instance
  const [showModal, setShowModal] = useState(false);
  const [timePaused, setTimePaused] = useState(false);

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

      var StationaryIcon = L.Icon.extend({
        options: {
          iconSize: [40, 40], // size of the icon
          iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -20], // point from which the popup should open relative to the iconAnchor
        },
      });

      var policeIcon = new StationaryIcon({
        iconUrl: "../icons/policeicon.png",
      });
      var hospitalIcon = new StationaryIcon({
        iconUrl: "../icons/hospitalicon.png",
      });
      var firehouseIcon = new StationaryIcon({
        iconUrl: "../icons/firehouseicon.png",
      });
      var police = L.marker([40.4406, -79.9959], { icon: policeIcon })
        .addTo(leafletMap)
        .bindPopup("HEY!");
      var fire = L.marker([40.4606, -79.97], { icon: firehouseIcon }).addTo(
        leafletMap
      );
      var hospital = L.marker([40.42, -80.03], { icon: hospitalIcon }).addTo(
        leafletMap
      );

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
        <p>Police Cars: 10</p>
        <div className="progress-bar">
          <div className="progress-section section-1">5</div>
          <div className="progress-section section-2">3</div>
          <div className="progress-section section-3">2</div>
        </div>
        <p>Fire Trucks: 10</p>
        <div className="progress-bar">
          <div className="progress-section section-1">2</div>
          <div className="progress-section section-2">7</div>
          <div className="progress-section section-3">1</div>
        </div>
        <p>Ambulances: 10</p>
        <div className="progress-bar">
          <div className="progress-section section-1">2</div>
          <div className="progress-section section-2">6</div>
          <div className="progress-section section-3">2</div>
        </div>
      </div>

      {/* Log Box */}
      <div className="map-box top-right">
        <p className="centered">
          <strong>Live Log</strong>
        </p>
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
