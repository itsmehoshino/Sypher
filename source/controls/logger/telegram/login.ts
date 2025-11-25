import TelegramBot, { Message } from 'node-telegram-bot-api';
import listener from './setup/setup-telegram';
import { execSync } from 'child_process';

const TOKEN = process.env.TELEGRAM_TOKEN ?? process.env.TOKEN;

if (!TOKEN) {
  console.error('TELEGRAM_TOKEN is missing in environment!');
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
        (line.includes('telegram') || line.includes('login.ts') || line.includes('login.js'))
      ) {
        const pid = Number(line.trim().split(/\s+/)[1]);
        if (pid && pid !== currentPid && pid > 1) {
          console.log(`Killing old bot instance PID ${pid}`);
          try {
            process.kill(pid, 'SIGKILL');
          } catch {
            /* ignore */
          }
        }
      }
    }
  } catch {
    /* ps command not available only on *nix – safe to ignore on Windows */
  }
}

export default async function teleLogin() {
  killOldInstances();

  const bot = new TelegramBot(TOKEN, { polling: true });

  bot.on('polling_error', (error) => {
    if (error.message.includes('409')) {
      console.log('Old polling session terminated by Telegram – now running fresh');
    } else {
      console.error('Polling error:', error.message);
    }
  });

  bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    const prefix = (globalThis as any).Sypher?.config?.prefix || '!';

    bot.sendMessage(
      chatId,
      `💫 Konnichiwa! I'm Sypher, your multiplatform AI assistant.\n\nType <code>${prefix}help</code> to see all commands!`,
      { parse_mode: 'HTML' }
    );
  });

  try {
    await listener({ bot });
    console.log('Sypher Telegram Bot is online and running exclusively!');
  } catch (err) {
    console.error('Failed to initialize bot listeners:', err);
    process.exit(1);
  }

  const shutdown = () => {
    bot.stopPolling().finally(() => process.exit(0));
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
