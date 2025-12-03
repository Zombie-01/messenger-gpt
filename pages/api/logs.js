import { getLogs } from "./webhook";

export default function handler(req, res) {
  if (req.method === "GET") {
    const logs = getLogs();
    res.status(200).json({ logs });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
