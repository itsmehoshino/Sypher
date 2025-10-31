import { evaluate } from "mathjs";

const command: SypherAI.Command = {
  name: "calc",
  usage: "calc <expression>",
  author: "Francis Loyd Raval",
  aliases: ["calculate", "math", "c"],
  description: "Powerful math calculator using mathjs",

  async onCall({ response, args, fonts }) {
    if (args.length === 0) {
      return await response.send(
        `**Usage**: ${this.usage}\n**Examples**:\n` +
        `• **calc** 2 + 3\n` +
        `• **calc** 2(3 + 1)\n` +
        `• **calc** 2^3\n` +
        `• **calc** sqrt(16)\n` +
        `• **calc** 5 * (2 + 3)\n` +
        `• **calc** sin(π/2)`
      );
    }

    const expression = args.join(" ");

    let result;
    try {
      result = evaluate(expression);
    } catch (error: any) {
      return await response.send(`Invalid expression: \`${expression}\``);
    }

    const output = [
      `**Input"**: \`${expression}\``,
      `**Result**: **${result}**`,
    ].join("\n");

    return await response.send(output);
  },
};

export default command;