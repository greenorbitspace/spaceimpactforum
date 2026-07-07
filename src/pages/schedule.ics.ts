// src/pages/schedule.ics.ts
//
// Generates a static .ics file at build time containing every session in the
// schedule, so people can "Subscribe" to the whole Forum programme in their
// calendar app (Google Calendar > Add by URL, Apple Calendar > New Calendar
// Subscription, Outlook > Add calendar > From internet).

import type { APIRoute } from "astro";
import schedule from "../data/schedule.json";
import speakers from "../data/speakers.json";
import { buildFullScheduleIcs, type IcsSession } from "../lib/ics";

const speakerNameById = new Map(speakers.map((s) => [s.id, s.name]));

export const GET: APIRoute = () => {
  const sessions: IcsSession[] = schedule.days.flatMap((day) =>
    day.sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      room: session.room,
      date: day.date,
      start: session.start,
      end: session.end,
      speakerNames: (session.speakerIds ?? [])
        .map((id: string) => speakerNameById.get(id))
        .filter((name): name is string => Boolean(name)),
    }))
  );

  const ics = buildFullScheduleIcs(sessions, {
    id: schedule.event.id,
    name: schedule.event.name,
    location: schedule.event.location?.name,
    timezone: schedule.event.timezone,
    url: "https://spaceimpactforum.com/#schedule",
  });

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="space-impact-forum-schedule.ics"',
    },
  });
};
