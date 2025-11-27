import guitars from "@sy-patches/guitar";

const command: SypherAI.Command = {
  name: "guitar",
  role: 0,
  usage: "guitar",
  author: "Francis Loyd Raval",
  aliases: ["guitarsolo", "riff", "shred", "g"],
  cooldowns: 5,
  description: "Sends a random face-melting guitar solo video",
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
    const guitar = guitars[Math.floor(Math.random() * guitars.length)];
    await response.upload({ type: "video", file: guitar, options: { caption: "FACE-MELTING GUITAR SOLO" } });
  },
};

export default command;
