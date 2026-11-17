import { useMemo, useState } from "react";
import Swal from "sweetalert2";

import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function Roommates() {
  const { user } = useAuth();

  const {
    users,
    addNotification,
  } = useApp();

  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");

  // =====================================================
  // BUILD ROOMMATE LIST
  // =====================================================

  const roommates = useMemo(() => {

    // Start with registered users
    const registeredUsers = users
      .filter((person) => person.status !== "blocked")
      .filter((person) => person.email !== user?.email);

    return registeredUsers.map((person, index) => {

      // Use profile information if available.
      // Otherwise provide safe default values.
      const city =
        person.city ||
        person.location ||
        "Location not added";

      const occupation =
        person.occupation ||
        person.profession ||
        (person.role === "lister"
          ? "Room Lister"
          : "Room Seeker");

      const personBudget =
        Number(person.budget || person.maxBudget || 0);

      const habits =
        person.habits ||
        person.preferences ||
        [];

      return {
        id: person.id || `user-${index}`,
        name: person.name || "User",
        city,
        occupation,
        budget: personBudget,
        habits: Array.isArray(habits)
          ? habits
          : [],
        match: person.match || calculateMatch(person, user),
        role: person.role,
      };
    });

  }, [users, user]);

  // =====================================================
  // SEARCH + BUDGET FILTER
  // =====================================================

  const filtered = roommates.filter((person) => {

    const searchText = `
      ${person.name}
      ${person.city}
      ${person.occupation}
      ${person.habits.join(" ")}
    `.toLowerCase();

    const matchesSearch =
      searchText.includes(search.toLowerCase());

    const matchesBudget =
      !budget ||
      person.budget === 0 ||
      person.budget <= Number(budget);

    return matchesSearch && matchesBudget;
  });

  // =====================================================
  // SEND INTEREST
  // =====================================================

  const request = (person) => {

    if (!user) {
      Swal.fire(
        "Login required",
        "Login to send a roommate request.",
        "info"
      );

      return;
    }

    addNotification(
      "Roommate request sent",
      `Your request was sent to ${person.name}.`
    );

    Swal.fire(
      "Request sent",
      `${person.name} can now review your request.`,
      "success"
    );
  };

  return (
    <div className="container-page py-12">

      {/* =================================================
          HEADER
      ================================================== */}

      <p className="text-sm font-black uppercase tracking-widest text-teal-700">
        Compatibility matching
      </p>

      <h1 className="mt-2 text-4xl font-black">
        Find a compatible roommate
      </h1>

      <p className="mt-3 max-w-2xl text-slate-500">
        Compare lifestyle preferences, budget and location
        before sending an interest request.
      </p>

      {/* =================================================
          FILTERS
      ================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="grid gap-4 md:grid-cols-2">

          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Search Roommates
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, habit..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Maximum Budget
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Maximum budget ₹"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

        </div>

      </div>

      {/* =================================================
          ROOMMATE COUNT
      ================================================== */}

      <div className="mt-8 flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            {filtered.length} roommate(s) found
          </p>

          <h2 className="mt-1 text-2xl font-black">
            All Roommates
          </h2>
        </div>

      </div>

      {/* =================================================
          ROOMMATE CARDS
      ================================================== */}

      {filtered.length > 0 ? (

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filtered.map((person) => (

            <div
              key={person.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >

              {/* Profile header */}
              <div className="flex items-center gap-4">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-teal-100 text-xl font-black text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {person.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="font-black">
                    {person.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {person.occupation}
                  </p>
                </div>

                {/* Match */}
                <div className="ml-auto text-right">

                  <p className="text-2xl font-black text-teal-700">
                    {person.match}%
                  </p>

                  <p className="text-[10px] text-slate-500">
                    match
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="mt-5 space-y-2 text-sm text-slate-500">

                <p>
                  📍 {person.city}
                </p>

                <p>
                  💰{" "}
                  {person.budget > 0
                    ? `Budget up to ₹${person.budget.toLocaleString()}`
                    : "Budget not added"}
                </p>

              </div>

              {/* Habits */}
              {person.habits.length > 0 ? (

                <div className="mt-4 flex flex-wrap gap-2">

                  {person.habits.map((habit) => (

                    <span
                      key={habit}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800"
                    >
                      {habit}
                    </span>

                  ))}

                </div>

              ) : (

                <p className="mt-4 text-xs text-slate-400">
                  No lifestyle preferences added yet.
                </p>

              )}

              {/* Role */}
              {person.role === "lister" && (
                <p className="mt-4 text-xs font-semibold text-teal-700">
                  Room Lister
                </p>
              )}

              {/* Request */}
              <button
                onClick={() => request(person)}
                className="mt-6 w-full rounded-xl bg-teal-700 py-3 text-sm font-black text-white transition hover:bg-teal-800"
              >
                Send Interest
              </button>

            </div>

          ))}

        </div>

      ) : (

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">

          <p className="font-bold">
            No roommates found.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or budget.
          </p>

        </div>

      )}

    </div>
  );
}


// =========================================================
// SIMPLE MATCH CALCULATION
// =========================================================

function calculateMatch(person, currentUser) {

  if (!currentUser) {
    return 80;
  }

  let score = 80;

  // Same city
  if (
    person.city &&
    currentUser.city &&
    person.city.toLowerCase() ===
      currentUser.city.toLowerCase()
  ) {
    score += 8;
  }

  // Similar budget
  if (
    person.budget &&
    currentUser.budget
  ) {
    const difference = Math.abs(
      Number(person.budget) -
      Number(currentUser.budget)
    );

    if (difference <= 1000) {
      score += 7;
    } else if (difference <= 2500) {
      score += 4;
    }
  }

  return Math.min(score, 99);
}