export default function Timeline({ events = [] }) {
  return (
    <ol className="relative border-l border-gray-300 ml-3">
      {events.map((e) => (
        <li key={e.id} className="mb-6 ml-4">
          <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-1.25 border border-white" />
          <time className="text-xs text-gray-400">{new Date(e.created_at).toLocaleString()}</time>
          <div className="font-medium capitalize">{e.event.replace(/_/g, " ")}</div>
          {e.note && <div className="text-sm text-gray-500">{e.note}</div>}
          {e.actor_name && <div className="text-xs text-gray-400">by {e.actor_name}</div>}
        </li>
      ))}
    </ol>
  );
}
