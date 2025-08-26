declare namespace AxionAI {
  export interface CommandMeta {
    name: string;
    role: string;
    aliases: string[];
    developer: string;
    description: sring;
    usage: string;
  }

  export interface Command {
    meta: CommandMeta;
    execute: (ctx: EntryObj): Promise<any> | any;
  }

  export interface Response {
    
  }

  export interface EntryObj {
    api: any;
    response: Response;
    event: Event;
    database: typeof import("../database")
  }
  export type CommandContext = EntryObj;

  export interface Event {
    body: string;
    senderID: string;
    threadID: string;
    messageID: string;
    type: string;
    messageReply?: {
      messageID: string;
      senderID: string;
    };
    [key: string]: any;
  }

  export interface GlobalAxion {
    config: {
      name: string;
      prefix: string;
      subprefix: string[];
      developer: string[];
      moderators: string[];
      administrator: string[];
      maintenance: boolean;
    }
    commands: Map<string, Command>
    event: Map<string, any>
    cooldowns: Map<string, Record<string, number>>;
  }

  declare namespace GlobalThis {
    var bot: import('events').EventEmitter;
    var Axion: AxionAI.GlobalAxion;
  }
}