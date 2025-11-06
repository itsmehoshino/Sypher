import { readdir } from "fs/promises";

const GUITAR_FOLDER = "./source/controls/patches/plugins/videos/guitar";

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
    try {
      const files = await readdir(GUITAR_FOLDER);
      const mp4Files = files.filter(f => f.toLowerCase().endsWith(".mp4"));

      if (mp4Files.length === 0) {
        await response.send("Wala pang MP4 sa vault, pa-load naman");
        return;
      }

      const randomMP4 = mp4Files[Math.floor(Math.random() * mp4Files.length)];
      const videoPath = `${GUITAR_FOLDER}/${randomMP4}`;

      await response.upload(`Random Guitar Solo`, videoPath);
    } catch (error: any) {
      console.error("[GUITAR COMMAND ERROR]", error);
      await response.send(`Bigla na lang sumabog yung amp ko\n\`\`\`${error.stack}\`\`\``);
    }
  },
};

export default command;