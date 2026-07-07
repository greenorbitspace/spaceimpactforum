// src/lib/indico.ts
//
// Fetches an event's timetable from a real Indico instance.
// API reference: https://docs.getindico.io/en/stable/http-api/exporters/timetable/
//
//   GET {host}/export/timetable/{eventId}.json?ak={apiKey}
//
// Response shape (real Indico, NOT a flat array):
//   {
//     "results": {
//       "<eventId>": {
//         "20251015": {                     // one key per day, YYYYMMDD
//           "<entryId>": {                  // one key per timetable entry
//             "_type": "Contribution" | "Break" | "SessionBlock",
//             "title": "...",
//             "description": "...",
//             "startDate": { "date": "2025-10-15", "time": "09:00:00", "tz": "Europe/London" },
//             "endDate":   { "date": "2025-10-15", "time": "09:30:00", "tz": "Europe/London" },
//             "room": "Room A" | null,
//             "location": "..." | null,
//             "track": "Climate" | null,
//             "presenters": [ { ... } ],     // Contributions
//             "entries": { ... }             // SessionBlocks nest further entries here, same shape
//           }
//         }
//       }
//     }
//   }

export interface IndicoFetchOptions {
  /** Indico API key (query param `ak`). Omit for a fully public event. */
  apiKey?: string;
  /** Only return publicly-visible data even if the key has broader access. */
  onlyPublic?: boolean;
}

export interface IndicoTimetableResponse {
  results: {
    [eventId: string]: {
      [yyyymmdd: string]: {
        [entryId: string]: IndicoEntry;
      };
    };
  };
}

export interface IndicoEntry {
  _type: "Contribution" | "Break" | "SessionBlock" | string;
  id?: string;
  title: string;
  description?: string;
  startDate: { date: string; time: string; tz: string };
  endDate: { date: string; time: string; tz: string };
  room?: string | null;
  location?: string | null;
  track?: string | null;
  presenters?: IndicoPresenter[];
  /** Only present on SessionBlock entries — nested entries keyed by id, same shape as the top level. */
  entries?: { [entryId: string]: IndicoEntry };
}

export interface IndicoPresenter {
  name?: string;
  fullName?: string;
  firstName?: string;
  familyName?: string;
  affiliation?: string;
}

/**
 * Fetch the raw timetable JSON for a single Indico event.
 * `host` should be the scheme+host only, e.g. "https://indico.example.org".
 */
export async function fetchIndicoTimetable(
  host: string,
  eventId: string,
  options: IndicoFetchOptions = {}
): Promise<IndicoTimetableResponse> {
  const url = new URL(`/export/timetable/${eventId}.json`, host);
  if (options.apiKey) url.searchParams.set("ak", options.apiKey);
  if (options.onlyPublic) url.searchParams.set("onlypublic", "yes");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch Indico timetable: ${res.status} ${res.statusText} (${url})`);
  }

  return (await res.json()) as IndicoTimetableResponse;
}
