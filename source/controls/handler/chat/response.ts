import TelegramBot, { Message } from "node-telegram-bot-api";

export default class Response {
  private bot: TelegramBot;
  private chatId: number;
  private messageId: number | undefined;

  constructor(bot: TelegramBot, msg: Message) {
    this.bot = bot;
    this.chatId = msg.chat.id;
    this.messageId = msg.message_id;
  }

  async send(text: string, options?: TelegramBot.SendMessageOptions) {
    try {
      const defaultOptions: TelegramBot.SendMessageOptions = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_to_message_id: this.messageId,
        ...options,
      };
      return await this.bot.sendMessage(this.chatId, text, defaultOptions);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  async edit(text: string, options?: TelegramBot.EditMessageTextOptions) {
    if (!this.messageId) return;
    try {
      return await this.bot.editMessageText(text, {
        chat_id: this.chatId,
        message_id: this.messageId,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        ...options,
      });
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  }

  async delete(timeout: number = 0) {
    if (timeout > 0) {
      setTimeout(async () => {
        try {
          await this.bot.deleteMessage(this.chatId, this.messageId!);
        } catch {}
      }, timeout * 1000);
    } else {
      try {
        await this.bot.deleteMessage(this.chatId, this.messageId!);
      } catch {}
    }
  }

  async reply(text: string, options?: TelegramBot.SendMessageOptions) {
    return this.send(text, { reply_to_message_id: this.messageId, ...options });
  }

  async success(text: string) {
    return this.send(`Success: ${text}`);
  }

  async error(text: string) {
    return this.send(`Error: ${text}`);
  }

  async info(text: string) {
    return this.send(`Info: ${text}`);
  }
}
