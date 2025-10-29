import { API } from "ws3-fca";

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
      usage: string;
      author: string;
      aliases: string[];
      description: string;
      onCall: (params: { api: API; event: Event; args: string[]; response: Response; fonts: Fonts })
    }

    interface EventCMD {
      name: string;
      description: string;
      onEvent: (params: { api: API; event: Event })
    }

    interface Event {
      type: string;
      threadID: string;
      messageID: string;
      senderID: string;
      body: string
    }

    interface Fonts {
      sans: (text: string) => string;
      bold: (text: string) => string;
      mono: (text: string) => string;
      italic: (text: string) => string;
      outline: (text: string) => string;
    }

    interface SypherUtils {
      loadCommands: () => Promise<void>;
      loadEvents: () => Promise<void>;
    }
  }
}

export {};