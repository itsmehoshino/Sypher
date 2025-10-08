////import aibox from "aibox-client";
import { log } from "@sy-log";
import handleCommand from "./handler/commandHandler";
import handleEvent from "./handler/eventHandler";
//import handleReplies from "./handler/replyHandler";

export default async function listener({ api, event }) {
  try {
    switch (event.type) {
      case "message":
        await handleCommand({ api, event });
        break;
      case "event":
        await handleEvent({ api, event });
        break;
      case "message_reply":
        //await handleReplies({ api, event });
        break;
      default:
        // Optionally handle unhandled event types here
        break;
    }
  } catch (error) {
    log("ERROR", `Error in listener: ${error instanceof Error ? error.message : String(error)}`);
  }
}