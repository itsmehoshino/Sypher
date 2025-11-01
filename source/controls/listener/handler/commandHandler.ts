import Response from "./chat/response";
import fonts from "@sy-styler/fonts";

export default async function commandHandler({ api, event }) {
  const parts = event.body.split(" ").filter(Boolean);
  let [commandName = "", ...args] = parts;

  const config = globalThis.Sypher.config;
  const mainPrefix = config.prefix;
  const subPrefixes = Array.isArray(config.subprefix) ? config.subprefix : [];

  let isValidPrefix = false;
  let cleanedCommandName = commandName;

  if (commandName.startsWith(mainPrefix)) {
    isValidPrefix = true;
    cleanedCommandName = commandName.replace(mainPrefix, "").toLowerCase();
  } else {
    for (const subPrefix of subPrefixes) {
      if (commandName.startsWith(subPrefix)) {
        isValidPrefix = true;
        cleanedCommandName = commandName.replace(subPrefix, "").toLowerCase();
        break;
      }
    }
  }

  if (!isValidPrefix) return;

  commandName = cleanedCommandName;

  const response = new Response(api, event);
  const command = globalThis.Sypher.commands.get(commandName);

  if (command && typeof command.cooldowns === "number" && command.cooldowns > 0) {
    const cooldownKey = `${event.senderID}_${commandName}`;
    const now = Date.now();
    const lastUsed = globalThis.Sypher.cooldowns.get(cooldownKey) || 0;
    const cooldownMs = command.cooldowns * 1000;

    if (now - lastUsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - (now - lastUsed)) / 1000);
      await response.send(`⏳ Please wait **${remaining}s** before using this command again.`);
      await response.react("⏳");
      return;
    }

    globalThis.Sypher.cooldowns.set(cooldownKey, now);
  }
  
  if (config.maintenance) {
    const allowedUsers = [
      ...config.developers,
      ...config.administrators,
      ...config.moderators,
    ];
    if (!allowedUsers.includes(event.senderID)) {
      await response.send("The bot is currently under maintenance. Please try again later.");
      await response.react("👩‍🔧");
      return;
    }
  }

  if (command && command.onCall) {
    try {
      await command.onCall({ api, event, args, response, fonts });
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      if (error instanceof Error) {
        await response.send(`Failed to execute command '${commandName}'. If you are the developer, please fix your code. \n\n${error.stack}`);
      } else {
        await response.send(`Failed to execute command '${commandName}'. An unexpected error occurred.`);
      }
    }
  } else {
    await response.send(`Command used doesn't **exist**.`);
    await response.react("❓");
  }
}