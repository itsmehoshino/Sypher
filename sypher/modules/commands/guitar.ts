const command: SypherAI.Command = {
  name: "guitar",
  role: 0,
  usage: "guitar",
  author: "Francis Loyd Raval",
  aliases: ["guitarsolo", "riff", "shred", "g"],
  cooldowns: 5,
  description: "Sends a random face-melting MP4 guitar solo",
  category: "fun",
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
    response.reply("Teka TelegramBot bot to... diko pa alam pano gawan")
};

export default command;
        
