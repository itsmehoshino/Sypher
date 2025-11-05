const command: SypherAI.Command = {
  name: "help",
  role: 0,
  usage: "help [command | page number]",
  author: "Francis Loyd Raval",
  aliases: ["h", "?", "menu"],
  cooldowns: 5,
  description: "Displays a list of available commands",
  category: "Utility",
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
    const commands = globalThis.Sypher.commands;

    if (args.length > 0 && isNaN(Number(args[0]))) {
      const cmdName = args[0].toLowerCase();
      const cmd = commands.get(cmdName);

      if (!cmd) {
        await response.send(
          `No command found: \`${cmdName}\`. Use \`help\` to see all commands.`
        );
        return;
      }

      const aliasText = cmd.aliases?.length
        ? `**Aliases**: ${cmd.aliases.join(", ")}`
        : "";

      const helpText = [
        `**Command**: ${cmd.name}`,
        `**Description**: ${cmd.description || "No description"}`,
        `**Usage**: ${cmd.usage || cmd.name}`,
        aliasText,
      ]
        .filter(Boolean)
        .join("\n");

      await response.send(helpText);
      return;
    }

    const unique = new Map<string, SypherAI.Command>();
    for (const cmd of commands.values()) {
      if (!unique.has(cmd.name)) unique.set(cmd.name, cmd);
    }

    const sorted = Array.from(unique.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    const perPage = 10;
    const total = sorted.length;
    const pages = Math.ceil(total / perPage);
    let page = 1;

    if (args.length > 0 && !isNaN(Number(args[0]))) {
      page = Math.max(1, Math.min(pages, parseInt(args[0], 10)));
      if (page < 1 || page > pages) {
        await response.send(
          `Invalid page. Use 1–${pages}.`
        );
        return;
      }
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageCommands = sorted.slice(start, end);

    const list = pageCommands
      .map(
        ([name, cmd], i) =>
          `**${start + i + 1}.** **${name}**\n  ${cmd.description || "No description"}\n  \`${cmd.usage || name}\``
      )
      .join("\n\n");

    const footer = total > 0
      ? `\n\n**Page ${page}/${pages}** • ${total} command${total === 1 ? "" : "s"}`
      : "No commands available.";

    await response.send(total > 0 ? list + footer : footer);
  },
};

export default command;