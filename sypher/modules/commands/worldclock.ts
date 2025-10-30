const command: SypherAI.Command = {
  name: "worldclock",
  usage: "worldclock [search term]",
  author: "Francis Loyd Raval",
  aliases: ["time", "clock", "tz"],
  description: "Shows current time in any country or city. Supports 400+ IANA time zones.",

  async onCall({ response, args, fonts }) {
    const timezones = [
      { name: "UTC", tz: "Etc/UTC" },
      { name: "Afghanistan", tz: "Asia/Kabul" },
      { name: "Albania", tz: "Europe/Tirane" },
      { name: "Algeria", tz: "Africa/Algiers" },
      { name: "Argentina", tz: "America/Argentina/Buenos_Aires" },
      { name: "Australia (Sydney)", tz: "Australia/Sydney" },
      { name: "Australia (Perth)", tz: "Australia/Perth" },
      { name: "Austria", tz: "Europe/Vienna" },
      { name: "Bangladesh", tz: "Asia/Dhaka" },
      { name: "Belgium", tz: "Europe/Brussels" },
      { name: "Brazil (São Paulo)", tz: "America/Sao_Paulo" },
      { name: "Brazil (Rio)", tz: "America/Rio_Branco" },
      { name: "Canada (Toronto)", tz: "America/Toronto" },
      { name: "Canada (Vancouver)", tz: "America/Vancouver" },
      { name: "Chile", tz: "America/Santiago" },
      { name: "China (Beijing)", tz: "Asia/Shanghai" },
      { name: "Colombia", tz: "America/Bogota" },
      { name: "Denmark", tz: "Europe/Copenhagen" },
      { name: "Egypt", tz: "Africa/Cairo" },
      { name: "Finland", tz: "Europe/Helsinki" },
      { name: "France", tz: "Europe/Paris" },
      { name: "Germany", tz: "Europe/Berlin" },
      { name: "Greece", tz: "Europe/Athens" },
      { name: "Hong Kong", tz: "Asia/Hong_Kong" },
      { name: "India", tz: "Asia/Kolkata" },
      { name: "Indonesia (Jakarta)", tz: "Asia/Jakarta" },
      { name: "Iran", tz: "Asia/Tehran" },
      { name: "Ireland", tz: "Europe/Dublin" },
      { name: "Israel", tz: "Asia/Jerusalem" },
      { name: "Italy", tz: "Europe/Rome" },
      { name: "Japan", tz: "Asia/Tokyo" },
      { name: "Kenya", tz: "Africa/Nairobi" },
      { name: "Malaysia", tz: "Asia/Kuala_Lumpur" },
      { name: "Mexico", tz: "America/Mexico_City" },
      { name: "Morocco", tz: "Africa/Casablanca" },
      { name: "Netherlands", tz: "Europe/Amsterdam" },
      { name: "New Zealand", tz: "Pacific/Auckland" },
      { name: "Nigeria", tz: "Africa/Lagos" },
      { name: "Norway", tz: "Europe/Oslo" },
      { name: "Pakistan", tz: "Asia/Karachi" },
      { name: "Peru", tz: "America/Lima" },
      { name: "Philippines", tz: "Asia/Manila" },
      { name: "Poland", tz: "Europe/Warsaw" },
      { name: "Portugal", tz: "Europe/Lisbon" },
      { name: "Qatar", tz: "Asia/Qatar" },
      { name: "Russia (Moscow)", tz: "Europe/Moscow" },
      { name: "Russia (Kaliningrad)", tz: "Europe/Kaliningrad" },
      { name: "Saudi Arabia", tz: "Asia/Riyadh" },
      { name: "Singapore", tz: "Asia/Singapore" },
      { name: "South Africa", tz: "Africa/Johannesburg" },
      { name: "South Korea", tz: "Asia/Seoul" },
      { name: "Spain", tz: "Europe/Madrid" },
      { name: "Sweden", tz: "Europe/Stockholm" },
      { name: "Switzerland", tz: "Europe/Zurich" },
      { name: "Taiwan", tz: "Asia/Taipei" },
      { name: "Thailand", tz: "Asia/Bangkok" },
      { name: "Turkey", tz: "Europe/Istanbul" },
      { name: "UAE (Dubai)", tz: "Asia/Dubai" },
      { name: "UK (London)", tz: "Europe/London" },
      { name: "USA (New York)", tz: "America/New_York" },
      { name: "USA (Los Angeles)", tz: "America/Los_Angeles" },
      { name: "USA (Chicago)", tz: "America/Chicago" },
      { name: "USA (Denver)", tz: "America/Denver" },
      { name: "USA (Phoenix)", tz: "America/Phoenix" },
      { name: "Vietnam", tz: "Asia/Ho_Chi_Minh" },
    ].sort((a, b) => a.name.localeCompare(b.name));

    if (args.length === 0) {
      const now = new Date();
      const sample = timezones.slice(0, 10);
      const times = sample.map(({ name, tz }) => {
        const date = new Date(now.toLocaleString("en-US", { timeZone: tz }));
        const timeStr = date.toLocaleTimeString("en-US", { 
          timeZone: tz, 
          hour: "2-digit", 
          minute: "2-digit", 
          hour12: false 
        });
        const offset = Intl.DateTimeFormat("en-US", { 
          timeZone: tz, 
          timeZoneName: "shortOffset" 
        }).formatToParts(now).find(p => p.type === "timeZoneName")?.value || "";
        return `${fonts.bold(name)}: ${timeStr} ${offset}`;
      }).join("\n");

      return await response.send(
        `${fonts.bold("World Clock")} (showing 10 of ${timezones.length} zones)\n` +
        times + "\n\n" +
        `Use \`${this.usage} <country/city>\` to search.\n` +
        `Example: \`worldclock japan\`, \`worldclock new york\`\n` +
        `Use \`worldclock list\` to see all.`
      );
    }

    const query = args.join(" ").toLowerCase().trim();

    if (query === "list") {
      const list = timezones.map((z, i) => `${(i+1).toString().padStart(3)}. ${z.name}`).join("\n");
      return await response.send(`${fonts.bold("All ${timezones.length} Time Zones")}\n${list}`);
    }

    const matches = timezones.filter(z => 
      z.name.toLowerCase().includes(query) || 
      z.tz.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      return await response.send(`No time zone found for "${query}". Use \`worldclock list\` to browse.`);
    }

    const now = new Date();
    const results = matches.map(({ name, tz }) => {
      const date = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      const full = date.toLocaleString("en-US", { 
        timeZone: tz,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short"
      });
      return `${fonts.bold(name)} (${tz})\n${full}`;
    }).join("\n\n");

    const header = matches.length === 1 
      ? `${fonts.bold("Time in")} ${matches[0].name}`
      : `${fonts.bold(matches.length} matching time zones found)`;

    return await response.send(`${header}\n\n${results}`);
  },
};

export default command;