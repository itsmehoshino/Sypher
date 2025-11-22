import UserInfo from "@sy-database/userdata/userdata";
import { log as log2 } from "@sy-custom"

declare global {
  var bot: import("events").EventEmitter;
  var Sypher: SypherAI.GlobalSypher;
  var log: typeof log2;

  namespace SypherAI {
    interface GlobalSypher {
      config: typeof import("../settings.json");
      commands: Map<string, any>;
      events: Map<string, any>;
      cooldowns: Map<string, number>;
      usageLimits: Map<string, UsageLimitData>;
      replies: Map<string, any>;
      reactions: Map<string, any>;
      utils: SypherUtils;
    }

    interface UsageLimitData {
      count: number;
      resetAt: number;
    }

    interface Command {
      name: string;
      role: number;
      usage: string;
      author: string;
      aliases: string[];
      cooldowns: number;
      description: string;
      category: string;
      config: {
        maintenance: boolean;
        usePrefix: boolean;
        limiter: {
          isLimit: boolean;
          limitUsage: number;
          time: number;
        };
      };
      onCall: (ctx: CommandContext) => Promise<void>;
    }

    interface EventCMD {
      name: string;
      description: string;
      onEvent: (ctx: CommandContext) => Promise<void>;
    }

    interface CommandContext {
      args: string[];
      userinfo: InstanceType<typeof UserInfo>;
    }

    interface SypherUtils {
      loadCommands: () => Promise<void>;
      loadEvents: () => Promise<void>;
    }
  }
}

export {};
