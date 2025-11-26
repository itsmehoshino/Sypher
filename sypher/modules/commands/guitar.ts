import { readdir } from "fs/promises";
import path from "path";

const GUITAR_FOLDER = path.resolve("./source/controls/patches/plugins/videos/guitar");

const command = {
  name: "guitar",
  aliases: ["guitarsolo", "shred", "riff", "g"],
  role: 0,
  cooldowns: 5,
  description: "Sends a random face-melting guitar solo video",
  category: "fun",

  async onCall({ response }) {
    try {
      const files = await readdir(GUITAR_FOLDER);
      const videos = files.filter(f => /\.(mp4|webm|mov|avi|mkv)$/i.test(f));

      if (videos.length === 0) {
        await response.reply("Wala pang guitar video sa vault! Pa-load naman");
        return;
      }

      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoPath = path.join(GUITAR_FOLDER, randomVideo);

      await response.upload({
        type: "video",
        file: videoPath,
        options: {
          caption: "FACE-MELTING GUITAR SOLO",
        },
      });
    } catch (error) {
      console.error("[GUITAR COMMAND ERROR]", error);
      await response.reply(`Amp sumabog\n\`\`\`${error}\`\`\``);
    }
  },
};

export default command;
