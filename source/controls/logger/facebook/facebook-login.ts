import { login } from "biar-fca";
import * as fs from "fs";
import listener from "@sy-listener";
import { log } from "@sy-log";

const credentials = {
  appState: JSON.parse(fs.readFileSync("appstate.json", "utf8"))
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
        console.log("ERROR", "Error whilst listening: " + error);
      }
    });
  });
}
