import { facebookLogin } from "@sy-login";
import utils from "@sy-utils";
import { log } from "@sy-log";

export async function starter(){
  log("SERVER", "Activating Engine..");
  log("SERVER", "Starting Sypher..");
  log("SERVER","Welcome Operator!");
  log("SYPHER", "Scanning for commands..");
  await utils.loadCommands();
  log("SYPHER", "Scanning for events..");
  await utils.loadEvents();
  log("SYPHER", "Logging in..")
  await facebookLogin();
}