import { useApp } from "../../../ContextAPI/AppContext";

export default function Notifications() {
  const { notifications, markNotificationsRead } = useApp();

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-black uppercase tracking-widest text-teal-700">Activity</p><h1 className="mt-2 text-4xl font-black">Notifications</h1></div>
        <button onClick={markNotificationsRead} className="rounded-lg border px-4 py-2 text-sm font-bold dark:border-slate-700">Mark all as read</button>
      </div>
      <div className="mt-8 space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`rounded-2xl border p-5 ${n.read ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" : "border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/30"}`}>
            <div className="flex gap-4"><div className="text-xl">🔔</div><div><h2 className="font-black">{n.title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{n.text}</p></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
