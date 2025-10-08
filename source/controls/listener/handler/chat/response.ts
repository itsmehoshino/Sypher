export default class Response {
  constructor(api, event) {
    this.api = api;
    this.event = event;
  }

  async send(message) {
    if (!message) return;
    try {
      await this.api.sendTypingIndicator(this.event.threadID, true);

      const baseDelay = 500;
      const perCharDelay = 25;
      const maxDelay = 8000;

      const messageLength =
        typeof message === "string" ? message.length : JSON.stringify(message).length;

      let typingDelay = Math.min(baseDelay + messageLength * perCharDelay, maxDelay);

      if (messageLength > 100) {
        const pauseCount = Math.floor(messageLength / 80);
        for (let i = 0; i < pauseCount; i++) {
          const partialDelay = typingDelay / (pauseCount + 1);
          await new Promise((res) => setTimeout(res, partialDelay / 2));
          await this.api.sendTypingIndicator(this.event.threadID, false);
          await new Promise((res) => setTimeout(res, 300 + Math.random() * 700));
          await this.api.sendTypingIndicator(this.event.threadID, true);
        }
      } else {
        await new Promise((res) => setTimeout(res, typingDelay));
      }

      await this.api.sendMessage(message, this.event.threadID, this.event.messageID);
      await this.api.sendTypingIndicator(this.event.threadID, false);
    } catch (error) {
      console.error(error);
      try {
        await this.api.sendTypingIndicator(this.event.threadID, false);
      } catch {}
    }
  }

  async react(emoji) {
    if (!emoji) return;
    try {
      await this.api.setMessageReaction(emoji, this.event.messageID, true);
    } catch (error) {
      console.error(error);
    }
  }

  async unsend(messageID) {
    try {
      await this.api.unsendMessage(messageID || this.event.messageID);
    } catch (error) {
      console.error(error);
    }
  }
}