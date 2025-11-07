import axios from "axios";

const command: SypherAI.Command = {
  name: "relapseai",
  role: 0,
  usage: "relapse <text>",
  author: "JrDev03",
  aliases: ["hugot", "sadquote"],
  cooldowns: 5,
  description: "Get a sad hugot line based on your text.",
  category: "fun",
  config: {
    maintenance: false,
    usePrefix: true,
    limiter: {
      isLimit: false,
      limitUsage: 0,
    },
  },

  async onCall({ args, response }) {
    if (!args.length) {
      return await response.send("Please provide something to hugot kung ayaw mong sapakin kita.");
    }

    const text = args.join(" ");
    const systemPrompt =
      "You are Relapse AI, an AI that finds one sad hugot (emotional quote) related to the user's prompt. Respond with only one hugot line no links, no explanations, only pure text that sounds sad and heartfelt.";

    try {
      const res = await axios.get("https://api.nekolabs.web.id/ai/gpt/4o-search", {
        params: {
          text,
          systemPrompt,
        },
      });

      if (!res.data?.success) {
        return await response.send("Bat mo kasi hinahanap yung taong ayaw sayo?");
      }

      const quote = res.data.result.trim().replace(/^"|"$/g, "");

      await response.send(quote || "Walang kayo putangina mo.");
    } catch (err) {
      console.error(err);
      await response.send("Putangina mo pala eh.");
    }
  },
};

export default command;