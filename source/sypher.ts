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

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    log("ERROR", `Unhandled rejection:\n${error.stack}`);
  } else {
    log("ERROR", `Unhandled rejection (non-Error): ${error}`);
  }
});

process.on("uncaughtException", (error) => {
  if (error instanceof Error) {
    log("ERROR", `Uncaught exception:\n${error.stack}`);
  } else {
    log("ERROR", `Uncaught exception (non-Error): ${error}`);
  }
});

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
      log("ERROR", `Error reading config file:\n${error.stack}`);
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
      log("ERROR", `Error writing config file:\n${error.stack}`);
      throw error;
    }
  },
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  replies: new Map(),
  usageLimits: new Map(),
  reactions: new Map(),
  utils: utils,
};

Object.assign(globalThis.Sypher, {
  get prefix() { return this.config.prefix; },
  get subprefix() { return this.config.subprefix; },
  get administrators() { return this.config.administrators; },
  get moderators() { return this.config.moderators; },
  get developers() { return this.config.developers; },
});

async function main(){
  await starter();
}

main();
