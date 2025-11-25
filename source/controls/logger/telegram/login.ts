import TelegramBot, { Message } from 'node-telegram-bot-api';
import listener from './setup/setup-telegram';
import { execSync } from 'child_process';

const TOKEN = process.env.TELEGRAM_TOKEN || process.env.TOKEN;

if (!TOKEN) {
  console.error('TELEGRAM_TOKEN is missing!');
  process.exit(1);
}

function killOldInstances() {
  try {
    const ps = execSync('ps aux', { encoding: 'utf-8' });
    const lines = ps.split('\n');
    const currentPid = process.pid;

    for (const line of lines) {
      if (
        line.includes('node') &&
        (line.includes('telegram') || line.includes('login.ts') || line.includes('login.js')) &&
        line.includes('polling')
      ) {
        const pid = parseInt(line.trim().split(/\s+/)[1]);
        if (pid && pid !== currentPid && pid > 1) {
          console.log(`Killing old instance PID ${pid}`);
          try { process.kill(pid, 'SIGKILL'); } catch {}
        }
      }
    }
  } catch {}
}

killOldInstances();

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('polling_error', (error) => {
  if (error.message.includes('409')) {
    console.log('Old session terminated. Running fresh!');
  } else {
    console.error('Polling error:', error.message);
  }
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

async function start() {
  try {
    await listener({ bot });
    console.log('Sypher Telegram Bot is running!');
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

start();

process.on('SIGINT', () => bot.stopPolling);
process.on('SIGTERM', () => bot.stopPolling);
