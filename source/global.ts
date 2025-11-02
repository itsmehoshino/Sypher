import { API, Message } from "biar-fca";
import Response from "@sy-handler/chat/response";

declare global {
  var bot: import('events').EventEmitter;
  var Sypher: SypherAI.GlobalSypher;

  namespace SypherAI {
    interface GlobalSypher {
      config: typeof import("../settings.json");
      commands: Map<string, any>;
      events: Map<string, any>;
      cooldowns: Map<string, number>;
      replies: Map<string, any>;
      reactions: Map<string, any>;
      utils: SypherUtils;
    }

    interface Command {
      name: string;
      role: number;
      usage: string;
      author: string;
      aliases: string[];
      cooldowns: number;
      description: string;
      onCall: (ctx: CommandContext) => Promise<void>
    }

    interface EventCMD {
      name: string;
      description: string;
      onEvent: (ctx: CommandContext) => Promise<void>
    }

    interface CommandContext {
      api: API;
      event: Omit<Message, "type"> & { type: "message" | "messageReply" };
      args: string[];
      response: Response;
    }

    interface SypherUtils {
      loadCommands: () => Promise<void>;
      loadEvents: () => Promise<void>;
    }
  }
}

export {};