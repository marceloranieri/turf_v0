
  return (
    <aside className="lg:w-[300px] bg-neutral-900 p-4 rounded-lg space-y-3 h-fit">
      {events.map((event) => (
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