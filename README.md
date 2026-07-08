# Space Impact Forum — Dynamic Schedule, Speakers, Sponsors & ICS

Drop these files into the matching paths in `spaceimpactforum` (they replace the
existing files at those paths) and commit. Build was verified locally with
`npm install && npx astro build` — 21 pages built clean, including the new
`/schedule.ics` route.

## What changed

**New/rebuilt files**
- `src/data/schedule.json` — enriched schema: each session now has `description`,
  `track`, `room`, and `speakerIds` (cross-referencing speakers instead of
  duplicating them). `tracks` array at the top drives the filter UI and colour
  taxonomy that was already defined in your CSS (keynote/panel/climate/economic/
  societal/policy/environment/energy/food/urban/break).
- `src/data/speakers.json` — de-duplicated: each speaker now appears once, with
  their session(s) resolved automatically from `schedule.json` rather than
  needing a separate JSON entry per talk.
- `src/data/sponsors.json` — new. Tiered (`platinum`/`gold`/`silver`/`lab`)
  sponsor list that now actually drives `sponsors.astro`.
- `src/lib/ics.ts` — new. Dependency-free RFC 5545 ICS generator: builds both
  single-session `.ics` files and the full-event feed.
- `src/pages/schedule.ics.ts` — new. Static endpoint generated at build time,
  live at `spaceimpactforum.com/schedule.ics`. This is what powers "Subscribe
  in Calendar App" (Google Calendar → Add by URL, Apple Calendar → New
  Calendar Subscription, Outlook → Add calendar → From internet).
- `src/components/Schedule.astro` — rebuilt to render entirely from
  `schedule.json`. Day tabs + a track filter bar, both handled client-side
  with Alpine (already in your stack, so no new JS dependency). Every session
  gets an "Add to Calendar" link that downloads a real `.ics` file — generated
  at build time as a data URI, so it works with zero client-side JS or server
  round-trip. Kept your existing `session-block`/`session-card`/`track` CSS
  classes so the existing responsive styling (mobile breakpoints already in
  `global.css`) just applies.
- `src/components/Speakers.astro` — updated for the new schema, adds
  `id="speaker-{id}"` anchors so schedule session cards can deep-link to a
  speaker, and lists each speaker's actual session(s) pulled live from the
  schedule instead of a hardcoded topic string.
- `src/pages/sponsors.astro` — rebuilt to loop over `sponsors.json` instead of
  hardcoded per-logo HTML.

## What's still placeholder

I don't have your real speaker names/bios, sponsor logos, or confirmed session
titles — I kept the structure realistic (space-sector-flavoured) but it's
sample data. To go live:

1. Edit `src/data/schedule.json` — update `event.startDate` / `endDate` /
   `timezone`, and each session's `title`, `description`, `start`/`end`,
   `room`, and `speakerIds`.
2. Edit `src/data/speakers.json` — real names, titles, companies, bios,
   `image` paths, and social links.
3. Edit `src/data/sponsors.json` — real sponsor names, `logo` paths (drop
   files into `public/assets/images/sponsors/`), and `url`.
4. Nothing else needs to change — Schedule, Speakers and Sponsors pages, and
   the `.ics` feed, all regenerate automatically from those three files.

## Indico integration

Your repo already had `src/lib/indico.ts` and `src/lib/normaliseAgenda.ts` as
stubs, but they didn't match Indico's real API — they assumed a flat
`results` array, when Indico's actual `/export/timetable/{eventId}.json`
response is nested by day (`YYYYMMDD`) and entry ID, with three entry types
(`Contribution`, `Break`, `SessionBlock` — the latter nests further entries
inside it). I've rewritten both against Indico's documented schema and
tested the transform logic against a sample matching their docs.

**Two ways to use Indico, not mutually exclusive:**

1. **Zero code — link straight to Indico's own `.ics` export.** Indico
   natively exports iCal per event/timetable (`{host}/export/timetable/
   {eventId}.ics`). If you're happy pointing "Subscribe in Calendar App"
   directly at Indico instead of my generated `/schedule.ics`, that's a
   one-line link change, no sync needed.
2. **Keep this site's nicer UI (day tabs, track filters, speaker
   cross-linking), but let Indico be the source of truth for content.**
   `scripts/sync-schedule-from-indico.mjs` fetches your Indico timetable,
   normalises it into the same shape as `schedule.json`/`speakers.json`, and
   merges it in:
   - `schedule.json`'s `event` metadata and your custom `tracks` colour
     taxonomy are preserved — only `days`/`sessions` get replaced with the
     fresh Indico pull.
   - `speakers.json` entries you've hand-edited (bio, photo, socials) are
     kept as-is; only genuinely new speakers get added, as stubs with empty
     bio/title/company for you to fill in (Indico's presenter records
     usually only give a name + affiliation, not a bio or photo).

   Run it with:
   ```
   INDICO_HOST=https://your-indico-instance.org \
   INDICO_EVENT_ID=12345 \
   npx tsx scripts/sync-schedule-from-indico.mjs
   ```
   Add `INDICO_API_KEY=...` if the event isn't fully public. `tsx` isn't in
   your `package.json` yet — `npx tsx` fetches it on demand, or add it as a
   devDependency if you'll run this regularly (e.g. in CI before each build).

**What I need from you to actually wire and test this end-to-end:** your
Indico host URL and the numeric event ID for the Forum (and whether it's a
public event or needs an API key). I validated the transform logic against
Indico's documented sample response, but haven't been able to test against
your real instance — field availability (tracks, rooms, presenter
affiliations) can vary a bit by Indico version/config, so it's worth a real
run before you rely on it.

## PDF schedule download

New: `src/pages/schedule.pdf.ts` + `src/lib/pdfSchedule.ts` generate a
branded, multi-page A4 PDF of the full schedule at build time — live at
`spaceimpactforum.com/schedule.pdf` — using [pdf-lib](https://pdf-lib.js.org/)
(pure JS, no headless browser/Puppeteer needed, so it's safe to run in any
CI environment including GitHub Pages Actions).

**"Dynamically updated" means:** it's generated from the exact same
`schedule.json`/`speakers.json` that drives the webpage and the `.ics` feed.
Edit the data once, every output regenerates on the next `astro build` — same
pattern as `schedule.ics.ts`, no separate PDF-maintenance step.

**Styling:** colours and fonts are pulled directly from your actual
`public/styles/global.css` (`--background-color`, `--accent-color`,
`--contrast-color`, and the same per-track badge colours used on the
webpage) rather than an assumed brand kit, so it matches what's actually
live on the site today. Typography uses your real site fonts (Rubik for
headings, Roboto for body).

**Setup — one extra step vs. the rest of this update:** the PDF fonts need
to be real `.ttf`/`.otf` binaries, not `.woff2` — I found that feeding
`.woff2` straight to `pdf-lib` (even though it doesn't throw an error)
produces a PDF that Poppler/Adobe-class renderers reject outright
("Embedded font file may be invalid" on every text draw). `@fontsource`
packages only ship `.woff`/`.woff2`, so I decompressed them with `wawoff2`
into real `.ttf` files first — those are already included in
`src/assets/fonts/pdf/` in this zip, so you don't need to redo that step.
If you ever swap fonts, re-run that conversion rather than pointing at a
`.woff2` directly.

New dependencies (add to your `package.json` if not already merged in):
```
npm install pdf-lib@^1.17.1 @pdf-lib/fontkit@^1.1.1
```
(`@fontsource/roboto`, `@fontsource/rubik`, and `wawoff2` were only needed
transiently to extract/convert the font files — not required at runtime
since the converted `.ttf`s are committed to the repo.)

I also found and fixed a subtler bug while testing: `pdf-lib` applies
OpenType ligature substitution by default (e.g. "ff" → a single ligature
glyph), which silently breaks copy/paste and PDF search for any word
containing a ligature pair ("Coffee Break" extracted as "Co(cid:122)ee
Break"). Ligatures are disabled on embed (`features: { liga: false, rlig:
false }`) so search and accessibility tools read the text correctly.

Validated with `qpdf --check` (no structural errors) and by rasterizing
pages with `pdftoppm` to actually confirm the fonts render — worth doing
again if you change fonts or layout, since a PDF can "successfully" build
while still being broken for real-world viewers, as the ligature/woff2
issues above show.

## Notes / things to sanity-check on your end

- `schedule.ics.ts` needs static output (which your `astro.config.mjs`
  already uses) — it's generated once at build time, not per-request, which
  fits your GitHub Pages deploy.
- ICS times use `DTSTART;TZID=Europe/London` (no embedded VTIMEZONE block).
  I validated the feed against Python's `icalendar` parser and it resolves
  correctly to BST/GMT, and this pattern is accepted by Google/Apple/Outlook
  in practice — but worth a real "add to calendar" test once you're on real
  dates, since strict RFC 5545 technically wants a VTIMEZONE component too.
- The homepage hero/copy elsewhere on the live site still has some inconsistent
  dates (Sept vs Oct) and generic template copy — worth a pass once real dates
  are locked, since `schedule.json`'s `event.startDate`/`endDate` won't
  automatically sync to hero text elsewhere on the site.
