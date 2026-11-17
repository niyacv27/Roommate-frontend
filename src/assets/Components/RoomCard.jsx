import { Link } from "react-router-dom";

export default function RoomCard({ room }) {

  // Get the first available room image
  const mainPhoto =
    room.outsidePhotos?.length > 0
      ? room.outsidePhotos[0]
      : room.insidePhotos?.length > 0
      ? room.insidePhotos[0]
      : room.image ||
        room.imageUrl ||
        null;

  // Find lister name
  const listerName =
    room.lister ||
    room.listerName ||
    room.ownerName ||
    (room.listerEmail
      ? room.listerEmail.split("@")[0]
      : "Room Lister");

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">

      {/* =====================================================
          ROOM IMAGE
      ====================================================== */}

      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">

        {mainPhoto ? (
          <img
            src={mainPhoto}
            alt={room.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            No room image available
          </div>
        )}

        {/* Room type */}
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-black text-white">
          {room.type || "Room"}
        </span>

        {/* Approved badge */}
        {room.status === "approved" && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            ✓ Approved
          </span>
        )}

        {/* Location */}
        <span className="absolute bottom-3 left-3 rounded-lg bg-slate-900/80 px-3 py-1 text-xs font-bold text-white">
          {room.city} · {room.area}
        </span>

      </div>

      {/* =====================================================
          ROOM INFORMATION
      ====================================================== */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {room.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {room.description || "Comfortable room available."}
            </p>
          </div>

        </div>

        {/* Rent */}
        <div className="mt-4 flex items-center gap-5 text-sm">

          <div>
            <p className="text-xs text-slate-500">
              Monthly Rent
            </p>

            <p className="mt-1 font-black text-teal-700">
              ₹{Number(room.rent || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Deposit
            </p>

            <p className="mt-1 font-black">
              ₹{Number(room.deposit || 0).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Amenities */}
        {room.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">

            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {amenity}
              </span>
            ))}

          </div>
        )}

        {/* =================================================
            LISTER INFORMATION
        ================================================== */}

        <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Posted by
          </p>

          <div className="mt-1 flex items-center gap-2">

            <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 font-black text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {listerName.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="text-sm font-black">
                {listerName}
              </p>

              {room.listerEmail && (
                <p className="text-xs text-slate-500">
                  {room.listerEmail}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            VIEW DETAILS
        ================================================== */}

        <Link
          to={`/rooms/${room.id}`}
          className="mt-5 block w-full rounded-xl bg-teal-700 py-3 text-center text-sm font-black text-white transition hover:bg-teal-800"
        >
          View Room Details
        </Link>

      </div>

    </article>
  );
}