import { darkJokes } from "@sy-patches/darkjokes";

const command: SypherAI.Command = {
  name: "darkhumor",
  role: 0,
  usage: "darkhumor",
  author: "Francis Loyd Raval",
  aliases: ["dark", "dh", "blackhumor"],
  cooldowns: 5,
  description: "Sends a random ultimate dark humor scenario",

  async onCall({ response }) {
    const joke = darkJokes[Math.floor(Math.random() * darkJokes.length)];
    await response.send(joke);
  },
};

export default command;