export default class Response {
  private api: any;
  private event: any;

  constructor(api: any, event: any) {
    this.api = api;
    this.event = event;
  }

  async send(message: string) {
    if (!message) return;
    try {
      await this.api.sendMessage(message, this.event.threadID, this.event.messageID);
    } catch (error) {
      console.error(error);
    }
  }

  async react(emoji: string) {
    if (!emoji) return;
    try {
      await this.api.setMessageReaction(emoji, this.event.messageID, true);
    } catch (error) {
      console.error(error);
    }
  }
}