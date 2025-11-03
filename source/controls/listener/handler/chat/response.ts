import { applyAutoFonts, stripCustomFonts, censorBadWords } from "@sy-patches/autofonts";
import * as fs from "fs";
import * as path from "path";

export default class Response {
  private api: any;
  private event: any;

  constructor(api: any, event: any) {
    this.api = api;
    this.event = event;
  }

  async send(message: string): Promise<boolean> {
    if (!message?.trim()) return false;

    const { cleaned: noCustom, hadCustom } = stripCustomFonts(message);
    const { censored, hadBadWords } = censorBadWords(noCustom);
    const styled = applyAutoFonts(censored);

    try {
      await this.api.sendMessage(styled, this.event.threadID, this.event.messageID);

      const warnings: string[] = [];
      if (hadCustom) {
        warnings.push("Custom Unicode fonts are not allowed. Use **bold**, *italic*, ||outline||, or ``sans``.");
      }
      if (hadBadWords) {
        warnings.push("Profanity is not allowed. Please keep it clean.");
      }
      if (warnings.length > 0) {
        const warningMsg = "Warning: " + warnings.join(" ");
        await this.api.sendMessage(warningMsg, this.event.threadID);
      }
      return true;
    } catch (err) {
      console.error("sendMessage error:", err);
      return false;
    }
  }

  async upload(message: string, attachmentPath: string): Promise<boolean> {
    if (!message?.trim() && !attachmentPath) return false;

    let styled = "";
    const warnings: string[] = [];

    if (message?.trim()) {
      const { cleaned: noCustom, hadCustom } = stripCustomFonts(message);
      const { censored, hadBadWords } = censorBadWords(noCustom);
      styled = applyAutoFonts(censored);

      if (hadCustom) {
        warnings.push("Custom Unicode fonts are not allowed. Use **bold**, *italic*, ||outline||, or ``sans``.");
      }
      if (hadBadWords) {
        warnings.push("Profanity is not allowed. Please keep it clean.");
      }
    }

    let attachmentStream: fs.ReadStream | null = null;
    try {
      const resolvedPath = path.resolve(attachmentPath);
      if (!fs.existsSync(resolvedPath)) {
        console.error(`Attachment not found: ${resolvedPath}`);
        return false;
      }
      attachmentStream = fs.createReadStream(resolvedPath);
    } catch (err) {
      console.error("Failed to read attachment:", err);
      return false;
    }

    try {
      await this.api.sendMessage(
        {
          body: styled,
          attachment: attachmentStream,
        },
        this.event.threadID, this.event.messageID
      );

      if (warnings.length > 0) {
        const warningMsg = "Warning: " + warnings.join(" ");
        await this.api.sendMessage(warningMsg, this.event.threadID);
      }

      return true;
    } catch (err) {
      console.error("sendAttachment error:", err);
      return false;
    }
  }

  async react(emoji: string): Promise<boolean> {
    if (!emoji) return false;
    try {
      await this.api.setMessageReaction(emoji, this.event.messageID, true);
      return true;
    } catch (err) {
      console.error("react error:", err);
      return false;
    }
  }
}