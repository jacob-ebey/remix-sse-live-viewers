import { EventEmitter } from "events";

declare global {
  var liveVisitors: number;
  var liveVisitorsEvents: EventEmitter;
}

global.liveVisitors = global.liveVisitors || 0;
global.liveVisitorsEvents = global.liveVisitorsEvents || new EventEmitter();

export const events = global.liveVisitorsEvents;

export function dispatchVisitorsChange(change: "dec" | "inc") {
  global.liveVisitors = global.liveVisitors || 0;
  global.liveVisitors += change === "dec" ? -1 : 1;
  global.liveVisitorsEvents.emit("visitorsChanged", liveVisitors);
}
