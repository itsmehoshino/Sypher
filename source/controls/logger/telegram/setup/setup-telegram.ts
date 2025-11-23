import messageHandler from "@sy-handler/handleCommand";

export default async function listener({
  bot,
}: {
  bot: SypherAI.CommandContext["bot"];
}) {
  bot.on("message", async (msg: SypherAI.TeleBotContext["msg"]) => {
    await messageHandler({ bot, msg }); 
  });
}