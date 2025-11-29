import TelegramBot, { Message } from "node-telegram-bot-api";
import Response from "./chat/response";
import { log } from "@sy-log";

const ROLE_NAMES: Record<number, string> = {
  0: "Everyone",
  1: "Developer",
  2: "Admin",
  3: "Moderator",
  4: "Staff",
};

export default async function messageHandler(msg: Message, bot: TelegramBot) {
  try {
    if (!msg.text) return;

    const config = globalThis.Sypher.config;
    const mainPrefix = config.prefix || "!";
    const subPrefixes = Array.isArray(config.subprefix) ? config.subprefix : [];

    const text = msg.text.trim();
    const parts = text.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return;

    let rawTrigger = parts[0].toLowerCase();
    let hadValidPrefix = false;

    if (rawTrigger.startsWith(mainPrefix)) {
      rawTrigger = rawTrigger.slice(mainPrefix.length);
      hadValidPrefix = true;
    } else {
      for (const sp of subPrefixes) {
        if (rawTrigger.startsWith(sp)) {
          rawTrigger = rawTrigger.slice(sp.length);
          hadValidPrefix = true;
          break;
        }
      }
    }

    const command = globalThis.Sypher.commands.get(rawTrigger);
    if (!command) return;

    const usePrefix = command.config?.usePrefix;

    if (usePrefix === true && !hadValidPrefix) {
      await new Response(bot, msg).reply(
        `This command **requires** a prefix.\nUse: <code>${mainPrefix}${rawTrigger}</code>`
      );
      return;
    }

    if (usePrefix === false && hadValidPrefix) {
      await new Response(bot, msg).reply(
        `This command **does not require** a prefix.\nJust type: <code>${rawTrigger}</code>`
      );
      return;
    }

    const senderID = msg.from!.id.toString();
    const response = new Response(bot, msg);

    const { developers = [], administrators = [], moderators = [] } = config;
    const isDev = developers.includes(senderID);
    const isAdmin = administrators.includes(senderID);
    const isMod = moderators.includes(senderID);
    const isStaff = isDev || isAdmin || isMod;

    const checkPermission = (required: number = 0): boolean => {
      switch (required) {
        case 0: return true;
        case 1: return isDev;
        case 2: return isDev || isAdmin;
        case 3: return isDev || isAdmin || isMod;
        case 4: return isStaff;
        default: return false;
      }
    };

    if (command.role !== undefined && !checkPermission(command.role)) {
      const needed = ROLE_NAMES[command.role] ?? "Restricted";
      const current = isDev ? "Developer" : isAdmin ? "Administrator" : isMod ? "Moderator" : "User";
      await response.reply(`You don't have permission.\nRequired: **${needed}**\nYour role: **${current}**`);
      return;
    }

    if (command.config?.maintenance === true) {
      await response.reply(`**${rawTrigger}** is currently under maintenance or development.\nPlease try again later.`);
      return;
    }

    const limiter = command.config?.limiter;

    if (limiter?.isLimit === true && limiter.limitUsage > 0 && limiter.time > 0) {
      const key = `limit_${senderID}_${rawTrigger}`;
      const now = Date.now();

      let data = globalThis.Sypher.usageLimits.get(key) as
        | { count: number; resetAt: number }
        | undefined;

      if (!data || now >= data.resetAt) {
        data = { count: 1, resetAt: now + limiter.time * 24 * 60 * 60 * 1000 };
        globalThis.Sypher.usageLimits.set(key, data);
      } else if (data.count >= limiter.limitUsage) {
        const timeLeft = data.resetAt - now;
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 *1000)) / (60 *1000));

        let str = "";
        if (days > 0) str += `${days} day${days > 1 ? "s" : ""} `;
        if (hours > 0) str += `${hours} hour${hours > 1 ? "s" : ""} `;
        if (minutes > 0 || str === "") str += `${minutes} minute${minutes > 1 ? "s" : ""}`;

        await response.send(
          `You've used up all **${limiter.limitUsage}** attempts for **${rawTrigger}**.\n` +
          `Come back in **${str.trim()}**`
        );
        return;
      } else {
        data.count += 1;
        globalThis.Sypher.usageLimits.set(key, data);
      }
    }
    else if (typeof command.cooldowns === "number" && command.cooldowns > 0) {
      const key = `${senderID}:${rawTrigger}`;
      const now = Date.now();
      const last = globalThis.Sypher.cooldowns.get(key) ?? 0;
      const wait = command.cooldowns * 1000;

      if (now - last < wait) {
        const left = Math.ceil((wait - (now - last)) / 1000);
        await response.reply(`Please wait **${left}s** before using this command again.`);
        return;
      }
      globalThis.Sypher.cooldowns.set(key, now);
    }

    if (config.maintenance && !isStaff) {
      await response.reply("Bot is under **maintenance**.\nOnly staff can use commands.");
      return;
    }

    const args = hadValidPrefix ? parts.slice(1) : parts.slice(1);

    const context: SypherAI.CommandContext = { bot, msg, response, args };

    try {
      log("CMD", `[TG] ${msg.from?.username || msg.from?.first_name || senderID} → ${rawTrigger}`);
      await command.onCall(context);
    } catch (error) {
      log("ERROR", `Command '${rawTrigger}' failed → ${error instanceof Error ? error.stack : error}`);
      await response.reply(
        `Command **${rawTrigger}** crashed.\n\n\`\`\`${error instanceof Error ? error.stack : String(error)}\`\`\``
      );
    }
  } catch (err) {
    log("FATAL", `messageHandler error: ${err instanceof Error ? err.stack : err}`);
  }
}
