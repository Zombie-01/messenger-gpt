import { URL, URLSearchParams } from "url";
import config from "../config";
import { ResponseBody } from "./responseBody";
import { fetchArtists, fetchLearnMoreInfo } from "./ArtService";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export class ResponseService {
  handleReceivedMessage = async (body) => {
    // Process all messages sequentially to avoid race conditions
    for (const entry of body.entry) {
      for (const message of entry.messaging) {
        try {
          // Handle postback events (button clicks)
          if (message.postback) {
            if (message.postback.payload === config.postbackGetStarted) {
              await this.sendGreeting(message.sender.id, config.welcomeMessage);
              await this.sendArtistCarousel(message.sender.id);
            } else if (message.postback.title === config.postbackLearnMore) {
              await this.sendArtistBio(
                message.sender.id,
                message.postback.payload
              );
            } else {
              // Handle other postback payloads
              await this.sendArtistBio(
                message.sender.id,
                message.postback.payload
              );
            }
          }
          // Handle text messages
          else if (message.message && message.message.text) {
            const userMessage = message.message.text.toLowerCase();
            const senderId = message.sender.id;

            // Send typing indicator
            await this.updateTypingIndicator(senderId, true);

            // Generate AI response
            const response = await fetchLearnMoreInfo(userMessage);

            // Send response
            await this.sendGreeting(senderId, response);

            // Stop typing indicator
            await this.updateTypingIndicator(senderId, false);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      }
    }
  };

  sendGreeting = async (senderId, message) => {
    const responseBody = new ResponseBody();
    await this.sendApi(
      config.urlMesseges,
      responseBody.greetingMessageBody(senderId, message)
    );
  };

  sendArtistCarousel = async (senderId) => {
    const responseBody = new ResponseBody();
    await this.updateTypingIndicator(senderId, true);
    const artists = await fetchArtists();
    console.log(responseBody.artistCarouselBody(senderId, artists));
    await this.sendApi(
      config.urlMesseges,
      responseBody.artistCarouselBody(senderId, artists)
    );
    await this.updateTypingIndicator(senderId, false);
  };

  sendApi = async (apiUrl, body) => {
    try {
      let url = new URL(apiUrl);
      url.search = new URLSearchParams({
        access_token: config.accessToken,
      });

      console.log(
        "Sending API request to:",
        url.href.split("access_token=")[0]
      );

      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch((err) => {
        console.error("Fetch error:", err);
        return null;
      });

      if (!response) {
        console.error("No response received from Facebook API");
        return;
      }

      console.log("Facebook API response status:", response.status);

      if (response.ok) {
        const responseJson = await response.json().catch((err) => {
          console.error("JSON parse error:", err);
          return null;
        });
        console.log("Facebook API response:", responseJson);
      } else {
        const errorText = await response.text().catch(() => "");
        console.error(
          "Facebook API error:",
          response.status,
          response.statusText,
          errorText
        );
      }
    } catch (err) {
      console.error("sendApi error:", err);
    }
  };

  updateTypingIndicator = async (senderId, isActive) => {
    const responseBody = new ResponseBody();
    await this.sendApi(
      config.urlMesseges,
      responseBody.typingIndicatorBody(senderId, isActive)
    );
  };

  sendArtistBio = async (senderId, artistName) => {
    const responseBody = new ResponseBody();
    await this.updateTypingIndicator(senderId, true);
    const artistBio = await fetchLearnMoreInfo(artistName);
    await this.sendApi(
      config.urlMesseges,
      responseBody.greetingMessageBody(senderId, artistBio)
    );
    await this.updateTypingIndicator(senderId, false);
  };

  getAttachmentId = async (senderId) => {
    const responseBody = new ResponseBody();
    await this.sendApi(
      config.urlMesseges,
      responseBody.uploadImageBody(senderId)
    );
  };
}
