import Response from "@sy-handler/chat/response";
import { API } from "biar-fca";

const replies = [
  { text: "Dedede ka?", react: "⁉️" },
  { text: "Yes baby?", react: "🥰" },
  { text: "You called?", react: "🤔" },
  { text: "Hmm?", react: "💭" },
  { text: "At your service!", react: "👾" },
  { text: "Need help?", react: "❓" },
  { text: "Listening...", react: "👂" },
  { text: "Yo?", react: "😅" },
  { text: "Yes mommy?", react: "😫" },
  { text: "TF do you want?!?!", react: "💢" },
  { text: "WHAT?!?", react: "😤" },
  { text: "Yes daddy?", react: "🥵" }
];

const laughKeywords = [
  "hahaha", "haha", "hehe", "heh", "lol", "lmao", "lmfao",
  "kakakaka", "jajaja", "hasoy", "pota", "tangina",
  "hahahaha", "ahahaha", "wkwkwk", "huehue", "kek", "lolz",
  "😂", "🤣", "😆", "😅"
];

const pinoyReplies = [
  "Tawang tawa yarn? 😭",
  "Grabe ka makatawa HAHAHA",
  "Pucha ang saya mo ah 😂",
  "Ayaw mo tigilan 'no? 🤣",
  "Hala sige, baka maubusan ka ng hininga jan!",
  "Laugh trip ka talaga teh! 😆"
];

export default async function handleGoibot({ api, event }: { api: API; event: SypherAI.CommandContext["event"] }) {
  const message = event.body?.trim();
  const lowerMessage = message?.toLowerCase();

  const response = new Response(api, event);

  if (lowerMessage === "bot") {
    const { text, react } = replies[Math.floor(Math.random() * replies.length)];
    await response.send(text);
    await response.react(react);
    return true;
  }

  if (message === "👍") {
    const musicPath = "./source/controls/patches/plugins/music/relapse.mp3";
    await response.upload("Aray mo!!, Ni-like zone ni **crush**.", musicPath);
    await response.react("😢");
    return true;
  }

  const isLaughing = laughKeywords.some(keyword => 
    lowerMessage.includes(keyword) || message.includes(keyword)
  );

  if (isLaughing) {
    const randomReply = pinoyReplies[Math.floor(Math.random() * pinoyReplies.length)];
    await response.send(randomReply);
    await response.react("😆");
    return true;
  }

  if (lowerMessage === "augh") {
    await response.send("Oh fu... don't goon bro..");
    await response.react("😣");
    return true;
  }

  if (lowerMessage === "hbd" || lowerMessage === "happy birthday" || message === "🎂") {
    await response.send("**Happy Birthday** dear user!!");
    await response.react("🥳");
    return true;
  }

  if (lowerMessage === "prefix"){
    await response.upload(`Prefix: ${globalThis.Sypher.config.prefix}`, "./source/controls/patches/plugins/images/cover.gif");
    await response.react("👾");
    return true;
  }

  return false;
}

