export function CirclesList({ topics }) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium mb-2">Suggested Circles</h2>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.id} className="bg-neutral-900 p-4 rounded-lg flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium">{topic.title}</h3>
              <p className="text-xs text-muted-foreground">{topic.description}</p>
            </div>
            <button className="text-muted-foreground hover:text-white">•••</button>
          </li>
        ))}
      </ul>
    </section>
  )
} 