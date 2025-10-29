import { readdirSync } from "fs-extra";
import { resolve, join } from "path";
import { log } from "@sy-log";

const utils: SypherAI.SypherUtils = {
  async loadCommands() {
    const filePath = resolve(process.cwd(), "sypher/modules/commands");
    log("DEBUG", `Command file path: ${filePath}`);
    const loadfiles = readdirSync(filePath).filter((file) => file.endsWith(".ts"));

    if (loadfiles.length === 0) {
      log("SYPHER","No commands available to deploy");
      return;
    }

    const validCommands: { file: string; command: any; name: string }[] = [];

    for (const file of loadfiles) {
      const commandPath = join(filePath, file);
      let command = require(commandPath);
      if (command.default) {
        command = command.default;
      }
      const { name, usage, author, aliases, description, onCall } = command ?? {};

      let scanError: string | null = null;
      if (!name || typeof name !== "string") {
        scanError = "Missing or invalid 'name' (must be a non-empty string)";
      } else if (!usage || typeof usage !== "string") {
        scanError = "Missing or invalid 'usage' (must be a non-empty string)";
      } else if (!author || typeof author !== "string") {
        scanError = "Missing or invalid 'author' (must be a non-empty string)";
      } else if (!Array.isArray(aliases)) {
        scanError = "Missing or invalid 'aliases' (must be an array)";
      } else if (!description || typeof description !== "string") {
        scanError = "Missing or invalid 'description' (must be a non-empty string)";
      } else if (typeof onCall !== "function") {
        scanError = "Missing or invalid 'onCall' (must be a function)";
      }

      if (scanError) {
        log("FAILED", `Scan failed ${file} (${scanError})`);
        continue;
      }

      log("SCAN", `Scanned ${file} successfully`);
      validCommands.push({ file, command, name });
    }

    if (validCommands.length === 0) {
      log("SYPHER", "No valid commands found after scanning");
      return;
    }

    log("SYPHER", `Scan complete: ${validCommands.length} valid commands found`);

    for (const { file, command, name } of validCommands) {
      try {
        log("LOADER", `Deployed ${name} successfully`);
        globalThis.Sypher.commands.set(name, command);

        const { aliases } = command;
        if (aliases.length > 0) {
          for (const alias of aliases) {
            globalThis.Sypher.commands.set(alias, command);
            log("LOADER", `Alias "${alias}" registered for command "${name}"`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          log("FAILED", `Failed to deploy ${name} from ${file}: ${error.stack}`);
        } else {
          console.log(error);
        }
      }
    }
    log("SYPHER", `Loaded ${validCommands.length} valid commands`);
    log("SYPHER", "Scanned command complete!");
  },

  async loadEvents() {
    const filePath = resolve(process.cwd(), "sypher/modules/events");
    log("DEBUG", `Event file path: ${filePath}`);
    const loadfiles = readdirSync(filePath).filter((file) => file.endsWith(".ts"));

    if (loadfiles.length === 0) {
      log("SYPHER", "No events available to deploy");
      return;
    }

    const validEvents: { file: string; event: any; name: string }[] = [];

    for (const file of loadfiles) {
      const eventPath = join(filePath, file);
      let event = require(eventPath);
      if (event.default) {
        event = event.default;
      }
      const { name, author, description, onEvent } = event ?? {};

      let scanError: string | null = null;
      if (!name || typeof name !== "string") {
        scanError = "Missing or invalid 'name' (must be a non-empty string)";
      } else if (!author || typeof author !== "string") {
        scanError = "Missing or invalid 'author' (must be a non-empty string)";
      } else if (!description || typeof description !== "string") {
        scanError = "Missing or invalid 'description' (must be a non-empty string)";
      } else if (typeof onEvent !== "function") {
        scanError = "Missing or invalid 'onEvent' (must be a function)";
      }

      if (scanError) {
        log("FAILED", `Scan failed ${file} (${scanError})`);
        continue;
      }

      log("LOADER", `Scanned ${file} successfully`);
      validEvents.push({ file, event, name });
    }

    if (validEvents.length === 0) {
      log("SYPHER", "No valid events found after scanning");
      return;
    }

    log("SCAN", `Scan complete: ${validEvents.length} valid events found`);

    for (const { file, event, name } of validEvents) {
      try {
        log("SYPHER", `Deployed ${name} successfully`);
        globalThis.Sypher.events.set(name, event);
      } catch (error) {
        if (error instanceof Error) {
          log("FAILED", `Failed to deploy ${name} from ${file}: ${error.stack}`);
        } else {
          console.log(error);
        }
      }
    }
    log("SYPHER", `Loaded ${validEvents.length} valid events`);
    log("SYPHER", "Scanned event complete!");
  },
};

export default utils;