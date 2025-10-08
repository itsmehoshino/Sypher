# Facebook Messenger Bot - Sypher

## Overview
This is a Facebook Messenger bot built with TypeScript and Node.js. The bot uses the `@dongdev/fca-unofficial` library to connect to Facebook Messenger and respond to messages and events.

## Current Status
- **Status**: ✅ Running successfully
- **Logged in as**: Kevin Clifford (ID: 61581385337960)
- **Commands loaded**: 1 (eval with aliases: ev, run, execute)
- **Events loaded**: 1 (groupNoti for group notifications)

## Project Structure
```
├── source/
│   ├── controls/
│   │   ├── listener/          # Event and message listeners
│   │   │   ├── handler/       # Command, event, and reply handlers
│   │   │   └── listener.ts    # Main listener logic
│   │   ├── logger/            # Facebook login handler
│   │   ├── plugins/           # Core plugins (starter, logger)
│   │   └── utils.ts           # Utility functions for loading commands/events
│   └── sypher.ts              # Global bot configuration
├── sypher/
│   └── modules/
│       ├── commands/          # Bot commands (e.g., eval)
│       └── events/            # Event handlers (e.g., groupNoti)
├── settings.json              # Bot configuration
├── appstate.json             # Facebook session data (SENSITIVE)
├── spawner.js                # Process manager
└── starter.js                # Entry point
```

## Configuration
The bot is configured via `settings.json`:
- **Prefix**: `/` (default command prefix)
- **Maintenance mode**: Currently enabled (only developers/admins/moderators can use the bot)
- **Developers**: Listed user IDs with full access
- **Administrators**: Listed user IDs with admin access
- **Moderators**: Listed user IDs with moderator access

## How to Add Commands
1. Create a new `.ts` file in `sypher/modules/commands/`
2. Export an object with the following structure:
```typescript
export default {
  name: "commandName",
  usage: "!commandName <args>",
  author: "@yourname",
  aliases: ["alias1", "alias2"],
  description: "What this command does",
  async onCall({ response, args, api, event }) {
    // Your command logic here
    await response.send("Reply message");
    await response.react("✅");
  }
}
```

## How to Add Events
1. Create a new `.ts` file in `sypher/modules/events/`
2. Export an object with the following structure:
```typescript
export default {
  name: "eventName",
  author: "@yourname",
  description: "What this event handles",
  eventType: ["log:subscribe", "log:unsubscribe"], // Optional
  async onEvent({ api, event, response }) {
    // Your event logic here
  }
}
```

## Current Features
1. **Command System**: Prefix-based commands with aliases
2. **Event System**: Handles group notifications (joins, leaves, renames)
3. **Maintenance Mode**: Restricts bot access during maintenance
4. **Auto-restart**: Automatically restarts on crashes

## Security Notes
- `appstate.json` contains sensitive Facebook session data and is excluded from git via `.gitignore`
- The bot runs with your Facebook account credentials
- Eval command has basic protections against dangerous code

## Recent Changes
- **Oct 8, 2025**: Initial setup and deployment on Replit
- Bot successfully connected to Facebook Messenger
- Configured workflow to run automatically
