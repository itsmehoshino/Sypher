import axios, { AxiosError } from "axios";

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
      time: 0,
    },
  },

  async onCall(ctx) {
    const { args, response } = ctx;

    if (!args.length) {
      await response.send("Please provide something to hugot kung ayaw mong sapakin kita.");
      return;
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
        timeout: 10000,
      });

      if (!res.data?.success) {
        await response.send("Bat mo kasi hinahanap yung taong ayaw sayo?");
        return;
      }

      const quote = res.data.result?.trim().replace(/^"|"$/g, "");

      await response.send(quote || "Walang kayo putangina mo.");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
          await response.send("Ayaw mag-load ng API, parang ex mo na block ka na.");
          return;
        }
        if (err.response) {
          await response.send("May problema sa server, parang puso mo — sira.");
          return;
        }
        if (err.request) {
          await response.send("Walang response, parang pag-ibig mo — one-sided.");
          return;
        }
      }

      console.error("Relapse Error:", err);
      await response.send("Putangina mo pala eh, may error.");
    }
  },
};

export default command;
