const config = {
  urlProfile: "https://graph.facebook.com/v17.0/me/messenger_profile",
  urlMesseges: "https://graph.facebook.com/v17.0/me/messages",
  urlAttachment: "https://graph.facebook.com/v17.0/me/message_attachment",
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN || "",
  // Optional: configure your Facebook Page ID to help ignore messages sent by the page
  pageId: process.env.PAGE_ID || "",
  postbackGetStarted: "GET_STARTED",
  postbackLearnMore: "Learn More",
  welcomeMessage:
    "Welcome to Classical Art! Which artist would you like to learn more about?",
  // OpenAI key removed
};

export default config;
