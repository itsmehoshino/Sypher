import { timezones } from "@sy-patches/timezones";

const ITEMS_PER_PAGE = 10;

const command: SypherAI.Command = {
  name: "worldclock",
  role: 0,
  usage: "worldclock [search term | list [page]]",
  author: "Francis Loyd Raval",
  aliases: ["time", "clock", "tz"],
  cooldowns: 5,
  description: "Shows current time in any country or city. Supports 150+ IANA time zones.",
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
    if (args.length === 0) {
      const now = new Date();
      const sample = timezones.slice(0, 10);
      const times = sample
        .map(({ name, tz }) => {
          const timeStr = now.toLocaleTimeString("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          const offset = Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            timeZoneName: "shortOffset",
          })
            .formatToParts(now)
            .find(p => p.type === "timeZoneName")?.value || "";
          return `**${name}**: ${timeStr} ${offset}`;
        })
        .join("\n");

      await response.send(
        `**World Clock** • Showing **10** of **${timezones.length}** zones\n\n` +
          times +
          `\n\n**Usage**: \`${this.usage}\`\n` +
          `**Examples**: \`worldclock japan\`, \`worldclock list 2\``
      );
      return;
    }

    const query = args.join(" ").toLowerCase().trim();

    if (query.startsWith("list")) {
      const pageArg = args[1];
      const page = pageArg && !isNaN(Number(pageArg)) ? parseInt(pageArg, 10) : 1;
      const totalPages = Math.ceil(timezones.length / ITEMS_PER_PAGE);

      if (page < 1 || page > totalPages) {
        await response.send(`Invalid page. Use 1–${totalPages}.`);
        return;
      }

      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageItems = timezones.slice(start, end);

      const list = pageItems
        .map((z, i) => `${String(start + i + 1).padStart(3, " ")}. ${z.name}`)
        .join("\n");

      await response.send(
        `**All Time Zones** • Page **${page}/${totalPages}** (${timezones.length} total)\n\`\`\`\n${list}\n\`\`\``
      );
      return;
    }

    const matches = timezones.filter(
      z => z.name.toLowerCase().includes(query) || z.tz.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      await response.send(`No time zone found for "**${query}**". Try \`worldclock list\`.`);
      return;
    }

    const now = new Date();
    const results = matches
      .map(({ name, tz }) => {
        const full = now.toLocaleString("en-US", {
          timeZone: tz,
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZoneName: "short",
        });
        return `**${name}** (${tz})\n${full}`;
      })
      .join("\n\n");

    const header =
      matches.length === 1
        ? `Current time in **${matches[0].name}**`
        : `**${matches.length}** matching time zone${matches.length > 1 ? "s" : ""}`;

    await response.send(`${header}\n\n${results}`);
  },
};

export default command;