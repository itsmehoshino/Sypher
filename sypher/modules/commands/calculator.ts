import { evaluate } from "mathjs";

const command: SypherAI.Command = {
  name: "calc",
  role: 0,
  usage: "calc <expression>",
  author: "Francis Loyd Raval",
  aliases: ["calculate", "math", "c"],
  cooldowns: 5,
  description: "Powerful math calculator using mathjs",
  category: "Educational",
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
      await response.send(
        `**Usage**: ${this.usage}\n**Examples**:\n` +
          `• **calc** 2 + 3\n` +
          `• **calc** 2(3 + 1)\n` +
          `• **calc** 2^3\n` +
          `• **calc** sqrt(16)\n` +
          `• **calc** sin(pi/4)\n` +
          `• **calc** 5 km to meters`
      );
      return;
    }

    const expression = args.join(" ");

    if (expression.length > 200) {
      await response.send("Error: Expression too long. Max 200 characters.");
      return;
    }

    let result: any;
    try {
      result = evaluate(expression);
    } catch {
      await response.send(`Error: Invalid expression: \`${expression}\``);
      return;
    }

    const formatted =
      typeof result === "number" ? result.toLocaleString() : String(result);

    await response.send(
      `**Input**: \`${expression}\`\n**Result**: **${formatted}**`
    );
  },
};

export default command;