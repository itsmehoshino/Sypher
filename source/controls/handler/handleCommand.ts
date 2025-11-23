import TelegramBot, { Message } from "node-telegram-bot-api";
import Response from "./chat/response";
import { log } from "@sy-log";

export default async function messageHandler(msg: Message, bot: TelegramBot) {
  try {
    if (!msg.text) return;

    const config = globalThis.Sypher.config;
    const mainPrefix = config.prefix || "!";
    const subPrefixes = Array.isArray(config.subprefix) ? config.subprefix : [];

    const parts = msg.text.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return;

    let [rawCommand = "", ...args] = parts;
    let commandName = rawCommand.toLowerCase();

    let isValidPrefix = false;

    if (commandName.startsWith(mainPrefix)) {
      commandName = commandName.slice(mainPrefix.length);
      isValidPrefix = true;
    } else {
      for (const sp of subPrefixes) {
        if (commandName.startsWith(sp)) {
          commandName = commandName.slice(sp.length);
          isValidPrefix = true;
          break;
        }
      }
    }

    if (!isValidPrefix || !commandName) return;

    const senderID = msg.from?.id.toString()!;
    const response = new Response(bot, msg);
    const command = globalThis.Sypher.commands.get(commandName);

    const { developers = [], administrators = [], moderators = [] } = config;

    const isDev = developers.includes(senderID);
    const isAdmin = administrators.includes(senderID);
    const isMod = moderators.includes(senderID);
    const isStaff = isDev || isAdmin || isMod;

    const checkPermission = (required: number = 0) => {
      if (required === 0) return true;
      if (required === 1) return isDev;
      if (required === 2) return isDev || isAdmin;
      if (required === 3) return isDev || isAdmin || isMod;
      if (required === 4) return isStaff;
      return false;
    };

    if (!command) {
      await response.send(`Command **${commandName}** doesn't exist.`);
      return;
    }

    if (command.role !== undefined && !checkPermission(command.role)) {
      const roles = { 0: "Everyone", 1: "Developer", 2: "Admin", 3: "Moderator", 4: "Staff" };
      const needed = roles[command.role] || "Restricted";
      const current = isDev ? "Developer" : isAdmin ? "Administrator" : isMod ? "Moderator" : "User";

      await response.send(`You don't have permission.\nRequired: **${needed}**\nYour role: **${current}**`);
      return;
    }

    if (typeof command.cooldowns === "number" && command.cooldowns > 0) {
      const key = `${senderID}:${commandName}`;
      const now = Date.now();
      const last = globalThis.Sypher.cooldowns.get(key) || 0;
      const wait = command.cooldowns * 1000;

      if (now - last < wait) {
        const left = Math.ceil((wait - (now - last)) / 1000);
        await response.send(`Please wait **${left}s** before using this command again.`);
        return;
      }
      globalThis.Sypher.cooldowns.set(key, now);
    }

    if (config.maintenance && !isStaff) {
      await response.send("Bot is under **maintenance**.\nOnly staff can use commands.");
      return;
    }

    const context = {
      bot,
      msg,
      response,
      args
    };

    try {
      log("CMD", `[TG] ${msg.from?.username || msg.from?.first_name || senderID} → ${commandName}`);
      await command.onCall(context);
    } catch (error) {
      log("ERROR", `Command '${commandName}' failed → ${error instanceof Error ? error.stack : error}`);
      await response.send(`Command **${commandName}** crashed.\n\n\`\`\`${error instanceof Error ? error.stack : error}\`\`\``);
    }
  } catch (err) {
    log("FATAL", `messageHandler error: ${err instanceof Error ? err.stack : err}`);
  }
}