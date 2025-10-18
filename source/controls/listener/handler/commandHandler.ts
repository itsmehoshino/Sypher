import Response from "./chat/response";
import { cassMongo } from "@sy-database";

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

  if (config.maintenance) {
    const allowedUsers = [
      ...config.developers,
      ...config.administrators,
      ...config.moderators,
    ];
    if (!allowedUsers.includes(event.senderID)) {
      await response.send("🚧 The bot is currently under maintenance. Please try again later.");
      await response.react("🚧");
      return;
    }
  }

  if (command && command.onCall) {
    try {
      await command.onCall({ api, event, args, response, database: cassMongo });
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      await response.send("⚠️ An error occurred while executing that command.");
    }
  } else {
    await response.send("❓ Unknown command!");
    await response.react("❓");
  }
}