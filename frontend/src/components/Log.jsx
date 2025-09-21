import { useEffect, useState } from "react";

export default function Log() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("http://localhost:8080/api/log");
      const data = await res.json();
      setLogs(data);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 500); // poll every 0.5s
    return () => clearInterval(interval);
  }, []);

  const getClass = (line) => {
    if (line.toLowerCase().startsWith("success:")) return "greentext";
    if (line.toLowerCase().startsWith("notice:")) return "bluetext";
    if (line.toLowerCase().startsWith("disaster:")) return "redtext";
    return "";
  };

  return (
    <div className="log">
      <div>
        {logs.map((line, idx) => (
          <div key={idx} className={`logline ${getClass(line)}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}