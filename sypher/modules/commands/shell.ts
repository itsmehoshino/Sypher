import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const command: SypherAI.Command = {
  name: "shell",
  role: 4,
  usage: "shell <command>",
  author: "Francis Loyd Raval",
  aliases: ["sh", "run", "exec"],
  cooldowns: 30,
  description: "Executes a system shell command and returns the output",
  category: "Staffs",
  config: {
    maintenance: false,
    usePrefix: false,
    limiter: {
      isLimit: false,
      limitUsage: 0,
      time: 0
    }
  },
  async onCall({ response, args }) {
    if (args.length === 0) {
      await response.send(`**Usage**: ${this.usage}\n**Example**: shell dir`);
      return;
    }

    const cmd = args.join(" ");

    try {
      const { stdout, stderr } = await execAsync(cmd, { timeout: 10000 });

      const output = stdout || stderr || "(no output)";
      const lines = output.trim().split("\n");
      const maxLines = 30;
      const truncated =
        lines.length > maxLines
          ? lines.slice(0, maxLines).join("\n") +
            `\n... (truncated ${lines.length - maxLines} lines)`
          : output;

      await response.send(`**Output**\n\`\`\`\n${truncated}\n\`\`\``);
    } catch (error: any) {
      const msg = error.killed
        ? "Command timed out after 10 seconds."
        : error.stderr?.trim() || error.message || "Unknown error";

      await response.send(`**Error:** \`${cmd}\`\n\`\`${msg}\`\``);
    }
  },
};

export default command;