import Response from "./chat/response";
import handleGoibot from "@sy-patches/goibot";
import UserInfo from "@sy-database/userdata/userdata";

const userinfo = new UserInfo({ api });

export default async function commandHandler({ api, event }) {
  const handled = await handleGoibot({ api, event });
  if (handled) return;

  const parts = event.body.split(" ").filter(Boolean);
  let [commandName = "", ...args] = parts;

  const config = globalThis.Sypher.config;
  const mainPrefix = config.prefix;
  const subPrefixes = Array.isArray(config.subprefix) ? config.subprefix : [];

  let isValidPrefix = false;
  let cleanedCommandName = commandName;

  if (commandName.startsWith(mainPrefix)) {
    isValidPrefix = true;
    cleanedCommandName = commandName.replace(mainPrefix, "").toLowerCase();
  } else {
    for (const subPrefix of subPrefixes) {
      if (commandName.startsWith(subPrefix)) {
        isValidPrefix = true;
        cleanedCommandName = commandName.replace(subPrefix, "").toLowerCase();
        break;
      }
    }
  }

  if (!isValidPrefix) return;

  commandName = cleanedCommandName;

  const response = new Response(api, event);
  const command = globalThis.Sypher.commands.get(commandName);
  const userId = event.senderID;
  const { developers, administrators, moderators } = config;

  const isDev = developers.includes(userId);
  const isAdmin = administrators.includes(userId);
  const isMod = moderators.includes(userId);
  const isStaff = isDev || isAdmin || isMod;

  const getUserRoleName = () => {
    if (isDev) return "Developer";
    if (isAdmin) return "Admin";
    if (isMod) return "Moderator";
    return "User";
  };

  const userRoleName = getUserRoleName();

  const checkRole = (requiredRole) => {
    if (requiredRole === 0) return true;
    if (requiredRole === 1) return isDev;
    if (requiredRole === 2) return isAdmin;
    if (requiredRole === 3) return isMod;
    if (requiredRole === 4) return isStaff;
    return false;
  };

  if (!command) {
    await response.send(`Command using doesn't **exist.**`);
    await response.react("❓");
    return;
  }

  if (command.role !== undefined && !checkRole(command.role)) {
    const roleNames = {
      0: "Everyone",
      1: "Developer",
      2: "Admin",
      3: "Moderator",
      4: "Staff",
    };
    const requiredName = roleNames[command.role] || "Restricted";

    let message = `You don't have permission to use this command.\nRequired: **${requiredName}**`;

    if (command.role === 1 && !isDev) {
      message = `This command is **Developer-only**.\nYour rank: **${userRoleName}** — you need **Developer access**.`;
    } else if (command.role === 2 && !isAdmin) {
      message = `This command is for **Admins only**.\nYour rank: **${userRoleName}** — you need a **higher role**.`;
    } else if (command.role === 3 && !isMod) {
      message = `This command is for **Moderators only**.\nYour rank: **${userRoleName}** — you need a **higher role**.`;
    } else if (command.role === 4 && !isStaff) {
      message = `This command is for **Staff only**.\nYour rank: **${userRoleName}** — you need to be a **staff member**.`;
    }

    await response.send(message);
    await response.react("❕");
    return;
  }

  const limiter = command.config?.limiter;
  if (
    limiter?.isLimit === true &&
    typeof limiter.limitUsage === "number" &&
    limiter.limitUsage > 0 &&
    typeof limiter.time === "number" &&
    limiter.time > 0
  ) {
    const limitKey = `limit_${userId}_${commandName}`;
    const now = Date.now();

    let usageData = globalThis.Sypher.usageLimits.get(limitKey) || {
      count: 0,
      resetAt: now + limiter.time * 24 * 60 * 60 * 1000,
    };

    if (now >= usageData.resetAt) {
      usageData = {
        count: 0,
        resetAt: now + limiter.time * 24 * 60 * 60 * 1000,
      };
    }

    if (usageData.count >= limiter.limitUsage) {
      const timeLeftMs = usageData.resetAt - now;
      const days = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const mins = Math.floor((timeLeftMs % (60 * 60 * 1000)) / (60 * 1000));

      let timeStr = "";
      if (days > 0) timeStr += `${days} day${days > 1 ? "s" : ""} `;
      if (hours > 0) timeStr += `${hours} hour${hours > 1 ? "s" : ""} `;
      if (mins > 0 || timeStr === "")
        timeStr += `${mins} minute${mins > 1 ? "s" : ""}`;

      await response.send(
        `You've reached the usage limit (**${limiter.limitUsage}x**).\n` +
          `Reset in: **${timeStr.trim()}**`
      );
      await response.react("⛔");
      return;
    }

    usageData.count += 1;
    globalThis.Sypher.usageLimits.set(limitKey, usageData);
  }

  if (typeof command.cooldowns === "number" && command.cooldowns > 0) {
    const cooldownKey = `${event.senderID}_${commandName}`;
    const now = Date.now();
    const lastUsed = globalThis.Sypher.cooldowns.get(cooldownKey) || 0;
    const cooldownMs = command.cooldowns * 1000;

    if (now - lastUsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - (now - lastUsed)) / 1000);
      await response.send(
        `Please wait **${remaining}s** before using this command again.`
      );
      await response.react("⏳");
      return;
    }

    globalThis.Sypher.cooldowns.set(cooldownKey, now);
  }

  if (config.maintenance) {
    const allowedUsers = [
      ...config.developers,
      ...config.administrators,
      ...config.moderators,
    ];
    if (!allowedUsers.includes(event.senderID)) {
      await response.send(
        "The bot is currently under maintenance. Please try again later."
      );
      await response.react("🔧");
      return;
    }
  }

  const context: SypherAI.CommandContext = {
    api,
    response,
    args,
    event,
    userinfo,
  };

  if (command && command.onCall) {
    try {
      await command.onCall(context);
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      if (error instanceof Error) {
        await response.send(
          `Failed to execute command '${commandName}'. If you are the developer, please fix your code.\n\n\`\`\`${error.stack}\`\`\``
        );
      } else {
        await response.send(
          `Failed to execute command '${commandName}'. An unexpected error occurred.`
        );
      }
    }
  }
}
