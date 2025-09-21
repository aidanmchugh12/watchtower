import React, { useEffect, useState } from "react";

// TESTER FILE FOR SIMULATION
export default function SimulationViewer() {
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    // Connect to SSE stream
    const eventSource = new EventSource(
      "http://localhost:8080/api/simulation/stream"
    );

    eventSource.onmessage = (e) => {
      console.log("SSE received:", e.data);
      try {
        const data = JSON.parse(e.data);
        setSimulationData(data); // save entire object
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simulation Viewer</h1>
      {simulationData ? (
        <pre
          style={{
            background: "#f0f0f0",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {JSON.stringify(simulationData, null, 2)}
        </pre>
      ) : (
        <p>Waiting for simulation data...</p>
      )}
    </div>
  );
}
