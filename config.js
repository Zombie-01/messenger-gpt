module.exports = {
  urlProfile: "https://graph.facebook.com/v17.0/me/messenger_profile",
  urlMesseges: "https://graph.facebook.com/v17.0/me/messages",
  urlAttachment: "https://graph.facebook.com/v17.0/me/message_attachment",
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN || "",
  postbackGetStarted: "GET_STARTED",
  postbackLearnMore: "Learn More",
  welcomeMessage:
    "Welcome to Classical Art! Which artist would you like to learn more about?",
  // OpenAI key removed
};
