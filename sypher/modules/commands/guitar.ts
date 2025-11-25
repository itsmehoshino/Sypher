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
  description: "Sends a random face-melting MP4 guitar solo",
  category: "fun",

  async onCall({ response }) {
    try {
      const files = await readdir(GUITAR_FOLDER);
      const mp4Files = files.filter(f => /\.mp4$/i.test(f));

      if (mp4Files.length === 0) {
        return await response.send("Wala pang MP4 sa vault, pa-load naman 🤘");
      }

      const randomFile = mp4Files[Math.floor(Math.random() * mp4Files.length)];
      const videoPath = path.join(GUITAR_FOLDER, randomFile);

      await response.upload({
        type: "video",
        file: videoPath,
        options: {
          caption: "🤘 FACE-MELTING GUITAR SOLO 🤘\nTesting purposes only.",
        },
      });
    } catch (error: any) {
      console.error("[GUITAR COMMAND ERROR]", error);
      await response.send(`Bigla na lang sumabog yung amp ko 😭\n\`\`\`${error.message || error}\`\`\``);
    }
  },
};

export default command;
