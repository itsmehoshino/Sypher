import { log } from "@sy-log";
import Response from "./chat/response";

export default async function handleEvent({ api, event }) {
  try {
    const eventName = event.logMessageType || event.type;
    const handler = globalThis.Sypher.events.get(eventName);
    const response = new Response(api, event);

    if (!handler) {
      log("DEBUG", `No registered event handler for type: ${eventName}`);
      return;
    }

    const startTime = Date.now();
    await handler.onEvent({ api, event, response });
    const execTime = Date.now() - startTime;

    log("EVENT", `Executed '${handler.name}' (${eventName}) in ${execTime}ms`);
  } catch (error) {
    log("ERROR", `Event handler failed: ${error instanceof Error ? error.stack : String(error)}`);
  }
}