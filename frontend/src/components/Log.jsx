export default function Log({ logs }) {
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