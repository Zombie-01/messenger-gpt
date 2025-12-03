import { ResponseService } from "../../lib/services/ResponseServices";

// In-memory log storage (for development; use a database in production)
let logs = [];

const logMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data: data || {},
    id: logs.length + 1,
  };
  logs.push(logEntry);
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs = logs.slice(-1000);
  }
  console.log(`[${level}] ${timestamp}: ${message}`, data || "");
};

export const getLogs = () => {
  return logs;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let body = req.body;

      logMessage("INFO", "Webhook received", { object: body.object });

      if (body.object === "page") {
        try {
          const responseService = new ResponseService();
          await responseService.handleReceivedMessage(body);
          logMessage("INFO", "Message handled successfully");
          res.status(200).send("EVENT_RECEIVED");
        } catch (err) {
          logMessage("ERROR", "Error handling message", { error: err.message });
          res.sendStatus(404);
        }
      } else {
        logMessage("WARN", "Invalid object type", { object: body.object });
        res.sendStatus(404);
      }
    } catch (err) {
      logMessage("ERROR", "Webhook error", {
        error: err.message,
        stack: err.stack,
      });
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    // Facebook webhook verification
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    logMessage("INFO", "Webhook verification request", {
      mode,
      token: token ? "***" : "missing",
    });

    if (mode && token) {
      if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        logMessage("INFO", "Webhook verified");
        res.status(200).send(challenge);
      } else {
        logMessage("WARN", "Invalid verification token");
        res.sendStatus(403);
      }
    } else {
      logMessage("WARN", "Missing verification parameters");
      res.sendStatus(403);
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
