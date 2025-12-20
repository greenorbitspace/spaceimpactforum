export function normaliseAgenda(indicoData: any) {
  return indicoData.results.map((item: any) => ({
    id: item.id,
    title: item.title,
    start: item.start_dt,
    end: item.end_dt,
    track: item.track?.title ?? "General",
    room: item.room?.name ?? "",
    speakers: item.contributions?.flatMap(
      (c: any) => c.speakers?.map((s: any) => s.full_name) ?? []
    )
  }));
}