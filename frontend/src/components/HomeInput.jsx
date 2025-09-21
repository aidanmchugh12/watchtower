import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

export default function HomeInput() {
  const [selectedCity, setSelectedCity] = useState("");
  const {
    policeStations,
    setPoliceStations,
    fireStations,
    setFireStations,
    hospitals,
    setHospitals,
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStations = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    const query = `
    [out:json][timeout:25];
    area["name"="${cityName}"]->.a;
    (
      node["amenity"="hospital"](area.a);
      node["amenity"="police"](area.a);
      node["amenity"="fire_station"](area.a);
      way["amenity"="hospital"](area.a);
      way["amenity"="police"](area.a);
      way["amenity"="fire_station"](area.a);
    );
    out center;
  `;

    const url = "https://overpass-api.de/api/interpreter";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      // Arrays to store stations by type
      const police = [];
      const fire = [];
      const hospital = [];

      data.elements.forEach((el, index) => {
        let type;
        switch (el.tags?.amenity) {
          case "police":
            type = "p";
            break;
          case "fire_station":
            type = "f";
            break;
          case "hospital":
            type = "a";
            break;
          default:
            return; // skip unknown types
        }

        const station = {
          id: el.id % 10000 || index,
          type,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          capacity: Math.floor(Math.random() * 10) + 1,
        };

        // push into corresponding array (limit to 10)
        if (type === "p" && police.length < 10) police.push(station);
        if (type === "f" && fire.length < 10) fire.push(station);
        if (type === "a" && hospital.length < 10) hospital.push(station);
      });

      setPoliceStations(police);
      setFireStations(fire);
      setHospitals(hospital);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedCity) {
      alert("Please select a city before continuing!");
      return;
    }
    // send only the combined array
    navigate("/Disaster", {
      state: {},
    });
  };

  const updateCapacity = (stationType, stationId, newCapacity) => {
    const capacity = parseInt(newCapacity) || 0;

    if (stationType === "police") {
      setPoliceStations((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, capacity } : station
        )
      );
    } else if (stationType === "fire_station") {
      setFireStations((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, capacity } : station
        )
      );
    } else if (stationType === "hospital") {
      setHospitals((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, capacity } : station
        )
      );
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);

    //Map select values to proper city names
    const cityMap = {
      newyork: "New York",
      losangeles: "Los Angeles",
      pittsburgh: "Pittsburgh",
      dc: "Washington",
    };

    if (city && city !== "blank") {
      fetchStations(cityMap[city]);
    } else {
      //Clear results
      setPoliceStations([]);
      setFireStations([]);
      setHospitals([]);
    }
  };

  const renderStationTable = (stations, type) => {
    if (loading) {
      return <p>Loading {type}...</p>;
    }

    if (stations.length === 0) {
      return <p>No {type} found.</p>;
    }

    return (
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Coordinates</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id}>
              <td>{station.name}</td>
              <td>
                {station.lat?.toFixed(4)}, {station.lon?.toFixed(4)}
              </td>
              <td>
                <input
                  type="number"
                  value={station.capacity}
                  onChange={(e) =>
                    updateCapacity(station.type, station.id, e.target.value)
                  }
                  min="1"
                  max="100"
                  style={{
                    width: "60px",
                    padding: "3px",
                    border: "1px solid #ccc",
                    marginLeft: "10px",
                    borderRadius: "3px",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        width: "100dvw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        fontFamily: "monospace",
        background:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../icons/bnwmap.png") no-repeat center center/cover',
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: "50px" }}>
        <h1
          style={{
            fontWeight: 900,
            fontSize: "64px",
            margin: 0,
            textShadow: "2px 2px 5px rgb(24, 10, 85)",
            letterSpacing: "3px",
          }}
        >
          Watchtower
        </h1>
        <p
          style={{
            margin: "5px 0 0 0",
            textShadow: "2px 2px 5px rgb(41, 18, 144)",
            fontSize: "18px",
            color: "#ffffff",
          }}
        >
          a disaster management tool
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "55px",
          marginLeft: "0px",
        }}
      >
        <h1
          style={{
            textShadow: "3px 3px 5px rgb(17, 28, 103)",
            margin: 0,
          }}
        >
          Select City:
        </h1>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          style={{
            width: "450px",
            height: "25px",
            fontFamily: "monospace",
            fontSize: "large",
          }}
        >
          <option value="blank"> </option>
          <option value="newyork">New York</option>
          <option value="losangeles">Los Angeles</option>
          <option value="pittsburgh">Pittsburgh</option>
          <option value="dc">Washington D.C</option>
        </select>
      </div>

      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          height: "450px",
          width: "650px",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          overflowY: "hidden",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            textShadow: "3px 3px 5px rgb(255, 255, 255)",
            textAlign: "left",
            color: "rgb(0, 0, 0)",
            marginBottom: "0.3rem",
          }}
        >
          Police Stations:
        </p>
        <div
          style={{
            color: "rgb(0,0,0)",
            maxHeight: "120px",
            overflowY: "auto",
            marginBottom: "1rem",
          }}
        >
          {renderStationTable(policeStations, "police stations")}
        </div>

        <p
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            textShadow: "3px 3px 5px rgb(255, 255, 255)",
            textAlign: "left",
            color: "rgb(0, 0, 0)",
            marginBottom: "0.3rem",
          }}
        >
          Fire Stations:
        </p>
        <div
          style={{
            color: "rgb(0,0,0)",
            maxHeight: "120px",
            overflowY: "auto",
            marginBottom: "1rem",
          }}
        >
          {renderStationTable(fireStations, "fire stations")}
        </div>

        <p
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            textShadow: "3px 3px 5px rgb(255, 255, 255)",
            textAlign: "left",
            color: "rgb(0, 0, 0)",
            marginBottom: "0.3rem",
          }}
        >
          Hospitals:
        </p>
        <div
          style={{
            color: "rgb(0,0,0)",
            maxHeight: "120px",
            overflowY: "auto",
            marginBottom: "1rem",
          }}
        >
          {renderStationTable(hospitals, "hospitals")}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "91%",
          left: "43%",
        }}
      >
        <button
          style={{
            cursor: "pointer",
            backgroundColor: "rgb(36, 109, 36)",
            height: "60px",
            width: "200px",
            fontFamily: "monospace",
            fontSize: "25px",
            border: "none",
            borderRadius: "5px",
            boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.936)",
            fontWeight: 300,
            color: "#ccc",
            textShadow: "3px 3px 5px rgb(0, 0, 0)",
          }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
