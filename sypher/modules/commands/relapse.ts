import { relapseCategories } from "@sy-patches/relapse-categories";

const categories = Object.keys(relapseCategories) as (keyof typeof relapseCategories)[];

const command: SypherAI.Command = {
  name: "relapse",
  role: 1,
  usage: "relapse",
  author: "Francis Loyd Raval",
  aliases: ["relapsing", "r"],
  cooldowns: 30,
  description: "Spams a 60-sec cinematic relapse (torpe / movingon / breakup / ghosting), 1 sec per line",
  category: "Developer",
  config: {
    maintenance: false,
    usePrefix: false,
    limiter: { isLimit: true, limitUsage: 1, time: 3 }
  },
  async onCall({ response }) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const lines = relapseCategories[category];

    for (const line of lines) {
      await response.send(line);
      await new Promise(r => setTimeout(r, 1000));
    }
  },
};

export default command;