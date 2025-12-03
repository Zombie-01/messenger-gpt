import { useState, useEffect } from "react";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/logs");
        const data = await response.json();
        setLogs(data.logs || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLoading(false);
      }
    };

    fetchLogs();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Application Logs</h1>
        <p style={styles.timestamp}>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div style={styles.controls}>
        <button
          style={{
            ...styles.button,
            backgroundColor: autoRefresh ? "#28a745" : "#6c757d",
          }}
          onClick={() => setAutoRefresh(!autoRefresh)}>
          {autoRefresh ? "✓ Auto Refresh" : "Auto Refresh"}
        </button>
        <button style={styles.button} onClick={downloadLogs}>
          Download Logs
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "#dc3545" }}
          onClick={clearLogs}>
          Clear Logs
        </button>
        <a href="/" style={styles.backLink}>
          ← Back to Home
        </a>
      </div>

      <div style={styles.logsContainer}>
        {loading ? (
          <p style={styles.loadingText}>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p style={styles.emptyText}>
            No logs yet. Logs will appear here when webhook events occur.
          </p>
        ) : (
          <div style={styles.logsList}>
            {[...logs].reverse().map((log) => (
              <div
                key={log.id}
                style={{
                  ...styles.logEntry,
                  borderLeftColor: getLevelColor(log.level),
                }}>
                <div style={styles.logHeader}>
                  <span
                    style={{
                      ...styles.logLevel,
                      backgroundColor: getLevelColor(log.level),
                    }}>
                    {log.level}
                  </span>
                  <span style={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p style={styles.logMessage}>{log.message}</p>
                {Object.keys(log.data).length > 0 && (
                  <details style={styles.details}>
                    <summary style={styles.summary}>Details</summary>
                    <pre style={styles.detailsContent}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>Total logs: {logs.length}</p>
        <p>Auto-refresh: {autoRefresh ? "Enabled" : "Disabled"}</p>
      </div>
    </main>
  );
}

const getLevelColor = (level) => {
  switch (level) {
    case "ERROR":
      return "#dc3545";
    case "WARN":
      return "#ffc107";
    case "INFO":
      return "#17a2b8";
    default:
      return "#6c757d";
  }
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 30px",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "8px",
    marginTop: "0",
  },
  timestamp: {
    color: "#888",
    fontSize: "14px",
    margin: "0",
  },
  controls: {
    maxWidth: "1200px",
    margin: "0 auto 30px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "opacity 0.3s",
  },
  backLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px",
    marginLeft: "auto",
  },
  logsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "400px",
    maxHeight: "600px",
    overflow: "auto",
  },
  loadingText: {
    textAlign: "center",
    color: "#888",
    padding: "20px",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    padding: "40px 20px",
  },
  logsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  logEntry: {
    backgroundColor: "#252525",
    borderLeft: "4px solid #17a2b8",
    padding: "12px 16px",
    borderRadius: "4px",
  },
  logHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  logLevel: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
    color: "white",
  },
  logTime: {
    fontSize: "12px",
    color: "#888",
  },
  logMessage: {
    margin: "0",
    fontSize: "14px",
  },
  details: {
    marginTop: "8px",
  },
  summary: {
    cursor: "pointer",
    fontSize: "12px",
    color: "#888",
  },
  detailsContent: {
    backgroundColor: "#1a1a1a",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "11px",
    overflow: "auto",
    margin: "8px 0 0 0",
  },
  footer: {
    maxWidth: "1200px",
    margin: "30px auto 0",
    textAlign: "center",
    color: "#888",
    fontSize: "12px",
  },
};
