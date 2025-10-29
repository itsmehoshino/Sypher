import { starter } from "./controls/plugins/starter";
import utils from "./controls/utils";
import fs from "fs-extra";
import path from "path";
import EventEmitter from "events";
import("./global");
import { log } from "@sy-log";

const bot = new EventEmitter();
globalThis.bot = bot;
globalThis.log = log;

process.on("unhandledRejection", (error) => log("ERROR", error));
process.on("uncaughtException", (error) => log("ERROR", error.stack));

globalThis.Sypher = {
  get config() {
    try {
      const configPath = path.join(__dirname, "../settings.json");
      const defaultConfig = {
        prefix: "!",
        subprefix: ".",
        administrators: [],
        moderators: [],
        developers: [],
      };

      if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf8");
        return defaultConfig;
      }

      return JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (error) {
      console.log("ERROR", "Error reading config file");
      return {
        prefix: "!",
        subprefix: ".",
        administrators: [],
        moderators: [],
        developers: [],
      };
    }
  },
  set config(newConfig) {
    try {
      const configPath = path.join(__dirname, "../settings.json");
      const currentConfig = this.config || {};
      const finalData = { ...currentConfig, ...newConfig };
      const str = JSON.stringify(finalData, null, 2);
      fs.writeFileSync(configPath, str, "utf8");
    } catch (error) {
      console.log("ERROR","Error writing config file.");
      throw error;
    }
  },
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  replies: new Map(),
  reactions: new Map(),
  utils: utils,
};

Object.defineProperties(globalThis.Sypher, {
  prefix: {
    get() {
      return this.config.prefix;
    },
  },
  subprefix: {
    get() {
      return this.config.subprefix;
    },
  },
  administrators: {
    get() {
      return this.config.administrators;
    },
  },
  moderators: {
    get() {
      return this.config.moderators;
    },
  },
  developers: {
    get() {
      return this.config.developers;
    },
  },
});

async function main(){
  await starter();
}

main();