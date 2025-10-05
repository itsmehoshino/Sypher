import fs from "fs";
import { login, API } from "ws3-fca";
import { log } from "@sy-log";
import listener from "@sy-listener";

let credentials: { appState: unknown };

try { 
  credentials = { appState: JSON.parse(fs.readFileSync("./appstate.json", "utf8")) };
} catch (error) {
  log("ERROR", "appstate.json is missing or malformed.");
  process.exit(1);
}

export async function facebookLogin(): Promise<API> {
  return new Promise<API>((resolve, reject) => {
    login(credentials, (error: Error | null, api?: API | null) => {
      if (error || !api) {
        log("ERROR", "Login failed.");
        return reject(error || new Error("API instance is null"));
      }

      log("LOGIN", "Welcome user.");

      try {
        api.listenMqtt(async (error: any, event?: unknown) => {
          if (error) {
            log(
              "ERROR",
              error === "Connection Closed"
                ? "Connection Failed To Connect"
                : error
            );
            return;
          }
          await listener({ api, event });
        });
      } catch (setupError) {
        log("ERROR", `Failed to set up MQTT listener: ${setupError}`);
        return reject(setupError);
      }

      resolve(api);
    });
  });
}