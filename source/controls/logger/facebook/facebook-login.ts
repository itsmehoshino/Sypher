import login from "fca-delta";
import { readFileSync } from "fs-extra";
import { log } from "@sy-log";
import listener from "@sy-listener";

let credentials;

try {
  credentials = { appState: JSON.parse(readFileSync("./appstate.json", "utf8")) };
} catch (error) {
  log("ERROR", "appstate.json is missing or malformed.");
  process.exit(1);
}

export async function facebookLogin() {
  const { config } = globalThis.Sypher;
  login(credentials, (err, api) => {
    api.setOptions({
      listenEvents: config.fcaOptions.listenEvents,
      selfListen: config.fcaOptions.selfListen,
      autoMarkDelivery: config.fcaOptions.autoMarkDelivery,
      autoMarkRead: config.fcaOptions.autoMarkRead,
      userAgent: config.fcaOptions.userAgent,
    });
    try {
      api.listenMqtt((error, event) => {
        if (error) {
          if (error === "Connection closed.") {
            console.error(`Error during API listen: ${error}`);
          }
          console.log(error);
        }
        listener({ api, event });
      });
    } catch (error) {
      log("ERROR", "Error whilst listening: " + error);
    }
  });
}