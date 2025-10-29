import os from "os";

const command: SypherAI.Command = {
  name: "uptime",
  usage: "uptime",
  author: "Francis Loyd Raval",
  aliases: ["status", "stats", "botinfo"],
  description: "Shows real-time bot uptime and system information",

  async onCall({ response, fonts }) {
    const uptimeSeconds = process.uptime();
    const uptime = formatUptime(uptimeSeconds);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const processMem = process.memoryUsage();
    const rss = formatBytes(processMem.rss);
    const heapUsed = formatBytes(processMem.heapUsed);
    const heapTotal = formatBytes(processMem.heapTotal);

    const platform = `${os.platform()} ${os.arch()} (${os.release()})`;
    const cpu = `${os.cpus()[0].model.trim()} (${os.cpus().length} cores)`;
    const nodeVersion = process.version;
    const pid = process.pid;

    const info = [
      `${fonts.bold("Bot Uptime")}: ${uptime}`,
      "",
      `${fonts.bold("System")}`,
      `• Platform: ${platform}`,
      `• CPU: ${cpu}`,
      `• Node.js: ${nodeVersion}`,
      `• PID: ${pid}`,
      "",
      `${fonts.bold("Memory (RAM)")}`,
      `• Total: ${formatBytes(totalMem)}`,
      `• Used: ${formatBytes(usedMem)} (${((usedMem / totalMem) * 100).toFixed(1)}%)`,
      `• Free: ${formatBytes(freeMem)}`,
      "",
      `${fonts.bold("Process Memory")}`,
      `• RSS: ${rss}`,
      `• Heap Used: ${heapUsed}`,
      `• Heap Total: ${heapTotal}`,
    ].join("\n");

    return await response.send(info.trim());
  },
};

function formatUptime(seconds: number): string {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  }

  if (parts.length > 1) {
    const last = parts.pop()!;
    parts.push(`and ${last}`);
  }

  return parts.join(parts.length > 2 ? ", " : " ");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default command;