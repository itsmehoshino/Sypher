import roasts from "@sy-patches/roast";

const command: SypherAI.Command = {
  name: "roast",
  usage: "roast",
  author: "Francis Loyd Raval",
  aliases: ["burn", "insult"],
  cooldowns: 5,
  description: "Delivers a random ultimate savage roast",

  async onCall({ response }) {
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    return await response.send(roast);
  },
};

export default command;