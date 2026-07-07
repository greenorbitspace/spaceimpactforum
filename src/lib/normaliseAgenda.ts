// src/lib/normaliseAgenda.ts
//
// Transforms a real Indico timetable response (see indico.ts) into the same
// shape used by src/data/schedule.json and src/data/speakers.json, so the
// existing Schedule.astro / Speakers.astro / schedule.ics.ts keep working
// unchanged regardless of whether the data came from Indico or was hand-edited.

import slugify from "slugify";
import type { IndicoEntry, IndicoTimetableResponse } from "./indico";

export interface NormalisedSession {
  id: string;
  type: string;
  track: string;
  title: string;
  description: string;
  start: string; // HH:MM
  end: string; // HH:MM
  room: string;
  speakerIds: string[];
}

export interface NormalisedDay {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
  sessions: NormalisedSession[];
}

export interface NormalisedSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  social: { linkedin: string; twitter: string };
}

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toHHMM(time: string): string {
  // Indico gives "09:00:00" — trim to "09:00".
  return time.slice(0, 5);
}

function entryTypeToTrack(entry: IndicoEntry): { type: string; track: string } {
  if (entry._type === "Break") return { type: "break", track: "networking" };
  if (entry._type === "SessionBlock") return { type: "session-block", track: entry.track ? slugify(entry.track, { lower: true }) : "plenary" };
  // Contribution
  return { type: "contribution", track: entry.track ? slugify(entry.track, { lower: true }) : "general" };
}

function presenterName(p: { name?: string; fullName?: string; firstName?: string; familyName?: string }): string {
  return p.fullName || p.name || [p.firstName, p.familyName].filter(Boolean).join(" ") || "Unknown Speaker";
}

/**
 * Flatten an Indico entry (and, if it's a SessionBlock, its nested entries)
 * into zero or more NormalisedSession objects, collecting any speakers found
 * along the way into the shared `speakersById` map.
 */
function flattenEntry(
  entry: IndicoEntry,
  speakersById: Map<string, NormalisedSpeaker>
): NormalisedSession[] {
  const sessions: NormalisedSession[] = [];

  // SessionBlocks are containers — recurse into their nested entries rather
  // than emitting the block itself as a session.
  if (entry._type === "SessionBlock" && entry.entries) {
    for (const child of Object.values(entry.entries)) {
      sessions.push(...flattenEntry(child, speakersById));
    }
    return sessions;
  }

  const { type, track } = entryTypeToTrack(entry);
  const speakerIds: string[] = [];

  for (const presenter of entry.presenters ?? []) {
    const name = presenterName(presenter);
    const id = slugify(name, { lower: true, strict: true });
    if (!speakersById.has(id)) {
      speakersById.set(id, {
        id,
        name,
        title: "",
        company: presenter.affiliation ?? "",
        bio: "",
        image: "/img/default-speaker.webp",
        social: { linkedin: "", twitter: "" },
      });
    }
    speakerIds.push(id);
  }

  sessions.push({
    id: entry.id ? `indico-${entry.id}` : slugify(`${entry.title}-${entry.startDate.time}`, { lower: true, strict: true }),
    type,
    track,
    title: entry.title,
    description: entry.description ?? "",
    start: toHHMM(entry.startDate.time),
    end: toHHMM(entry.endDate.time),
    room: entry.room || entry.location || "",
    speakerIds,
  });

  return sessions;
}

/**
 * Normalise a full Indico timetable response into `{ days, speakers }`
 * matching the shape of schedule.json's `days` array and speakers.json.
 *
 * Note: this does NOT produce the `event` or `tracks` metadata blocks in
 * schedule.json — those stay hand-curated (title, dates, timezone, and your
 * custom track colour taxonomy), so merge the result in rather than
 * overwriting the whole file. See scripts/sync-schedule-from-indico.mjs.
 */
export function normaliseIndicoTimetable(
  raw: IndicoTimetableResponse,
  eventId: string
): { days: NormalisedDay[]; speakers: NormalisedSpeaker[] } {
  const eventResults = raw.results?.[eventId];
  if (!eventResults) {
    throw new Error(`No results found for Indico event ${eventId}`);
  }

  const speakersById = new Map<string, NormalisedSpeaker>();
  const days: NormalisedDay[] = [];

  const sortedDateKeys = Object.keys(eventResults).sort(); // "20251015" sorts correctly as strings

  for (const dateKey of sortedDateKeys) {
    const entriesForDay = eventResults[dateKey];
    const isoDate = `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
    const weekday = DAY_LABELS[new Date(`${isoDate}T00:00:00`).getDay()];

    const sessions = Object.values(entriesForDay)
      .flatMap((entry) => flattenEntry(entry, speakersById))
      .sort((a, b) => a.start.localeCompare(b.start));

    days.push({
      id: `day-${days.length + 1}`,
      label: weekday,
      date: isoDate,
      sessions,
    });
  }

  return { days, speakers: Array.from(speakersById.values()) };
}
