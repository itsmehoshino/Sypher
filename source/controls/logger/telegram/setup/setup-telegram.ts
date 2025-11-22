import messageHandler from "@sy-handler/telegram/message";

export default async function listener({ bot }: { bot: SypherAI.CommandContext["bot"] }) {
  bot.on("message", async (msg: SypherAI.TeleBotContext["msg"]) => {
    await messageHandler({ msg, bot });
  });
}
