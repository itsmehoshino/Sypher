const command: SypherAI.Command = {
  name: "help",
  usage: "help [command | page number]",
  author: "Francis Loyd Raval",
  aliases: ["h", "?", "menu"],
  description: "Displays a list of available commands",
  async onCall({ response, args, fonts }) {
    if (args.length > 0 && isNaN(Number(args[0]))) {
      const commandName = args[0].toLowerCase();
      const command = globalThis.Sypher.commands.get(commandName);

      if (!command) {
        return await response.send(
          `No command found with the name "${commandName}". Use "help" to see all commands.`
        );
      }

      const { name, description, usage, aliases } = command;
      const helpText = [
        `**Command**: ${name}`,
        `**Description**: ${description || "No description available"}`,
        `**Usage**: ${usage || name}`,
        aliases && aliases.length > 0
          ? `**Aliases**: ${aliases.join(", ")}`
          : null,
      ]
        .filter((item) => item !== null)
        .join("\n");

      return await response.send(helpText);
    }

    const uniqueCommands = new Map();
    for (const [_, cmd] of globalThis.Sypher.commands) {
      if (!uniqueCommands.has(cmd.name)) {
        uniqueCommands.set(cmd.name, cmd);
      }
    }

    const sortedCommands = Array.from(uniqueCommands.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const commandsPerPage = 10;
    const totalCommands = sortedCommands.length;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    let page = 1;

    if (args.length > 0 && !isNaN(Number(args[0]))) {
      page = parseInt(String(args[0]), 10);
      if (page < 1 || page > totalPages) {
        return await response.send(
          `Invalid page number. Please use a number between 1 and ${totalPages}.`
        );
      }
    }

    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const paginatedCommands = sortedCommands.slice(startIndex, endIndex);

    const commandList = paginatedCommands
      .map(([name, cmd], index) => {
        return `${fonts.bold(`${startIndex + index + 1}.`)} ${name}\n  ${fonts.bold("Description")}: ${
          cmd.description || "No description available"
        }\n  ${fonts.bold("Usage")}: ${cmd.usage || name}`;
      })
      .join("\n\n");

    const helpText = [
      totalCommands > 0
        ? `${commandList}\n\n**Page ${page} of ${totalPages}** (${totalCommands} commands total)`
        : "No commands loaded yet.",
    ]
      .filter((item) => item !== null)
      .join("\n");

    return await response.send(helpText);
  },
};

export default command;