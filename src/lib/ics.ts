// src/lib/ics.ts
//
// Lightweight RFC 5545 (iCalendar) generation with no external dependency.
// Used to:
//  1. Build a downloadable .ics for a single session ("Add to calendar" button)
//  2. Build a full VCALENDAR feed for the whole event (served at /schedule.ics)

export interface IcsSession {
  id: string;
  title: string;
  description?: string;
  room?: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM (24hr, local to event timezone)
  end: string; // HH:MM
  speakerNames?: string[];
}

export interface IcsEventMeta {
  id: string;
  name: string;
  location?: string;
  timezone?: string; // IANA tz, e.g. "Europe/London". Used for display only; times are emitted as floating local time.
  url?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Escape text per RFC 5545 (commas, semicolons, backslashes, newlines). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** Fold lines longer than 75 octets per RFC 5545 (simple char-based fold, fine for ASCII/UTF-8 short lines). */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  let result = "";
  let remaining = line;
  let first = true;
  while (remaining.length > 0) {
    const chunkLen = first ? 75 : 74;
    result += (first ? "" : "\r\n ") + remaining.slice(0, chunkLen);
    remaining = remaining.slice(chunkLen);
    first = false;
  }
  return result;
}

/** Format a session's date + local time into an iCalendar DATE-TIME (floating, no Z suffix). */
function toIcsDateTime(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function dtstamp(): string {
  const now = new Date();
  return (
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T` +
    `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  );
}

function buildEvent(session: IcsSession, event: IcsEventMeta): string {
  const uid = `${session.id}@${event.id}.spaceimpactforum`;
  const descriptionParts = [
    session.description ?? "",
    session.speakerNames && session.speakerNames.length > 0
      ? `Speakers: ${session.speakerNames.join(", ")}`
      : "",
  ].filter(Boolean);

  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp()}`,
    `DTSTART;TZID=${event.timezone ?? "Europe/London"}:${toIcsDateTime(session.date, session.start)}`,
    `DTEND;TZID=${event.timezone ?? "Europe/London"}:${toIcsDateTime(session.date, session.end)}`,
    `SUMMARY:${escapeText(session.title)}`,
  ];

  if (descriptionParts.length > 0) {
    lines.push(`DESCRIPTION:${escapeText(descriptionParts.join("\n\n"))}`);
  }
  if (session.room) {
    lines.push(`LOCATION:${escapeText(session.room + (event.location ? `, ${event.location}` : ""))}`);
  }
  if (event.url) {
    lines.push(`URL:${event.url}`);
  }
  lines.push("END:VEVENT");

  return lines.map(foldLine).join("\r\n");
}

/** Build a standalone single-event .ics file (used for per-session "Add to calendar" downloads). */
export function buildSingleEventIcs(session: IcsSession, event: IcsEventMeta): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Space Impact Forum//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    buildEvent(session, event),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Build a full VCALENDAR feed containing every session (used for the /schedule.ics subscribe feed). */
export function buildFullScheduleIcs(sessions: IcsSession[], event: IcsEventMeta): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Space Impact Forum//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(event.name)}`,
    `X-WR-TIMEZONE:${event.timezone ?? "Europe/London"}`,
    ...sessions.map((s) => buildEvent(s, event)),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Base64-encode ICS text as a data: URI for a zero-JS "download" anchor href, built at Astro build time. */
export function icsToDataUri(ics: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(ics, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(ics)));
  return `data:text/calendar;charset=utf-8;base64,${base64}`;
}
