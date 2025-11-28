const limiter = command.config?.limiter;

if (limiter?.isLimit === true && limiter.limitUsage > 0 && limiter.time > 0) {
  const key = `limit_${senderID}_${commandName}`;
  const now = Date.now();

  let data = globalThis.Sypher.usageLimits.get(key) as
    | { count: number; resetAt: number }
    | undefined;

  if (!data || now >= data.resetAt) {
    data = {
      count: 1,
      resetAt: now + limiter.time * 24 * 60 * 60 * 1000,
    };
    globalThis.Sypher.usageLimits.set(key, data);
  } else if (data.count >= limiter.limitUsage) {
    const timeLeft = data.resetAt - now;
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

    let str = "";
    if (days > 0) str += `${days} day${days > 1 ? "s" : ""} `;
    if (hours > 0) str += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0 || str === "") str += `${minutes} minute${minutes > 1 ? "s" : ""}`;

    await response.send(
      `You've used up all **${limiter.limitUsage}** attempts for **${commandName}**.\n` +
      `Come back in **${str.trim()}**`
    );
    return;
  } else {
    data.count += 1;
    globalThis.Sypher.usageLimits.set(key, data);
  }
}
