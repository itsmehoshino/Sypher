export default {
  name: "groupNoti",
  author: "@franz",
  description: "Handles group notifications such as joins, leaves, and renames.",
  eventType: ["log:subscribe", "log:unsubscribe", "log:thread-name"],

  async onEvent({ api, event }) {
    const threadID = event.threadID;
    const type = event.logMessageType;

    switch (type) {
      case "log:subscribe": {
        const user = event.logMessageData?.addedParticipants?.[0]?.fullName || "New Member";
        await api.sendMessage(`Welcome ${user} to the group! 🎉`, threadID);
        break;
      }
      case "log:unsubscribe": {
        const leftUser = event.logMessageData?.leftParticipantFbId;
        await api.sendMessage(`Goodbye <@${leftUser}> 😢`, threadID);
        break;
      }
      case "log:thread-name": {
        const newName = event.logMessageData?.name || "Unknown";
        await api.sendMessage(`Group name changed to: ${newName}`, threadID);
        break;
      }
    }
  },
};