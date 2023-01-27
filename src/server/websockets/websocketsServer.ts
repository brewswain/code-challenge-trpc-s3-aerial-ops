// https://trpc.io/docs/subscriptions
// https://github.com/trpc/examples-next-prisma-websockets-starter/blob/main/src/server/wssDevServer.ts

import { createContext } from "../api/context";
import { appRouter } from "../api/root";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import fetch from "node-fetch";
import ws from "ws";

if (!global.fetch) {
  // Using the very rare eslint disable here for this 3rd party file.
  // VERY DANGEROUS, FIX TYPING ONCE FUNCTIONALITY IS CONFIRMED. The only reason I'm even leaving it for now is because this is taken from the official trpc github
  // eslint-disable-next-line
  (global as any).fetch = fetch;
}
const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
