import messageHandler from "@sy-handler/telegram/message";

export default async function listener({ bot }){
  bot.on("message", (msg) => {
    await messageHandler(msg, bot);
  })
}