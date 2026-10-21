import paradeSchedule2027 from "../../data/parade-schedule-2027.json";
import { createParadeShareEvent, type CountdownEvent } from "./countdown-share";

// Resolve public card requests from the same trusted data as the schedule.
// Event names, times, and routes are never accepted from URL parameters.
const paradeEvents = new Map<string, CountdownEvent>(
  paradeSchedule2027.days.flatMap((day) => day.parades.map((parade) => [
    parade.id,
    createParadeShareEvent(parade, day)
  ] as const))
);

export function getParadeShareEvent(paradeId: string): CountdownEvent | null {
  return paradeEvents.get(paradeId) ?? null;
}
