import { Link } from "react-router-dom";
import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function ListerRooms() {
  const { user } = useAuth();
  const { rooms } = useApp();

  // --------------------------------------------------
  // GET ONLY ROOMS POSTED BY CURRENT LISTER
  // --------------------------------------------------

  const myRooms = rooms.filter(
    (room) =>
      room.listerId === user?.id ||
      room.listerEmail === user?.email
  );

  // --------------------------------------------------
  // GET MAIN IMAGE
  // --------------------------------------------------

  const getMainImage = (room) => {
    if (
      room.outsidePhotos &&
      room.outsidePhotos.length > 0
    ) {
      return room.outsidePhotos[0];
    }

    if (
      room.insidePhotos &&
      room.insidePhotos.length > 0
    ) {
      return room.insidePhotos[0];
    }

    // Support another possible image field
    if (room.image) {
      return room.image;
    }

    if (
      room.images &&
      room.images.length > 0
    ) {
      return room.images[0];
    }

    return null;
  };

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (status === "pending") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700 border border-red-200";
    }

    return "bg-slate-50 text-slate-700 border border-slate-200";
  };

  return (
    <div className="container-page py-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-teal-700">
            Your property listings
          </p>

          <h1 className="mt-2 text-4xl font-black">
            My Rooms
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            View and manage all the rooms you have posted on
            RoomMate Radar.
          </p>
        </div>

        <Link
          to="/lister/add-room"
          className="rounded-xl bg-teal-700 px-5 py-3 font-black text-white transition hover:bg-teal-800"
        >
          + Post a New Room
        </Link>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-semibold text-slate-500">
            Total Rooms
          </p>

          <p className="mt-2 text-3xl font-black">
            {myRooms.length}
          </p>

        </div>

        {/* APPROVED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-semibold text-slate-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {
              myRooms.filter(
                (room) => room.status === "approved"
              ).length
            }
          </p>

        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-semibold text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-black text-amber-600">
            {
              myRooms.filter(
                (room) => room.status === "pending"
              ).length
            }
          </p>

        </div>

        {/* REJECTED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-semibold text-slate-500">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-black text-red-600">
            {
              myRooms.filter(
                (room) => room.status === "rejected"
              ).length
            }
          </p>

        </div>

      </div>

      {/* =====================================================
          ROOMS
      ===================================================== */}

      {myRooms.length > 0 ? (

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {myRooms.map((room) => {

            const mainImage = getMainImage(room);

            return (
              <article
                key={room.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >

                {/* =================================================
                    ROOM IMAGE
                ================================================= */}

                <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800">

                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={room.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                      No room image available
                    </div>
                  )}

                  {/* STATUS */}

                  <div className="absolute right-3 top-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${getStatusStyle(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    ROOM DETAILS
                ================================================= */}

                <div className="p-5">

                  <h2 className="line-clamp-2 text-xl font-black text-slate-900 dark:text-white">
                    {room.title}
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    📍 {room.area}, {room.city}
                  </p>

                  {/* RENT */}

                  <div className="mt-4 flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Monthly Rent
                      </p>

                      <p className="mt-1 text-xl font-black text-teal-700">
                        ₹{Number(room.rent || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Deposit
                      </p>

                      <p className="mt-1 font-bold text-slate-700 dark:text-slate-300">
                        ₹{Number(room.deposit || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>

                  {/* ROOM TYPE */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    {room.type && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {room.type}
                      </span>
                    )}

                    {room.gender && (
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                        {room.gender}
                      </span>
                    )}

                  </div>

                  {/* AMENITIES */}

                  {room.amenities &&
                    room.amenities.length > 0 && (
                      <div className="mt-4">

                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          Amenities
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {room.amenities
                            .slice(0, 4)
                            .map((amenity, index) => (
                              <span
                                key={index}
                                className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {amenity}
                              </span>
                            ))}

                        </div>

                      </div>
                    )}

                  {/* REQUIREMENTS */}

                  {room.requirements && (
                    <div className="mt-4">

                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Roommate Requirement
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {room.requirements}
                      </p>

                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {room.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {room.description}
                    </p>
                  )}

                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <div className="mt-5">

                    <Link
                      to={`/rooms/${room.id}`}
                      className="block w-full rounded-xl border border-teal-700 py-3 text-center text-sm font-black text-teal-700 transition hover:bg-teal-50 dark:hover:bg-slate-800"
                    >
                      View Room Details
                    </Link>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      ) : (

        /* =====================================================
           NO ROOMS
        ===================================================== */

        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-2xl dark:bg-teal-950">
            🏠
          </div>

          <h2 className="mt-4 text-2xl font-black">
            No rooms posted yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            You have not posted any rooms yet. Add your first room
            and it will appear here.
          </p>

          <Link
            to="/lister/add-room"
            className="mt-6 inline-block rounded-xl bg-teal-700 px-6 py-3 font-black text-white hover:bg-teal-800"
          >
            + Post Your First Room
          </Link>

        </div>

      )}

    </div>
  );
}