import Response from "./listener/handler/chat/response";

const replies = [
  { text: "Dedede ka?", react: "⁉️" },
  { text: "Yes baby?", react: "🥰" },
  { text: "You called?", react: "🤔" },
  { text: "Hmm?", react: "💭" },
  { text: "At your service!", react: "👾" },
  { text: "Need help?", react: "❓" },
  { text: "Listening...", react: "👂" },
  { text: "Yo?", react: "😅" }
];

export default async function handleGoibot({ api, event }: { api: any; event: any }) {
  const message = event.body?.trim();
  if (!message || message.toLowerCase() !== "bot") return false;

  const response = new Response(api, event);
  const { text, react } = replies[Math.floor(Math.random() * replies.length)];

  await response.send(text);
  await response.react(react);

  return true;
}

