import { login } from "biar-fca";
import * as fs from "fs";
import listener from "@sy-listener";
import { log } from "@sy-log";

let appState: any = null;

try {
  const fileData = fs.readFileSync("appstate.json", "utf8").trim();
  if (fileData) {
    appState = JSON.parse(fileData);
    console.log("Successfully loaded appState from appstate.json");
  } else {
    console.log("appstate.json is empty");
  }
} catch (err: any) {
  if (err.code === "ENOENT") {
    console.log("appstate.json not found");
  } else if (err instanceof SyntaxError) {
    console.log("appstate.json contains invalid JSON");
  } else {
    console.log("Error reading appstate.json:", err.message);
  }
}

if (!appState && process.env.STATE) {
  try {
    const envData = process.env.STATE.trim();
    if (envData) {
      appState = JSON.parse(envData);
      console.log("Successfully loaded appState from process.env.STATE");
    } else {
      console.log("process.env.STATE is empty");
    }
  } catch (err: any) {
    console.error("Failed to parse process.env.STATE as JSON:", err.message);
    process.exit(1);
  }
}

if (!appState) {
  console.error("No valid appState found. Provide either appstate.json or STATE env variable.");
  process.exit(1);
}

const cookieCount = Array.isArray(appState) ? appState.length : 0;
console.log(`Loaded ${cookieCount} cookie(s) for login`);

const credentials = { appState };

export async function facebookLogin() {
  login(credentials, { updatePresence: true, autoMarkRead: true }, (err: any, api: any) => {
    if (err) {
      console.error("Login failed:", err);
      return;
    }

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
        console.log("ERROR", "Error whilst listening: " + error);
      }
    });
  });
}
