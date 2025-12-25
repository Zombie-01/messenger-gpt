import { ResponseService } from "../../lib/services/ResponseServices";
import config from "../../lib/config";

// In-memory log storage (for development; use a database in production)
let logs = [];

// Recent event guard to prevent duplicate processing.
// Stores event ids with expiry timestamps.
const recentEvents = new Map();
const RECENT_EVENT_TTL_MS = 1000 * 60 * 5; // 5 minutes

// Cleanup expired events periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, expireAt] of recentEvents.entries()) {
    if (expireAt <= now) recentEvents.delete(key);
  }
}, 60 * 1000);

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
          // Determine unique event ids for incoming messaging events and skip duplicates
          let shouldProcess = false;
          for (const entry of body.entry || []) {
            for (const messageEvent of entry.messaging || []) {
              // Compute a stable event id. Prefer Facebook message id when available.
              const mid = messageEvent.message && messageEvent.message.mid;
              const payload =
                messageEvent.postback && messageEvent.postback.payload;
              const ts = messageEvent.timestamp || entry.time || "";
              const sender =
                (messageEvent.sender && messageEvent.sender.id) || "";
              const eventId =
                mid ||
                `${sender}:postback:${payload}:${ts}` ||
                `${sender}:msg:${ts}`;

              if (!recentEvents.has(eventId)) {
                // Mark for processing and store expiry
                recentEvents.set(eventId, Date.now() + RECENT_EVENT_TTL_MS);
                shouldProcess = true;
              } else {
                logMessage("WARN", "Duplicate event ignored", { eventId });
              }
            }
          }

          if (!shouldProcess) {
            // Nothing new to process
            logMessage("INFO", "No new messaging events to process");
            return res.status(200).send("EVENT_RECEIVED");
          }

          const responseService = new ResponseService();
          await responseService.handleReceivedMessage(body);
          logMessage("INFO", "Message handled successfully");
          res.status(200).send("EVENT_RECEIVED");
        } catch (err) {
          logMessage("ERROR", "Error handling message", { error: err.message });
          res.sendStatus(500);
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
