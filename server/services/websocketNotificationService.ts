/**
 * WS disabled stub — satisfies imports without binding any port.
 */
export type InitOpts = { server?: any } | undefined;
export function initWebSocketServer(_opts: InitOpts) {
  console.log("WS: disabled stub loaded (no server port bind).");
}
export function broadcastNotification(_payload: any) { /* no-op */ }
export function closeWebSocketServer() { /* no-op */ }
