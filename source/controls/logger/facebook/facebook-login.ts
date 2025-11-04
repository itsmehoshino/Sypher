import { login } from "biar-fca";
import * as fs from "fs";
import listener from "@sy-listener";
import { log } from "@sy-log";

let appState: any;

try {
  const rawData = fs.readFileSync("appstate.json", "utf8");
  appState = rawData.trim() ? JSON.parse(rawData) : null;
} catch (error) {
  appState = null;
}

if (!appState && process.env.STATE) {
  try {
    appState = JSON.parse(process.env.STATE);
  } catch (parseError) {
    console.error("Failed to parse process.env.STATE as JSON");
    process.exit(1);
  }
}

if (!appState) {
  console.error("No valid appState found in appstate.json or process.env.STATE");
  process.exit(1);
}

const credentials = {
  appState
};

export async function facebookLogin() {
  login(credentials, {
    updatePresence: true,
    autoMarkRead: true
  }, (err: any, api: any) => {
    if (err) return console.error(err);

    log("FACEBOOK", "Bot online with protection!");

    api.listenMqtt((err: any, event: any) => {
      try {
        if (err) {
          if (err === "Connection closed.") {
            console.error(`Error during API listen: ${err}`);
          }
          console.log(err);
        }
        listener({ api, event });
      } catch (error: any) {
        log("ERROR", "Error whilst listening: " + error);
      }
    });
  });
}