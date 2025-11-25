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

  private get replyOptions() {
    return { reply_to_message_id: this.messageId };
  }

  async send(text: string, options?: TelegramBot.SendMessageOptions) {
    try {
      return await this.bot.sendMessage(this.chatId, text, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        ...options,
      });
    } catch (error) {
      console.error("send error:", error);
    }
  }

  async reply(text: string, options?: TelegramBot.SendMessageOptions) {
    return this.send(text, { reply_to_message_id: this.messageId, ...options });
  }

  async upload(config: {
    type: "photo" | "audio" | "voice" | "video" | "animation" | "document" | "mediagroup";
    file: string | Buffer | NodeJS.ReadableStream | TelegramBot.InputMedia[];
    options?: any;
  }) {
    const { type, file, options = {} } = config;
    const opts = { ...this.replyOptions, ...options };

    try {
      switch (type) {
        case "photo":
          return await this.bot.sendPhoto(this.chatId, file as any, opts);
        case "audio":
          return await this.bot.sendAudio(this.chatId, file as any, opts);
        case "voice":
          return await this.bot.sendVoice(this.chatId, file as any, opts);
        case "video":
          return await this.bot.sendVideo(this.chatId, file as any, opts);
        case "animation":
          return await this.bot.sendAnimation(this.chatId, file as any, opts);
        case "document":
          return await this.bot.sendDocument(this.chatId, file as any, opts);
        case "mediagroup":
          return await this.bot.sendMediaGroup(this.chatId, file as TelegramBot.InputMedia[], opts);
        default:
          throw new Error(`Unknown upload type: ${type}`);
      }
    } catch (error) {
      console.error(`upload(${type}) failed:`, error);
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
      console.error("edit error:", error);
    }
  }

  async delete(timeout: number = 0) {
    if (timeout > 0) {
      setTimeout(async () => {
        try { await this.bot.deleteMessage(this.chatId, this.messageId!); } catch {}
      }, timeout * 1000);
    } else {
      try { await this.bot.deleteMessage(this.chatId, this.messageId!); } catch {}
    }
  }
}
