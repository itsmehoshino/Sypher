import { log } from "@sy-log";
import { facebookLogin } from "./facebook/facebook-login";
//import discordLogin from "./discordLogin";

export default async function botLogger(){
  log("FACEBOOK", "Logging in..");
  await facebookLogin();
  log("DISCORD", "Logging in..");
}