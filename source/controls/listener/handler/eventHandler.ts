import { log } from "@sy-log";

export default async function handleEvent({ api, event }: { api: any; event: any }) {
  try {
    if (event.author === api.getCurrentUserID()) return;

    const eventMap: { [key: string]: string } = {
      "change_thread_admins": "group_admin_change",
      "add_user_to_group": "group_add",
      "remove_user_from_group": "group_remove",
      "change_thread_icon": "group_icon_change",
      "change_thread_color": "group_color_change",
      "change_thread_name": "group_name_change",
      "change_thread_image": "group_image_change",
      "message_reaction": "message_reaction",
      "message_unsend": "message_unsend",
      "typ": "typing",
      "presence": "presence",
      "friend_request": "friend_request",
      "friend_request_cancel": "friend_request_cancel",
      "friend_request_accept": "friend_request_accept",
      "rtc_call": "call_start",
      "rtc_call_end": "call_end",
      "poll_create": "poll_create",
      "poll_vote": "poll_vote",
    };

    const eventName = eventMap[event.logMessageType] || event.logMessageType || "unknown_event";

    const handler = globalThis.Sypher.events.get(eventName);
    if (!handler) return;

    log("EVENT", `${eventName} → ${event.threadID || "DM"}`);

    await handler.onEvent({
      api,
      event,
      eventName,
      logMessageData: event.logMessageData,
      logMessageBody: event.logMessageBody,
      author: event.author,
      threadID: event.threadID,
      messageID: event.messageID,
    });

  } catch (error: any) {
    log("ERROR", `Event handler crashed [${event.logMessageType}]: ${error.message}`);
    if (error.stack) log("STACK", error.stack);
  }
}