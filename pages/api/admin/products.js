import cargoData from "../../../data/cargoData";
import subscriptions from "../../../data/subscriptions";
import { ResponseService } from "../../../lib/services/ResponseServices";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ products: cargoData });
  }

  if (req.method === "POST") {
    const { goods_id, location, status, estimated_arrival } = req.body;
    const prod = cargoData.find((p) => p.goods_id === goods_id);
    if (!prod) return res.status(404).json({ error: "not found" });

    const prevLocation = prod.location;
    const prevStatus = prod.status;

    if (location !== undefined) prod.location = location;
    if (status !== undefined) prod.status = status;
    if (estimated_arrival !== undefined)
      prod.estimated_arrival = estimated_arrival;

    // Notify subscribers if status or location changed
    const changed =
      prevStatus !== prod.status || prevLocation !== prod.location;
    if (changed) {
      const subs = subscriptions[goods_id] || [];
      if (subs.length > 0) {
        const service = new ResponseService();
        const message = `Таны бараа ${goods_id} - шинэ байршил: ${prod.location}, төлөв: ${prod.status}`;
        for (const psid of subs) {
          // best-effort notify
          try {
            await service.sendText(psid, message);
          } catch (e) {
            console.log("notify error", e);
          }
        }
      }
    }

    return res.status(200).json({ product: prod });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
