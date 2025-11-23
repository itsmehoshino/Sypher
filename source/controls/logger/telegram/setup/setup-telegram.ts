import messageHandler from "@sy-handler/handleCommand";

export default async function listener({
  bot,
}: {
  bot: SypherAI.CommandContext["bot"];
}) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    messageHandler(msg, bot);
  });
}
