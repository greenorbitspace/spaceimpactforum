// src/pages/schedule.pdf.ts
//
// Generates a branded PDF of the full schedule at build time, from the exact
// same schedule.json/speakers.json that drives Schedule.astro and
// schedule.ics.ts — so it's "dynamically updated" in the sense that it's
// always in sync with the website: edit the data once, every output
// (webpage, .ics feed, .pdf) regenerates from it on the next build.

import type { APIRoute } from "astro";
import schedule from "../data/schedule.json";
import speakers from "../data/speakers.json";
import { generateSchedulePdf, type PdfDay } from "../lib/pdfSchedule";

const speakerNameById = new Map(speakers.map((s) => [s.id, s.name]));

export const GET: APIRoute = async () => {
  const days: PdfDay[] = schedule.days.map((day) => ({
    id: day.id,
    label: day.label,
    date: day.date,
    sessions: day.sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      start: session.start,
      end: session.end,
      room: session.room,
      track: session.track,
      speakerNames: (session.speakerIds ?? [])
        .map((id: string) => speakerNameById.get(id))
        .filter((name): name is string => Boolean(name)),
    })),
  }));

  const pdfBytes = await generateSchedulePdf(days, {
    name: schedule.event.name,
    tagline: schedule.event.tagline,
    startDate: schedule.event.startDate,
    endDate: schedule.event.endDate,
    location: schedule.event.location?.name,
  });

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="space-impact-forum-schedule.pdf"',
    },
  });
};
