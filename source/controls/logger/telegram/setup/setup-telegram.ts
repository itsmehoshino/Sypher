import { Message } from "node-telegram-bot-api";
import messageHandler from "@sy-handler/handleCommand";

export default async function listener({
  bot,
}: {
  bot: SypherAI.CommandContext["bot"];
}) {
  bot.on("message", async (msg: Message) => {
    await messageHandler({ msg, bot });
  });
}
