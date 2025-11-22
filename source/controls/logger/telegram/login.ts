import TelegramBot from 'node-telegram-bot-api';
import listener from './setup/setup-telegram';

const token = "8312411209:AAG2-0TnWpu0PTcaYJyIv59FM1XtSvX3L90";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `👾 Konnichiwa! I'm Sypher, your multiplatform AI assistant. Begin with by typing ${globalThis.Sypher.config.prefix}help to see my commands!`);
});

export default async function teleLogin() {
  await listener({ bot });
}