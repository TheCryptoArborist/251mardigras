import { permanentRedirect } from "next/navigation";

export default function RoutesPage() {
  permanentRedirect("/schedule#all-route-maps");
}
