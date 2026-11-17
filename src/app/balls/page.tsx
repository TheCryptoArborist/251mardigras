import type { Metadata } from "next";
import BallDirectory from "./BallDirectory";
export const metadata: Metadata = {
  title: "2027 Mardi Gras Balls and Celebrations",
  description: "Find your Mardi Gras society and submit confirmed 2027 ball dates, times and venues for MG251 review.",
  alternates: { canonical: "/balls" }
};
export default function BallsPage() { return <BallDirectory />; }
