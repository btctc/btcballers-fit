import type { Session } from "@/lib/programs";

function to24h(t: string): string {
  const m = t.match(/(\d+):(\d+)(A|P)/);
  if (!m) return "0000";
  let h = Number(m[1]);
  if (m[3] === "P" && h !== 12) h += 12;
  if (m[3] === "A" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}${m[2]}`;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");

// Builds one calendar file for the given workouts. Used by the season feed
// (/calendar.ics) and by the "my days" download (/my-calendar.ics).
export function buildCalendar(list: Session[], name: string): string {
  const events = list.map((s) => {
    const [startRaw, endRaw] = s.time.split(" - ");
    const end = s.partyUntil ?? endRaw;
    const d = s.dateKey.replace(/-/g, "");
    const title = s.mm
      ? "BTC Ballers - Midnight Madness"
      : s.partyUntil
        ? "BTC Ballers - Training + End of Year Party"
        : "BTC Ballers Training";
    const desc = s.mm
      ? "Small-group training, dinner, film, books, and competitive play."
      : s.partyUntil
        ? `Training ${s.time}, then the End of Year Party until ${s.partyUntil}.`
        : "Believe. Train. Compete.";
    return [
      "BEGIN:VEVENT",
      `UID:btc-feed-${s.key}@btcballers.training`,
      "DTSTAMP:20261124T120000Z",
      `DTSTART;TZID=America/Chicago:${d}T${to24h(startRaw)}00`,
      `DTEND;TZID=America/Chicago:${d}T${to24h(end)}00`,
      `SUMMARY:${esc(title)}`,
      `LOCATION:${esc(s.where)}`,
      `DESCRIPTION:${esc(desc)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:BTC Ballers today",
      "TRIGGER:-PT2H",
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BTC Ballers//Spring 2027 Season//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(name)}`,
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
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}
