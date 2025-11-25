import TelegramBot, { Message } from 'node-telegram-bot-api';
import listener from './setup/setup-telegram';
import { execSync } from 'child_process';

const TOKEN = process.env.TELEGRAM_TOKEN ?? process.env.TOKEN;
if (typeof TOKEN !== 'string' || TOKEN.trim() === '') {
  console.error('ERROR: TELEGRAM_TOKEN is missing or empty');
  process.exit(1);
}

function killOldInstances() {
  try {
    const output = execSync('ps aux', { encoding: 'utf-8' });
    const lines = output.split('\n');
    const currentPid = process.pid;

    for (const line of lines) {
      if (
        line.includes('node') &&
        (line.includes('telegram') || line.includes('login.ts') || line.includes('login.js'))
      ) {
        const pid = Number(line.trim().split(/\s+/)[1]);
        if (pid && pid !== currentPid && pid > 1) {
          try { process.kill(pid, 'SIGKILL'); } catch {}
        }
      }
    }
  } catch {}
}

export default async function teleLogin() {
  killOldInstances();

  const bot = new TelegramBot(TOKEN, { polling: true });

  bot.on('polling_error', (error) => {
    if (error.message.includes('409')) return;
    console.error('Polling error:', error.message);
  });

  bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    const prefix = (globalThis as any).Sypher?.config?.prefix || '!';
    bot.sendMessage(
      chatId,
      `Konnichiwa! I'm Sypher.\n\nType <code>${prefix}help</code> for commands!`,
      { parse_mode: 'HTML' }
    );
  });

  try {
    await listener({ bot });
  } catch (err) {
    console.error('Bot startup failed:', err);
    process.exit(1);
  }

  const shutdown = () => bot.stopPolling().finally(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
