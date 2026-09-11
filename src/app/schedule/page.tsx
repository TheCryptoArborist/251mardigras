import paradeSchedule2027 from "../../../data/parade-schedule-2027.json";
import { ScheduleRouteViewer, type ParadeSchedule } from "@/components/ScheduleRouteViewer";

const schedule = paradeSchedule2027 as ParadeSchedule;

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return <ScheduleRouteViewer schedule={schedule} />;
}
