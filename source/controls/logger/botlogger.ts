import { log } from "@sy-log";
import teleLogin from "./telegram/login";
//import discordLogin from "./discordLogin";

export default async function botLogger(){
  log("TELEGRAM", "Logging in..");
  await teleLogin();
  log("DISCORD", "Logging in..");
}