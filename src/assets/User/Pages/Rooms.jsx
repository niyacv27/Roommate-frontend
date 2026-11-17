import { useMemo, useState } from "react";
import RoomCard from "../../Components/RoomCard";
import { useApp } from "../../../ContextAPI/AppContext";

export default function Rooms() {
  const { rooms } = useApp();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [maxRent, setMaxRent] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  // Get available cities from rooms
  const cities = [
    ...new Set(
      rooms
        .filter((room) => room.status === "approved")
        .map((room) => room.city)
        .filter(Boolean)
    ),
  ];

  // Filter approved rooms
  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      // Only approved rooms are visible to normal users
      if (room.status !== "approved") {
        return false;
      }

      const text = `
        ${room.title || ""}
        ${room.city || ""}
        ${room.area || ""}
        ${room.description || ""}
        ${room.lister || ""}
        ${room.listerName || ""}
        ${room.listerEmail || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesCity =
        city === "All" || room.city === city;

      const matchesType =
        type === "All" || room.type === type;

      const matchesRent =
        !maxRent || Number(room.rent) <= Number(maxRent);

      return (
        matchesSearch &&
        matchesCity &&
        matchesType &&
        matchesRent
      );
    });
  }, [rooms, search, city, type, maxRent]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const current = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const reset = () => {
    setSearch("");
    setCity("All");
    setType("All");
    setMaxRent("");
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCity = (value) => {
    setCity(value);
    setPage(1);
  };

  const handleType = (value) => {
    setType(value);
    setPage(1);
  };

  const handleRent = (value) => {
    setMaxRent(value);
    setPage(1);
  };

  return (
    <div className="container-page py-12">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          Room discovery
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Find your next room
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Search approved listings using keywords, location,
          room type and budget.
        </p>
      </div>

      {/* =====================================================
          FILTER SECTION
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Search Rooms
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Location
            </label>

            <select
              value={city}
              onChange={(e) => handleCity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="All">
                All Locations
              </option>

              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Room Type
            </label>

            <select
              value={type}
              onChange={(e) => handleType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="All">
                All Room Types
              </option>

              <option value="Single Room">
                Single Room
              </option>

              <option value="Shared Room">
                Shared Room
              </option>
            </select>
          </div>

          {/* Maximum Rent */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Maximum Rent
            </label>

            <input
              type="number"
              value={maxRent}
              onChange={(e) => handleRent(e.target.value)}
              placeholder="Maximum rent ₹"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        {/* Clear button */}
        <button
          onClick={reset}
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Clear Filters
        </button>
      </div>

      {/* =====================================================
          RESULTS COUNT
      ====================================================== */}

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {filtered.length} approved room(s) found
        </p>
      </div>

      {/* =====================================================
          ROOM CARDS
      ====================================================== */}

      {current.length > 0 ? (
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {current.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">

          <p className="font-bold">
            No matching rooms found.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

        </div>
      )}

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {filtered.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-3">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
          >
            Previous
          </button>

          <span className="px-3 text-sm font-bold">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}