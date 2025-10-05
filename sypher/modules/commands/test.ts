const command = {
  name: "eval",
  usage: "!eval <code>",
  author: "@itsmefranz",
  aliases: ["ev", "run", "execute"],
  description: "Evaluates JavaScript code and returns the result.",
  async onCall({ response, args, api, event }) {
    try {
      if (!args || args.length === 0) {
        return await response.send("Please provide some code to evaluate.");
      }

      const code = args.join(" ");

      // Prevent dangerous code from running
      if (code.includes("process") || code.includes("require") || code.includes("import")) {
        return await response.send("❌ Access to system-level code is not allowed.");
      }

      // Evaluate the code safely
      let result;
      try {
        result = await eval(`(async () => { ${code} })()`);
      } catch (err) {
        result = err instanceof Error ? err.message : String(err);
      }

      // Stringify objects neatly
      if (typeof result === "object") {
        result = JSON.stringify(result, null, 2);
      }

      await response.send(`✅ **Result:**\n\`\`\`js\n${result}\n\`\`\``);
      await response.react("⚡");
    } catch (error) {
      console.error(`[ERROR] Eval command failed: ${error instanceof Error ? error.message : String(error)}`);
      await response.send("❌ An error occurred while evaluating the code.");
    }
  },
};

export default command;