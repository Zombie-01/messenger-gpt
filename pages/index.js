export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Classical Art Webhook</h1>
        <p style={styles.subtitle}>Facebook Messenger ChatGPT Integration</p>

        <div style={styles.linksContainer}>
          <a href="/logs" style={styles.link}>
            View Logs →
          </a>
        </div>

        <div style={styles.infoSection}>
          <h2>API Endpoints</h2>
          <ul>
            <li>
              <code style={styles.code}>/api/webhook</code> - Webhook for
              Facebook Messenger
            </li>
            <li>
              <code style={styles.code}>/api/test</code> - Test endpoint
            </li>
            <li>
              <code style={styles.code}>/api/logs</code> - Get application logs
            </li>
          </ul>
        </div>

        <div style={styles.infoSection}>
          <h2>Environment Variables</h2>
          <p>
            Make sure to set these in your{" "}
            <code style={styles.code}>.env.local</code> file:
          </p>
          <ul>
            <li>
              <code style={styles.code}>FACEBOOK_ACCESS_TOKEN</code>
            </li>
            <li>
              <code style={styles.code}>OPENAI_API_KEY</code>
            </li>
            <li>
              <code style={styles.code}>WEBHOOK_VERIFY_TOKEN</code>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    padding: "40px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "8px",
    marginTop: "0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#888",
    marginBottom: "32px",
  },
  linksContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "40px",
  },
  link: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  infoSection: {
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid #333",
  },
  code: {
    backgroundColor: "#2a2a2a",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "Courier New, monospace",
    color: "#66d9ef",
  },
};
