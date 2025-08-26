import path from "path";
import fs from "fs-extra";
import { log } from "@ax-ui/custom";
import starter from "@ax-ui/console";
import EventEmitter from "events";

const bot = new EventEmitter();
global.bot = bot;

process.on("unhandledRejection", (error) => log("ERROR", error));
process.on("uncaughtException", (error) => log("ERROR", error.stack));

global.Axion = {
  get config() {
    try {
      return JSON.parse(fs.readFileSync(path.join(__dirname, "settings.json")));
    } catch (error) {
      log("ERROR", error);
      return {};
    }
  },
  set config(config) {
    const data = global.Axion.config;
    const newData = { ...data, ...config };
    const str = JSON.stringify(newData, null, 2);
    fs.writeFileSync(path.join(__dirname, "settings.json"), str);
  },
  cooldown: new Map(),
  commands: new Map(),
  replies: new Map(),
  events: new Map(),
};
 Object.assign(global.Axion, {
   get prefix() {
     return global.Axion.config.prefix;
   },
   get subprefix() {
     return global.Axion.config.subprefix;
   },
   get developer() {
     return global.Axion.config.developer;
   },
   get moderators() {
     return global.Axion.config.moderators;
   },
   get administrator() {
     return global.Axion.config.administrator;
   }
 });

async function main() {
  await starter()
}

main();