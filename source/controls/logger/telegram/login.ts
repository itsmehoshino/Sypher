import TelegramBot from 'node-telegram-bot-api';
import listener from './setup/setup-telegram';

const token = "8275524883:AAGzrLNnFIlTH7t0s3bg5owYEoipbfv7xxU";

const bot = new TelegramBot(token, { polling: false });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `👾 Konnichiwa! I'm Sypher, your multiplatform AI assistant. Begin by typing ${globalThis.Sypher.config.prefix}help to see my commands!`);
});

export default async function teleLogin() {
  await listener({ bot });
}
