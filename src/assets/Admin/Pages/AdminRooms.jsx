import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useApp } from "../../../ContextAPI/AppContext";

export default function AdminRooms() {
  const {
    rooms,
    approveRoom,
    rejectRoom,
    deleteRoom,
  } = useApp();

  const recordsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Admin should see rooms that have
   * actually entered the review process.
   *
   * Draft rooms are still with the lister.
   */
  const submittedRooms = rooms.filter(
    (room) =>
      room.status === "pending" ||
      room.status === "approved" ||
      room.status === "rejected"
  );

  const totalPages = Math.ceil(
    submittedRooms.length / recordsPerPage
  );

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const currentRooms = submittedRooms.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =====================================================
     APPROVE / REJECT
  ===================================================== */

  const handleAction = async (room, status) => {
    const isApproving = status === "approved";

    const result = await Swal.fire({
      title: isApproving
        ? "Approve this listing?"
        : "Reject this listing?",

      text: room.title,

      icon: isApproving
        ? "question"
        : "warning",

      showCancelButton: true,

      confirmButtonText: isApproving
        ? "Approve"
        : "Reject",

      cancelButtonText: "Cancel",

      confirmButtonColor: isApproving
        ? "#059669"
        : "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (isApproving) {
      approveRoom(room.id);

      await Swal.fire({
        icon: "success",
        title: "Listing approved",
        text: "This room is now visible to users.",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      rejectRoom(room.id);

      await Swal.fire({
        icon: "success",
        title: "Listing rejected",
        text: "The room has been rejected.",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "Delete this listing?",

      text: `${room.title} will be permanently removed.`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    deleteRoom(room.id);

    Swal.fire({
      icon: "success",
      title: "Listing deleted",
      text: "The room listing has been removed.",
      timer: 1300,
      showConfirmButton: false,
    });
  };

  /* =====================================================
     STATUS HELPERS
  ===================================================== */

  const getStatusLabel = (status) => {
    if (status === "pending") {
      return "Pending Admin Approval";
    }

    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return status;
  };

  const getStatusStyles = (status) => {
    if (status === "approved") {
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }

    if (status === "pending") {
      return {
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    }

    return {
      badge:
        "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    };
  };

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-page py-10 md:py-12">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 rounded-full bg-teal-600"></div>

            <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">
              Admin · Listing Review
            </p>
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Room Submissions
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            Review room listings submitted by listers before
            making them available to RoomMate Radar users.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Total submissions
          </p>

          <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {submittedRooms.length}
          </p>
        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        {/* Pending */}

        <div className="group rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900/50 dark:from-amber-950/30 dark:to-slate-900">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                Pending Review
              </p>

              <p className="mt-2 text-4xl font-black text-amber-600">
                {
                  rooms.filter(
                    (room) =>
                      room.status === "pending"
                  ).length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-lg dark:bg-amber-900/40">
              ⏳
            </div>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Listings waiting for your decision
          </p>
        </div>

        {/* Approved */}

        <div className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-slate-900">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Approved
              </p>

              <p className="mt-2 text-4xl font-black text-emerald-600">
                {
                  rooms.filter(
                    (room) =>
                      room.status === "approved"
                  ).length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-900/40">
              ✓
            </div>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Listings currently visible to users
          </p>
        </div>

        {/* Rejected */}

        <div className="group rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-red-900/50 dark:from-red-950/30 dark:to-slate-900">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-red-700">
                Rejected
              </p>

              <p className="mt-2 text-4xl font-black text-red-600">
                {
                  rooms.filter(
                    (room) =>
                      room.status === "rejected"
                  ).length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-100 text-lg dark:bg-red-900/40">
              ✕
            </div>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Listings that were not approved
          </p>
        </div>

      </div>

      {/* =================================================
          ROOM LIST
      ================================================= */}

      <div className="mt-10 space-y-7">

        {currentRooms.length > 0 ? (

          currentRooms.map((room) => {

            const statusStyles =
              getStatusStyles(room.status);

            const mainPhoto =
              room.outsidePhotos?.length > 0
                ? room.outsidePhotos[0]
                : room.insidePhotos?.length > 0
                ? room.insidePhotos[0]
                : null;

            return (
              <article
                key={room.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >

                {/* =================================================
                    TOP COLOR BAR
                ================================================= */}

                <div
                  className={`h-1.5 w-full ${
                    room.status === "approved"
                      ? "bg-emerald-500"
                      : room.status === "pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />

                <div className="p-5 md:p-7">

                  {/* =================================================
                      TOP HEADER
                  ================================================= */}

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex min-w-0 gap-4">

                      {/* Room Thumbnail */}

                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 sm:h-24 sm:w-32">

                        {mainPhoto ? (
                          <img
                            src={mainPhoto}
                            alt={room.title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                            No image
                          </div>
                        )}

                      </div>

                      {/* Title / Basic Info */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${statusStyles.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                            />

                            {getStatusLabel(
                              room.status
                            )}
                          </span>

                          {room.type && (
                            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                              {room.type}
                            </span>
                          )}

                        </div>

                        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                          {room.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">

                          <span>
                            📍 {room.area}, {room.city}
                          </span>

                          <span className="hidden text-slate-300 sm:inline">
                            •
                          </span>

                          <span className="font-black text-teal-700 dark:text-teal-400">
                            ₹
                            {Number(
                              room.rent || 0
                            ).toLocaleString()}
                            /month
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="flex flex-wrap gap-2 lg:justify-end">

                      {room.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(
                                room,
                                "approved"
                              )
                            }
                            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                          >
                            ✓ Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(
                                room,
                                "rejected"
                              )
                            }
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(room)
                        }
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      LISTER INFORMATION
                  ================================================= */}

                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/50">

                      <p className="text-[11px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                        Listed By
                      </p>

                      <div className="mt-3 flex items-center gap-3">

                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-100 text-lg font-black text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {(room.lister ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="font-black text-slate-900 dark:text-white">
                            {room.lister ||
                              "Unknown Lister"}
                          </p>

                          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                            {room.listerEmail ||
                              "Email not available"}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/50">

                      <p className="text-[11px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                        Listing Location
                      </p>

                      <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                        {room.area || "Area not specified"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {room.city ||
                          "City not specified"}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  {room.description && (
                    <div className="mt-6">

                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>

                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                          Room Description
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {room.description}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* =================================================
                      ROOMMATE REQUIREMENT
                  ================================================= */}

                  {room.requirements && (
                    <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5 dark:border-teal-900/50 dark:bg-teal-950/20">

                      <div className="flex gap-3">

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 text-sm dark:bg-teal-900/50">
                          👥
                        </div>

                        <div>

                          <p className="text-xs font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                            Roommate Requirement
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {room.requirements}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      ROOM DETAILS
                  ================================================= */}

                  <div className="mt-6">

                    <div className="mb-3 flex items-center gap-2">

                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>

                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Listing Details
                      </h3>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                      {/* Rent */}

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">

                        <p className="text-xs font-bold text-slate-500">
                          Monthly Rent
                        </p>

                        <p className="mt-2 text-xl font-black text-teal-700 dark:text-teal-400">
                          ₹
                          {Number(
                            room.rent || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      {/* Deposit */}

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">

                        <p className="text-xs font-bold text-slate-500">
                          Token Deposit
                        </p>

                        <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                          ₹
                          {Number(
                            room.deposit || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      {/* Gender */}

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">

                        <p className="text-xs font-bold text-slate-500">
                          Preferred Gender
                        </p>

                        <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                          {room.gender ||
                            "Any"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      ROOM PHOTOS
                  ================================================= */}

                  {(room.outsidePhotos?.length >
                    0 ||
                    room.insidePhotos?.length >
                      0) && (

                    <div className="mt-7">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>

                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                            Room Photos
                          </h3>

                        </div>

                        <span className="text-xs font-bold text-slate-400">
                          {
                            (room.outsidePhotos
                              ?.length ||
                              0) +
                              (room.insidePhotos
                                ?.length ||
                                0)
                          }{" "}
                          photos
                        </span>

                      </div>

                      {/* OUTSIDE PHOTOS */}

                      {room.outsidePhotos?.length >
                        0 && (
                        <div className="mb-6">

                          <p className="mb-3 text-sm font-black text-slate-700 dark:text-slate-300">
                            Outside / Apartment Photos
                          </p>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                            {room.outsidePhotos.map(
                              (
                                photo,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                                >
                                  <img
                                    src={
                                      photo
                                    }
                                    alt={`Outside photo ${
                                      index +
                                      1
                                    }`}
                                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                                  />
                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                      {/* INSIDE PHOTOS */}

                      {room.insidePhotos?.length >
                        0 && (
                        <div>

                          <p className="mb-3 text-sm font-black text-slate-700 dark:text-slate-300">
                            Inside / Room Photos
                          </p>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                            {room.insidePhotos.map(
                              (
                                photo,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                                >
                                  <img
                                    src={
                                      photo
                                    }
                                    alt={`Inside photo ${
                                      index +
                                      1
                                    }`}
                                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                                  />
                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* =================================================
                      BOTTOM ACTION BAR
                  ================================================= */}

                  <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Listing Status
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                        {room.status ===
                        "pending"
                          ? "This listing requires administrator review."
                          : room.status ===
                            "approved"
                          ? "This listing is currently live for users."
                          : "This listing has been rejected."}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {room.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(
                                room,
                                "approved"
                              )
                            }
                            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                          >
                            ✓ Approve Listing
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(
                                room,
                                "rejected"
                              )
                            }
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(room)
                        }
                        className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        🗑 Delete Listing
                      </button>

                    </div>

                  </div>

                </div>
              </article>
            );
          })

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
              🏠
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
              No room submissions found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Rooms will appear here after a lister
              creates a listing and submits it for
              administrator approval.
            </p>

          </div>

        )}

      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              currentPage === 1
                ? "cursor-not-allowed opacity-40"
                : "border-slate-300 hover:border-teal-600 hover:text-teal-700 dark:border-slate-700"
            }`}
          >
            ← Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() =>
                setCurrentPage(page)
              }
              className={`h-11 w-11 rounded-xl border text-sm font-black transition ${
                currentPage === page
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                  : "border-slate-300 hover:border-teal-600 hover:text-teal-700 dark:border-slate-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  totalPages
                )
              )
            }
            disabled={
              currentPage === totalPages
            }
            className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-40"
                : "border-slate-300 hover:border-teal-600 hover:text-teal-700 dark:border-slate-700"
            }`}
          >
            Next →
          </button>

        </div>
      )}

      {/* =================================================
          RECORD INFO
      ================================================= */}

      {submittedRooms.length > 0 && (
        <p className="mt-5 text-center text-xs font-medium text-slate-400">
          Showing{" "}
          {startIndex + 1}–
          {Math.min(
            startIndex +
              recordsPerPage,
            submittedRooms.length
          )}{" "}
          of{" "}
          {submittedRooms.length} submitted
          listings
        </p>
      )}

    </div>
  );
}