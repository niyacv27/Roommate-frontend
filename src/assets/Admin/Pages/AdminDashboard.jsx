import { Link } from "react-router-dom";
import { useApp } from "../../../ContextAPI/AppContext";

export default function AdminDashboard() {
  const { rooms, users } = useApp();

  const stats = [
    ["Total users", users.length, "blue"],
    [
      "Room listers",
      users.filter((u) => u.role === "lister").length,
      "teal",
    ],
    [
      "Pending listings",
      rooms.filter((r) => r.status === "pending").length,
      "amber",
    ],
    [
      "Approved rooms",
      rooms.filter((r) => r.status === "approved").length,
      "green",
    ],
  ];

  return (
    <div className="container-page py-12">

      <p className="text-sm font-black uppercase tracking-widest text-teal-700">
        Platform administration
      </p>

      <h1 className="mt-2 text-4xl font-black">
        Admin Dashboard
      </h1>

      <p className="mt-3 max-w-2xl text-slate-500">
        Manage users, review room listings and monitor activity
        across RoomMate Radar.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500">
              {label}
            </p>

            <p className="mt-2 text-3xl font-black">
              {value}
            </p>
          </div>
        ))}

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Link
          to="/admin/rooms"
          className="rounded-2xl border bg-white p-7 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-black text-teal-700">
            LISTING CONTROL
          </p>

          <h2 className="mt-2 text-xl font-black">
            Review room submissions →
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Review room information submitted by listers
            before making listings available to users.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="rounded-2xl border bg-white p-7 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-black text-teal-700">
            USER CONTROL
          </p>

          <h2 className="mt-2 text-xl font-black">
            Manage platform users →
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View registered users, room listers and their
            account status.
          </p>
        </Link>

      </div>
    </div>
  );
}