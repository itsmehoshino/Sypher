import Response from "@sy-handler/chat/response";

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
  { text: "TF do you want?!?!", react: "💢" }
];

export default async function handleGoibot({ api, event }: { api: any; event: any }) {
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
    const musicPath = "./plugins/music/relapse.mp3";
    await response.upload("Aray mo!!, Ni-like zone ni **crush**.", musicPath);
    await response.react("😢");
    return true;
  }

  return false;
}
