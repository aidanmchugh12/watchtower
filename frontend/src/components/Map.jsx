import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";
import Log from "./Log";
import Resources from "./Resources";
import TimeControl from "./TimeControl";

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

  useEffect(() => {
    const combined = [
      ...policeStations.map((s) => ({ ...s, type: "p" })),
      ...fireStations.map((s) => ({ ...s, type: "f" })),
      ...hospitals.map((s) => ({ ...s, type: "a" })),
    ];
    setStations(combined);

    const initializeAndStart = async () => {
      try {
        const initResponse = await fetch(
          "http://localhost:8080/api/initializeScene",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(combined),
          }
        );

        if (!initResponse.ok) {
          throw new Error("Failed to initialize scene");
        }

        const initData = await initResponse.json();
        setStations(initData.stations || []);
        setDisasters(initData.disasters || []);
        setMovingUnits(initData.movingUnits || []);

        const startResponse = await fetch(
          "http://localhost:8080/api/simulation/start",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!startResponse.ok) {
          throw new Error("Failed to start simulation");
        }

        console.log("Simulation started successfully");
      } catch (err) {
        console.error("Error initializing simulation:", err);
      }
    };

    initializeAndStart();
  }, [policeStations, fireStations, hospitals]); // runs once on mount

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      const leafletMap = L.map(mapRef.current, {
        center: [40.4406, -79.9959], // TODO: Initalize center based on city
        zoom: 13,
        minZoom: 13,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
        }
      ).addTo(leafletMap);

      // Set bounds and lock pan outside
      // TODO: Set bounds based on city
      leafletMap.setMaxBounds([
        [40.3, -80.1],
        [40.55, -79.85],
      ]);
      leafletMap.options.maxBoundsViscosity = 1.0;

      // Save ref so other effects can use the map
      leafletMapRef.current = leafletMap;
    }
  }, []);

  // SSE listener
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/simulation/stream"
    );

    eventSource.onmessage = (e) => {
      //console.log("SSE received:", e.data);
      try {
        const data = JSON.parse(e.data);
        setStations(data.stations || []);
        setDisasters(data.disasters || []);
        setMovingUnits(data.movingUnits || []);
        setStations(data.stations || []);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Initialize map + stations once
  // Update stations dynamically
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove old layer if it exists
    if (leafletMapRef.current._stationsLayer) {
      leafletMapRef.current.removeLayer(leafletMapRef.current._stationsLayer);
    }

    const stationLayer = L.layerGroup();

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

    stations.forEach((station) => {
      const icon = icons[station.type] || icons["f"];
      L.marker([station.lat, station.lon], { icon })
        .addTo(stationLayer)
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

    stationLayer.addTo(leafletMapRef.current);
    leafletMapRef.current._stationsLayer = stationLayer;
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
        fillColor:
          disaster.type == "fire"
            ? "#f03"
            : disaster.type == "flood"
            ? "#30f"
            : "#fa0",
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

    //console.log("Rendering moving units:", movingUnits);

    if (leafletMapRef.current._movingUnitsLayer) {
      leafletMapRef.current.removeLayer(
        leafletMapRef.current._movingUnitsLayer
      );
    }

    const unitLayer = L.layerGroup();

    movingUnits.forEach((unit) => {
      //console.log("Unit coords:", unit.lat, unit.lon);

      let color;
      switch (unit.type?.toLowerCase()) {
        case "f":
          color = "red";
          break;
        case "p":
          color = "blue";
          break;
        case "a":
          color = "green";
          break;
        default:
          color = "gray";
      }

      if (unit.lat && unit.lon) {
        L.circleMarker([unit.lat, unit.lon], {
          radius: 6,
          color,
          fillColor: color,
          fillOpacity: 0.9,
        }).addTo(unitLayer);
      }
    });

    unitLayer.addTo(leafletMapRef.current);
    leafletMapRef.current._movingUnitsLayer = unitLayer;
  }, [movingUnits]);

  return (
    <div>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />

      {/* Resource Box */}
      <Resources
        policeStations={policeStations}
        fireStations={fireStations}
        hospitals={hospitals}
      ></Resources>

      {/* Log Box */}
      <div className="map-box top-right">
        <Log logs={[]}></Log>
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

      <TimeControl></TimeControl>
    </div>
  );
}
