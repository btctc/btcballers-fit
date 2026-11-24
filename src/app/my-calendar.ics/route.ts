import { sessions } from "@/lib/programs";
import { buildCalendar } from "@/lib/ics";

export const dynamic = "force-dynamic";

// Calendar file for just the days a family picked in the planner.
// Served as a normal link so iPhone opens it straight in Calendar.
export function GET(request: Request) {
  const picked = new Set((new URL(request.url).searchParams.get("s") ?? "").split(",").filter(Boolean));
  const mine = sessions.filter((s) => picked.has(s.key));
  return new Response(buildCalendar(mine.length ? mine : sessions, "BTC Ballers - My Days"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="btc-ballers-my-days.ics"',
      "Cache-Control": "no-store",
    },
  });
}
