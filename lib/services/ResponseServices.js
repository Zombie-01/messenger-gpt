import { URL, URLSearchParams } from "url";
import config from "../config";
import { ResponseBody } from "./responseBody";
import cargoData from "../../data/cargoData";
import subscriptions from "../../data/subscriptions";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export class ResponseService {
  constructor() {
    this.awaitingTracking = {};
  }

  handleReceivedMessage = async (body) => {
    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        const senderId = event.sender && event.sender.id;
        if (!senderId) continue;

        // handle postback get started
        if (
          event.postback &&
          event.postback.payload === config.postbackGetStarted
        ) {
          await this.sendText(
            senderId,
            'Сайн байна уу! Марал Карго руу тавтай морилно уу. Та "бараа шалгах" гэж бичээд ачааг шалгах боломжтой.'
          );
          continue;
        }

        const text =
          event.message && event.message.text ? event.message.text.trim() : "";
        if (!text) continue;
        const lower = text.toLowerCase();

        if (
          lower.includes("бараа шалгах") ||
          lower.includes("ачаагаа шалгах") ||
          lower === "бараа"
        ) {
          this.awaitingTracking[senderId] = true;
          await this.sendText(senderId, "Та барааны дугаараа оруулна уу");
          continue;
        }

        if (this.awaitingTracking[senderId]) {
          await this.handleTrackingLookup(senderId, text);
          this.awaitingTracking[senderId] = false;
          continue;
        }

        if (
          lower.includes("хаяг") ||
          lower.includes("байршил") ||
          lower.includes("танай хаяг")
        ) {
          await this.sendText(
            senderId,
            "📍 Хаяг:\nЭрдэнэт хот, 4-р микр, 8-р байр"
          );
          continue;
        }
        if (
          lower.includes("утас") ||
          lower.includes("холбогдох дугаар") ||
          lower.includes("дугаар")
        ) {
          await this.sendText(senderId, "☎️ Холбогдох утас:\n99611133");
          continue;
        }
        if (
          lower.includes("хятадаас бараа татдаг") ||
          lower.includes("хятадаас ирдэг") ||
          lower.includes("хятад ачаа")
        ) {
          await this.sendText(
            senderId,
            "🚚 Бид Хятадаас бараа татдаг.\n📦 Эрдэнэт хотруу ачаа тээвэрлэдэг."
          );
          continue;
        }
        if (lower.includes("мэдээлэл") || lower.includes("танайх")) {
          await this.sendText(
            senderId,
            "📦 Марал Карго\n🚚 Хятадаас бараа татдаг\n📍 Эрдэнэт хотруу тээвэрлэдэг\n☎️ Утас: 99611133"
          );
          continue;
        }

        if (/^\d+$/.test(text)) {
          await this.handleTrackingLookup(senderId, text);
          continue;
        }

        await this.sendText(
          senderId,
          'Уучлаарай, би таныг ойлгосонгүй. Та "бараа шалгах" эсвэл "хаяг" гэх мэт командыг ашиглана уу.'
        );
      }
    }
  };

  handleTrackingLookup = async (senderId, goodsId) => {
    const found = cargoData.find(
      (c) => c.goods_id === goodsId || c.goods_id === goodsId.trim()
    );
    if (found) {
      // register the sender as subscriber
      try {
        const id = found.goods_id;
        subscriptions[id] = subscriptions[id] || [];
        if (!subscriptions[id].includes(senderId))
          subscriptions[id].push(senderId);
      } catch (e) {
        console.log("subscription error", e);
      }

      const message = `📦 Барааны дугаар: ${found.goods_id}  \n📍 Байршил: ${found.location}  \n🚚 Төлөв: ${found.status}  \n📅 Ирэх хугацаа: ${found.estimated_arrival}`;
      await this.sendText(senderId, message);
    } else {
      await this.sendText(senderId, "Уучлаарай, ийм бараа олдсонгүй");
    }
  };

  sendText = async (senderId, message) => {
    const responseBody = new ResponseBody();
    await this.sendApi(
      config.urlMesseges,
      responseBody.greetingMessageBody(senderId, message)
    );
  };

  sendApi = async (apiUrl, body) => {
    let url = new URL(apiUrl);
    url.search = new URLSearchParams({ access_token: config.accessToken });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((err) => console.log(err));
    if (!response) return;
    if (response.ok) {
      try {
        const responseJson = await response.json();
        console.log(responseJson);
      } catch (e) {}
    } else {
      console.log("Facebook API error", response.status);
    }
  };
}
