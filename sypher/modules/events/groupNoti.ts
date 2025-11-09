const events = {
  name: "group_add",
  description: "Welcome new members",

  async onEvent({ api, event, logMessageData }) {
    const names = logMessageData.addedParticipants.map((p: any) => p.fullName).join(", ");
    api.sendMessage(`Welcome ${names} to the group!`, event.threadID);
  }
};

export default events;