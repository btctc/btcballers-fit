import { fallSessions } from "@/lib/programs";

export const dynamic = "force-static";

function to24h(t: string): string {
  const m = t.match(/(\d+):(\d+)(A|P)/);
  if (!m) return "0000";
  let h = Number(m[1]);
  if (m[3] === "P" && h !== 12) h += 12;
  if (m[3] === "A" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}${m[2]}`;
}

export function GET() {
  const events = fallSessions
    .map((s) => {
      const [startRaw, endRaw] = s.time.split(" - ");
      const d = s.dateKey.replace(/-/g, "");
      const title = s.mm
        ? "BTC Ballers - Midnight Madness"
        : s.yemi
          ? "BTC Ballers - Coach Yemi Training"
          : "BTC Ballers Training";
      const desc = s.mm
        ? "Small-group training, dinner, film, books, and competitive play."
        : s.yemi
          ? "Ride with Coach T from SandersFit - limited space."
          : "Believe. Train. Compete.";
      return [
        "BEGIN:VEVENT",
        `UID:btc-feed-${s.key}@btcballers.training`,
        "DTSTAMP:20260713T120000Z",
        `DTSTART;TZID=America/Chicago:${d}T${to24h(startRaw)}00`,
        `DTEND;TZID=America/Chicago:${d}T${to24h(endRaw)}00`,
        `SUMMARY:${title}`,
        `LOCATION:${s.where.replace(/,/g, "\\,")}`,
        `DESCRIPTION:${desc}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BTC Ballers//Fall 2026 Season//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:BTC Ballers Fall 2026",
    "X-WR-TIMEZONE:America/Chicago",
    "X-PUBLISHED-TTL:PT12H",
    "BEGIN:VTIMEZONE",
    "TZID:America/Chicago",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0600",
    "TZOFFSETTO:-0500",
    "TZNAME:CDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0600",
    "TZNAME:CST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="btc-ballers-fall-2026.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
