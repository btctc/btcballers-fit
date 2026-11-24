import { sessions } from "@/lib/programs";
import { buildCalendar } from "@/lib/ics";

export const dynamic = "force-static";

// Full season feed. Families subscribe to this once and it updates on its own.
export function GET() {
  return new Response(buildCalendar(sessions, "BTC Ballers Spring 2027"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="btc-ballers-spring-2027.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
