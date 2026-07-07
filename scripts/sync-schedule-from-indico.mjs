#!/usr/bin/env node
// scripts/sync-schedule-from-indico.mjs
//
// Pulls the timetable from a real Indico event and merges it into
// src/data/schedule.json and src/data/speakers.json.
//
// Usage:
//   INDICO_HOST=https://indico.example.org INDICO_EVENT_ID=12345 node scripts/sync-schedule-from-indico.mjs
//   (add INDICO_API_KEY=... if the event isn't fully public)
//
// This is deliberately a manual/CI script rather than something that runs
// inside `astro build` — Indico is the source of truth for session content,
// but `event` metadata (title, dates, timezone) and your custom `tracks`
// colour taxonomy in schedule.json stay hand-curated and are preserved.
// Existing speaker bios/photos/socials in speakers.json are also preserved;
// only genuinely new speakers get added (as stubs you'll want to fill in).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEDULE_PATH = path.join(__dirname, "../src/data/schedule.json");
const SPEAKERS_PATH = path.join(__dirname, "../src/data/speakers.json");

async function main() {
  const host = process.env.INDICO_HOST;
  const eventId = process.env.INDICO_EVENT_ID;
  const apiKey = process.env.INDICO_API_KEY;

  if (!host || !eventId) {
    console.error("Set INDICO_HOST and INDICO_EVENT_ID environment variables.");
    console.error('Example: INDICO_HOST=https://indico.example.org INDICO_EVENT_ID=12345 node scripts/sync-schedule-from-indico.mjs');
    process.exit(1);
  }

  // Dynamic import so this plain Node script can reuse the TypeScript-authored
  // lib files via tsx/ts-node if configured, or you can compile them first.
  // Simplest path: run this script with `npx tsx scripts/sync-schedule-from-indico.mjs`.
  const { fetchIndicoTimetable } = await import("../src/lib/indico.ts");
  const { normaliseIndicoTimetable } = await import("../src/lib/normaliseAgenda.ts");

  console.log(`Fetching Indico timetable from ${host} (event ${eventId})...`);
  const raw = await fetchIndicoTimetable(host, eventId, { apiKey });
  const { days, speakers: indicoSpeakers } = normaliseIndicoTimetable(raw, eventId);

  const existingSchedule = JSON.parse(await readFile(SCHEDULE_PATH, "utf-8"));
  const existingSpeakers = JSON.parse(await readFile(SPEAKERS_PATH, "utf-8"));
  const existingSpeakerIds = new Set(existingSpeakers.map((s) => s.id));

  // Merge speakers: keep hand-edited entries untouched, append new stubs only.
  const newSpeakers = indicoSpeakers.filter((s) => !existingSpeakerIds.has(s.id));
  const mergedSpeakers = [...existingSpeakers, ...newSpeakers];

  // Merge schedule: keep event metadata + tracks, replace days with the fresh Indico pull.
  const mergedSchedule = {
    ...existingSchedule,
    days,
  };

  await writeFile(SCHEDULE_PATH, JSON.stringify(mergedSchedule, null, 2) + "\n");
  await writeFile(SPEAKERS_PATH, JSON.stringify(mergedSpeakers, null, 2) + "\n");

  console.log(`✓ Wrote ${days.reduce((n, d) => n + d.sessions.length, 0)} sessions across ${days.length} day(s).`);
  console.log(`✓ ${newSpeakers.length} new speaker stub(s) added (${existingSpeakers.length} existing kept as-is).`);
  if (newSpeakers.length > 0) {
    console.log("  New speaker ids:", newSpeakers.map((s) => s.id).join(", "));
    console.log("  These have empty bio/title/company/image — fill them in by hand or via Indico's author profile data if you extend the normaliser.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
