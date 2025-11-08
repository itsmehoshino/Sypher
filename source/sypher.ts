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

process.on("unhandledRejection", (error: unknown) => {
  const err = error instanceof Error ? error : new Error(String(error));
  log("ERROR", `Unhandled rejection:\n${err.stack}`);
});

process.on("uncaughtException", (error: unknown) => {
  const err = error instanceof Error ? error : new Error(String(error));
  log("ERROR", `Uncaught exception:\n${err.stack}`);
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
    } catch (error: unknown) {
      log("ERROR", `Error reading config file:\n${error instanceof Error ? error.stack : String(error)}`);
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
    } catch (error: unknown) {
      log("ERROR", `Error writing config file:\n${error instanceof Error ? error.stack : String(error)}`);
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
  get prefix() { return globalThis.Sypher.config.prefix; },
  get subprefix() { return globalThis.Sypher.config.subprefix; },
  get administrators() { return globalThis.Sypher.config.administrators; },
  get moderators() { return globalThis.Sypher.config.moderators; },
  get developers() { return globalThis.Sypher.config.developers; },
});

async function main(){
  await starter();
}

main();