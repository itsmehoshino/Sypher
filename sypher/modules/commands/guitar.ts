import { readdir } from "fs/promises";
import path from "path";

const GUITAR_FOLDER = path.resolve("./source/controls/patches/plugins/videos/guitar");

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
    try {
      const files = await readdir(GUITAR_FOLDER);
      const videos = files.filter(f => /\.(mp4|webm|mov|avi|mkv)$/i.test(f));

      if (videos.length === 0) {
        await response.send("No guitar videos found in the vault!");
        return;
      }

      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoPath = path.join(GUITAR_FOLDER, randomVideo);

      await response.upload({
        type: "video",
        file: videoPath,
        options: { caption: "FACE-MELTING GUITAR SOLO" }
      });
    } catch (error) {
      await response.send("Something went wrong while loading the guitar video.");
    }
  },
};

export default command;
