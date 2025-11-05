import os from "os";
import { version as nodeVersion } from "process";

const command: SypherAI.Command = {
  name: "status",
  role: 0,
  usage: "uptime",
  author: "Francis Loyd Raval",
  aliases: ["uptime", "up", "stats", "botinfo", "info"],
  cooldowns: 5,
  description: "Displays comprehensive real-time bot and server information",
  category: "System",
  config: {
    maintenance: false,
    usePrefix: false,
    limiter: {
      isLimit: false,
      limitUsage: 0,
      time: 0
    }
  },
  async onCall({ response }) {
    const start = Date.now();

    const uptimeSeconds = process.uptime();
    const startedAt = new Date(Date.now() - uptimeSeconds * 1000).toLocaleString();

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const processMem = process.memoryUsage();
    const rss = formatBytes(processMem.rss);
    const heapUsed = formatBytes(processMem.heapUsed);
    const heapTotal = formatBytes(processMem.heapTotal);
    const external = formatBytes(processMem.external);
    const arrayBuffers = formatBytes(processMem.arrayBuffers);

    const platform = `${os.platform()} ${os.arch()} (${os.release()})`;
    const cpuModel = os.cpus()[0].model.trim();
    const cpuCores = os.cpus().length;
    const cpuUsage = os.loadavg();
    const nodeVer = nodeVersion;
    const pid = process.pid;

    const serverTime = new Date().toLocaleString("en-US", {
      timeZoneName: "short",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const ping = Date.now() - start;
    const botUptime = formatUptime(uptimeSeconds);
    const systemUptime = formatUptime(os.uptime());

    const info = [
      "**Bot Status**",
      `• **Uptime**: ${botUptime}`,
      `• **Started**: ${startedAt}`,
      `• **Ping**: ${ping}ms`,
      `• **Server Time**: ${serverTime}`,
      "",
      "**System**",
      `• **Platform**: ${platform}`,
      `• **CPU**: ${cpuModel} (${cpuCores} cores)`,
      `• **Load Avg (1/5/15)**: ${cpuUsage[0].toFixed(2)}, ${cpuUsage[1].toFixed(2)}, ${cpuUsage[2].toFixed(2)}`,
      `• **System Uptime**: ${systemUptime}`,
      `• **Node.js**: ${nodeVer}`,
      `• **PID**: ${pid}`,
      "",
      "**Memory (RAM)**",
      `• **Total**: ${formatBytes(totalMem)}`,
      `• **Used**: ${formatBytes(usedMem)} (${((usedMem / totalMem) * 100).toFixed(1)}%)`,
      `• **Free**: ${formatBytes(freeMem)}`,
      "",
      "**Process Memory**",
      `• **RSS**: ${rss}`,
      `• **Heap Used**: ${heapUsed} / ${heapTotal}`,
      `• **External**: ${external}`,
      `• **Array Buffers**: ${arrayBuffers}`,
      "",
      "**Environment**",
      `• **Hostname**: ${os.hostname()}`,
      `• **User**: ${os.userInfo().username}`,
      `• **Home Dir**: ${os.homedir()}`,
      `• **Temp Dir**: ${os.tmpdir()}`,
    ].join("\n");

    await response.send(info.trim());
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
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  if (parts.length > 1) {
    const last = parts.pop()!;
    parts.push(`and ${last}`);
  }

  return parts.join(parts.length > 2 ? ", " : " ");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default command;