import { Link } from "react-router-dom";
import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function ListerDashboard() {
  const { user } = useAuth();
  const { rooms } = useApp();

  const mine = rooms.filter(
    (room) =>
      room.listerId === user.id ||
      room.listerEmail === user.email
  );

  return (
    <div className="container-page py-12">

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <p className="text-sm font-black uppercase tracking-widest text-teal-700">
            Your room listings
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Lister Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your room listings and view their approval status.
          </p>

        </div>

        <Link
          to="/lister/add-room"
          className="rounded-xl bg-teal-700 px-5 py-3 font-black text-white hover:bg-teal-800"
        >
          + Post a Room
        </Link>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            My listings
          </p>

          <p className="mt-2 text-3xl font-black">
            {mine.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {
              mine.filter(
                (r) => r.status === "approved"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Pending review
          </p>

          <p className="mt-2 text-3xl font-black text-amber-600">
            {
              mine.filter(
                (r) => r.status === "pending"
              ).length
            }
          </p>
        </div>

      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">

        <table className="w-full min-w-[750px] text-left text-sm">

          <thead className="bg-slate-50 dark:bg-slate-800">

            <tr>
              <th className="p-4">
                Room
              </th>

              <th className="p-4">
                Location
              </th>

              <th className="p-4">
                Rent
              </th>

              <th className="p-4">
                Roommate Requirement
              </th>

              <th className="p-4">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {mine.map((room) => (
              <tr
                key={room.id}
                className="border-t dark:border-slate-800"
              >

                <td className="p-4 font-bold">
                  {room.title}
                </td>

                <td className="p-4">
                  {room.area}, {room.city}
                </td>

                <td className="p-4">
                  ₹{room.rent}
                </td>

                <td className="max-w-xs p-4 text-slate-500">
                  {room.requirements}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      room.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : room.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {room.status}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {!mine.length && (
          <p className="p-8 text-center text-sm text-slate-500">
            You have not posted any rooms yet.
          </p>
        )}

      </div>
    </div>
  );
}