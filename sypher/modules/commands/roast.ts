import roasts from "@sy-patches/roast";

const command: SypherAI.Command = {
  name: "roast",
  role: 0,
  usage: "roast",
  author: "Francis Loyd Raval",
  aliases: ["burn", "insult"],
  cooldowns: 5,
  description: "Delivers a random ultimate savage roast",
  category: "Fun",
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
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    await response.send(roast);
  },
};

export default command;