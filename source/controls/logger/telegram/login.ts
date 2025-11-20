import TelegramBot from 'node-telegram-bot-api';

const token = "";

const bot = new TelegramBot(token, { polling: true });

export default function teleLogin(){
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to Sypher.. Eyyy 6 7")
  })

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Nareceive na! Mwaps ...");
  })
}