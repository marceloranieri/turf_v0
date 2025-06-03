import { RadarEvent } from "./radar-event"

export function RadarPanel({ events }) {
  return (
    <aside className="lg:w-[300px] bg-neutral-900 p-4 rounded-lg space-y-3 h-fit">
      <h3 className="text-base font-semibold mb-2">Radar</h3>
      {events.map((event) => (
        <RadarEvent
          key={event.id}
          user={event.username}
          action={event.description}
          circleId={event.circle_id}
          time={event.timestamp}
        />
      ))}
    </aside>
  )
} 