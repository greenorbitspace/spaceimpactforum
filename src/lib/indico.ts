export async function fetchIndicoTimetable(eventId: string) {
  const url = `https://events.example.org/export/timetable/${eventId}.json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch Indico timetable");
  }

  const data = await res.json();

  return data;
}