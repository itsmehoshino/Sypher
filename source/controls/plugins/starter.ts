import botLogger from "@sy-login";
import utils from "@sy-utils";
import { log } from "@sy-log";
import express from "express";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "temp")));

app.get("/health", (_req, res) => {
  res.json({
    status: "online",
    service: "Sypher Engine",
    timestamp: new Date().toISOString(),
  });
});

export async function starter() {
  log("SERVER", "Activating Engine..");
  log("SERVER", "Starting Sypher..");
  log("SERVER", "Welcome Operator!");
  log("SYPHER", "Scanning for commands..");
  await utils.loadCommands();
  log("SYPHER", "Scanning for events..");
  await utils.loadEvents();
  log("SYPHER", "Logging in different systems..");
  await botLogger();

  app.listen(3000, () => {
    log("SERVER", "Sypher is now online within the server!");
    log("SERVER", "Dashboard: http://localhost:3000");
  });
}
