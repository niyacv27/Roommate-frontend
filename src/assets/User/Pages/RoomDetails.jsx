import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function RoomDetails() {

  const { id } = useParams();

  const {
    rooms,
    addNotification,
    createInterestRequest,
    getRoomRequest,
    markTokenPaid,
  } = useApp();

  const { user } = useAuth();

  // ==================================================
  // FIND ROOM
  // ==================================================

  const room = rooms.find(
    (r) =>
      String(r.id) ===
      String(id)
  );

  // ==================================================
  // STATES
  // ==================================================

  const [
    currentImage,
    setCurrentImage,
  ] = useState(0);

  const [
    request,
    setRequest,
  ] = useState(null);

  const [
    loadingRequest,
    setLoadingRequest,
  ] = useState(true);

  // ==================================================
  // CHECK REQUEST
  // ==================================================

  useEffect(() => {

    if (!user || !room) {

      setRequest(null);
      setLoadingRequest(false);

      return;
    }

    const existingRequest =
      getRoomRequest(
        room.id,
        user.id
      );

    setRequest(
      existingRequest ||
      null
    );

    setLoadingRequest(false);

  }, [
    user,
    room,
    getRoomRequest,
  ]);

  // ==================================================
  // IMPORTANT:
  // When AppContext request changes,
  // update RoomDetails request.
  // ==================================================

  useEffect(() => {

    if (!user || !room) {
      return;
    }

    const updatedRequest =
      getRoomRequest(
        room.id,
        user.id
      );

    setRequest(
      updatedRequest ||
      null
    );

  }, [
    rooms,
    user,
    room,
    getRoomRequest,
  ]);

  // ==================================================
  // ROOM NOT FOUND
  // ==================================================

  if (!room) {

    return (
      <div className="container-page py-20 text-center">

        <h1 className="text-3xl font-black">
          Room not found
        </h1>

        <Link
          className="mt-4 inline-block font-bold text-teal-700"
          to="/rooms"
        >
          Back to rooms
        </Link>

      </div>
    );
  }

  // ==================================================
  // PHOTOS
  // ==================================================

  const photos = [
    ...(room.outsidePhotos || []),
    ...(room.insidePhotos || []),
  ];

  const hasPhotos =
    photos.length > 0;

  // ==================================================
  // IMAGE CONTROLS
  // ==================================================

  const previousImage =
    () => {

      setCurrentImage(
        (prev) =>
          prev === 0
            ? photos.length - 1
            : prev - 1
      );
    };

  const nextImage =
    () => {

      setCurrentImage(
        (prev) =>
          prev ===
          photos.length - 1
            ? 0
            : prev + 1
      );
    };

  // ==================================================
  // SEND INTEREST
  // ==================================================

  const interest = () => {

    if (!user) {

      return Swal.fire(
        "Login required",
        "Please login to send roommate interest.",
        "info"
      );
    }

    if (user.role !== "user") {

      return Swal.fire(
        "Not allowed",
        "Only users looking for a room can send interest requests.",
        "warning"
      );
    }

    if (!room.listerId) {

      return Swal.fire(
        "Error",
        "This room does not have a lister assigned.",
        "error"
      );
    }

    if (
      request?.status ===
      "pending"
    ) {

      return Swal.fire(
        "Already sent",
        "Your interest request is already waiting for the lister.",
        "info"
      );
    }

    if (
      request?.status ===
      "approved"
    ) {

      return Swal.fire(
        "Already approved",
        "Your request has already been approved.",
        "success"
      );
    }

    const requestData = {

      roomId:
        room.id,

      roomTitle:
        room.title,

      userId:
        user.id,

      userName:
        user.name,

      userEmail:
        user.email,

      listerId:
        room.listerId,

      listerName:
        room.lister,

      status:
        "pending",

      // ==========================================
      // TOKEN AMOUNT
      // ==========================================

      paymentAmount:
        Number(
          room.deposit ||
          0
        ),

      paymentStatus:
        "not_paid",
    };

    const newRequest =
      createInterestRequest(
        requestData
      );

    setRequest(
      newRequest
    );

    addNotification(
      "Roommate interest sent",
      `Your interest was sent for ${room.title}.`
    );

    Swal.fire(
      "Request sent",
      "The room lister can now review your interest request.",
      "success"
    );
  };

  // ==================================================
  // TOKEN PAYMENT
  // ==================================================

  const deposit = async () => {

    if (!user) {

      return Swal.fire(
        "Login required",
        "Please login before paying a token deposit.",
        "info"
      );
    }

    if (
      request?.status !==
      "approved"
    ) {

      return Swal.fire(
        "Approval required",
        "The room lister must approve your interest request before you can pay the token deposit.",
        "info"
      );
    }

    if (
      request?.paymentStatus ===
      "paid"
    ) {

      return Swal.fire(
        "Already paid",
        "The token deposit has already been paid successfully.",
        "success"
      );
    }

    const amount =
      Number(
        request.paymentAmount ||
        room.deposit ||
        0
      );

    const result =
      await Swal.fire({

        title:
          "Token Deposit",

        html: `
          <p>
            <b>Room:</b>
            ${room.title}
          </p>

          <p style="margin-top:10px">
            <b>Lister:</b>
            ${room.lister}
          </p>

          <p style="margin-top:10px;font-size:18px">
            <b>Token Amount:
            ₹${amount.toLocaleString()}</b>
          </p>
        `,

        icon:
          "question",

        showCancelButton:
          true,

        confirmButtonText:
          "Pay Token",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#0f766e",
      });

    if (
      !result.isConfirmed
    ) {
      return;
    }

    // ===============================================
    // FRONTEND-ONLY PAYMENT
    // ===============================================

    const paymentReference =
      `RR-${Date.now()}`;

    markTokenPaid(
      request.id,
      amount,
      paymentReference
    );

    setRequest(
      (prev) => ({
        ...prev,

        paymentStatus:
          "paid",

        paymentAmount:
          amount,

        paymentReference:
          paymentReference,

        paidAt:
          new Date()
            .toISOString(),
      })
    );

    await Swal.fire({

      title:
        "Payment Successful",

      html: `
        <p>
          Token deposit has been successfully recorded.
        </p>

        <p style="margin-top:10px">
          <b>Amount Paid:</b>
          ₹${amount.toLocaleString()}
        </p>

        <p style="margin-top:10px">
          <b>Payment Reference:</b>
          ${paymentReference}
        </p>
      `,

      icon:
        "success",

      confirmButtonText:
        "Done",

      confirmButtonColor:
        "#0f766e",
    });
  };

  // ==================================================
  // INTEREST BUTTON
  // ==================================================

  const getInterestButtonText =
    () => {

      if (
        loadingRequest
      ) {
        return "Checking request...";
      }

      if (
        request?.status ===
        "pending"
      ) {
        return "Interest Request Pending";
      }

      if (
        request?.status ===
        "approved"
      ) {
        return "Interest Approved";
      }

      if (
        request?.status ===
        "rejected"
      ) {
        return "Send Interest Again";
      }

      return "Send Roommate Interest";
    };

  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="container-page py-12">

      {/* BACK */}

      <Link
        to="/rooms"
        className="font-bold text-teal-700"
      >
        ← Back to rooms
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">

        {/* =================================================
            LEFT
        ================================================= */}

        <div>

          {/* IMAGE */}

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="relative h-[460px]">

              {hasPhotos ? (

                <img
                  src={photos[currentImage]}
                  alt={room.title}
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
                  No room image available
                </div>

              )}

              {photos.length > 1 && (
                <>
                  <button
                    onClick={
                      previousImage
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-4 py-3 text-white"
                  >
                    ‹
                  </button>

                  <button
                    onClick={
                      nextImage
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-4 py-3 text-white"
                  >
                    ›
                  </button>

                  <span className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-4 py-2 text-xs font-black text-white">
                    {currentImage + 1}
                    {" / "}
                    {photos.length}
                  </span>
                </>
              )}

            </div>

            {/* THUMBNAILS */}

            {photos.length > 1 && (

              <div className="flex gap-3 p-4">

                {photos.map(
                  (photo, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        setCurrentImage(
                          index
                        )
                      }
                      className={`h-20 w-24 overflow-hidden rounded-xl border-2 ${
                        index ===
                        currentImage
                          ? "border-teal-600"
                          : "border-transparent"
                      }`}
                    >

                      <img
                        src={photo}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* ROOM INFO */}

          <div className="mt-6 rounded-2xl bg-teal-800 p-7 text-white">

            <p className="text-sm font-bold text-teal-200">
              {room.type}
            </p>

            <h1 className="mt-2 text-4xl font-black">
              {room.title}
            </h1>

            <p className="mt-3 text-teal-100">
              📍 {room.area}, {room.city}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-teal-100">
                  Monthly Rent
                </p>

                <p className="mt-1 text-2xl font-black">
                  ₹
                  {Number(
                    room.rent ||
                    0
                  ).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-teal-100">
                  Token Deposit
                </p>

                <p className="mt-1 text-2xl font-black">
                  ₹
                  {Number(
                    room.deposit ||
                    0
                  ).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-teal-100">
                  Gender
                </p>

                <p className="mt-1 text-2xl font-black">
                  {room.gender}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <aside className="rounded-2xl border bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-xl font-black">
            Listing details
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            {room.description}
          </p>

          <h3 className="mt-6 font-black">
            Amenities
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">

            {room.amenities?.map(
              (amenity) => (

                <span
                  key={amenity}
                  className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-slate-800"
                >
                  {amenity}
                </span>

              )
            )}

          </div>

          <h3 className="mt-6 font-black">
            Roommate requirements
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            {room.requirements}
          </p>

          {/* =================================================
              REQUEST STATUS
          ================================================= */}

          {user &&
            request && (

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Interest Request Status
                </p>

                {request.status ===
                  "pending" && (

                  <p className="mt-2 font-bold text-amber-600">
                    ⏳ Waiting for lister approval
                  </p>

                )}

                {request.status ===
                  "approved" &&
                  request.paymentStatus !==
                    "paid" && (

                  <p className="mt-2 font-bold text-emerald-600">
                    ✓ Approved by lister
                  </p>

                )}

                {request.status ===
                  "rejected" && (

                  <p className="mt-2 font-bold text-red-600">
                    ✕ Rejected by lister
                  </p>

                )}

                {request.paymentStatus ===
                  "paid" && (

                  <div className="mt-3 rounded-xl bg-emerald-100 p-4">

                    <p className="font-black text-emerald-800">
                      ✓ Token Paid Successfully
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      ₹
                      {Number(
                        request.paymentAmount ||
                        0
                      ).toLocaleString()}
                      {" "}paid successfully.
                    </p>

                    <p className="mt-1 text-xs text-emerald-600">
                      Reference:
                      {" "}
                      {request.paymentReference}
                    </p>

                  </div>

                )}

              </div>

            )}

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-7 space-y-3">

            {/* PAYMENT */}

            {request?.status ===
              "approved" &&
              request?.paymentStatus !==
                "paid" && (

              <button
                onClick={
                  deposit
                }
                className="w-full rounded-xl bg-teal-700 py-3 font-black text-white hover:bg-teal-800"
              >
                Pay Token Deposit
              </button>

            )}

            {request?.paymentStatus ===
              "paid" && (

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-emerald-100 py-3 font-black text-emerald-700"
              >
                ✓ Token Paid Successfully
              </button>

            )}

            {!request &&
              !loadingRequest && (

              <button
                onClick={
                  interest
                }
                className="w-full rounded-xl bg-teal-700 py-3 font-black text-white hover:bg-teal-800"
              >
                Send Roommate Interest
              </button>

            )}

            {request?.status ===
              "pending" && (

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-amber-100 py-3 font-black text-amber-700"
              >
                Interest Request Pending
              </button>

            )}

            {request?.status ===
              "approved" &&
              request?.paymentStatus !==
                "paid" && (

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-emerald-100 py-3 font-black text-emerald-700"
              >
                ✓ Interest Approved
              </button>

            )}

            {request?.status ===
              "rejected" && (

              <button
                onClick={
                  interest
                }
                className="w-full rounded-xl border border-slate-300 py-3 font-black hover:border-teal-600 hover:text-teal-700"
              >
                Send Interest Again
              </button>

            )}

          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Lister: {room.lister}
          </p>

        </aside>

      </div>

    </div>
  );
}