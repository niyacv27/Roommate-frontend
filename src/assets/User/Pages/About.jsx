export default function About() {
  return (
    <div className="container-page py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-teal-700">About the project</p>
        <h1 className="mt-2 text-4xl font-black">RoomMate Radar</h1>
        <p className="mt-5 text-base leading-8 text-slate-500">RoomMate Radar is a full-stack MERN project concept designed to solve the practical problem of finding suitable shared housing and compatible roommates.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-black">Problem addressed</h2><p className="mt-3 text-sm leading-7 text-slate-500">Users often depend on scattered listings and informal contacts. This platform creates a structured workflow for room discovery, roommate preferences, listing review and secure token-payment integration.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-black">Three modules</h2><p className="mt-3 text-sm leading-7 text-slate-500">Admin controls the platform, listers submit rooms and roommate requirements, and normal users discover approved rooms and suitable roommates.</p></div>
      </div>
    </div>
  );
}
