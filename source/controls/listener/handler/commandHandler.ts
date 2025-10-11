import Response from "./chat/response";

export default async function commandHandler({ api, event }) {
  const parts = event.body.split(" ").filter(Boolean);
  let [commandName = "", ...args] = parts;

  const config = globalThis.Sypher.config;
  const prefix = config.prefix;
  if (!commandName.startsWith(prefix)) return;

  commandName = commandName.replace(prefix, "").toLowerCase();

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
      await command.onCall({ api, event, args, response });
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      await response.send("⚠️ An error occurred while executing that command.");
    }
  } else {
    await response.send("❓ Unknown command!");
    await response.react("❓");
  }
}