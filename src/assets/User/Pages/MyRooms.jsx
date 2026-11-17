import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function MyRooms() {
  const { user } = useAuth();

  const {
    rooms,
    getUserRequests,
    markTokenPaid,
  } = useApp();

  const navigate = useNavigate();

  const requests = getUserRequests(user?.id);

  // =====================================================
  // FIND ROOM
  // =====================================================

  const getRoom = (request) => {
    return rooms.find(
      (room) =>
        String(room.id) ===
        String(request.roomId)
    );
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async (request) => {
    try {
      const room = getRoom(request);

      if (!room) {
        await Swal.fire({
          title: "Room not found",
          text: "The room associated with this request could not be found.",
          icon: "error",
          confirmButtonColor: "#0f766e",
        });

        return;
      }

      // -----------------------------------------------
      // TOKEN AMOUNT
      // -----------------------------------------------

      const amount = Number(
        request.paymentAmount ||
        room.deposit ||
        0
      );

      if (amount <= 0) {
        await Swal.fire({
          title: "Invalid token amount",
          text: "The token deposit amount could not be determined.",
          icon: "error",
          confirmButtonColor: "#0f766e",
        });

        return;
      }

      // -----------------------------------------------
      // PAYMENT CONFIRMATION
      // -----------------------------------------------

      const result = await Swal.fire({
        title: "Pay Token Deposit",

        html: `
          <div style="text-align:left">
            <p>
              <b>Room:</b>
              ${request.roomTitle}
            </p>

            <p style="margin-top:8px">
              <b>Lister:</b>
              ${request.listerName}
            </p>

            <p style="
              margin-top:15px;
              padding:12px;
              background:#f0fdfa;
              border-radius:8px;
              font-size:18px;
              color:#0f766e;
            ">
              <b>
                Token Amount:
                ₹${amount.toLocaleString()}
              </b>
            </p>
          </div>
        `,

        icon: "question",

        showCancelButton: true,

        confirmButtonText:
          "Proceed to Payment",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#0f766e",

        cancelButtonColor:
          "#64748b",
      });

      // User clicked Cancel
      if (!result.isConfirmed) {
        return;
      }

      // -----------------------------------------------
      // FRONTEND DEMO PAYMENT
      // -----------------------------------------------

      const paymentReference =
        `RR-${Date.now()}`;

      console.log(
        "Processing token payment...",
        {
          requestId: request.id,
          amount,
          paymentReference,
        }
      );

      // Update shared request state
      const updatedRequest =
        markTokenPaid(
          request.id,
          amount,
          paymentReference
        );

      // -----------------------------------------------
      // CHECK WHETHER PAYMENT WAS UPDATED
      // -----------------------------------------------

      if (!updatedRequest) {
        await Swal.fire({
          title: "Payment Failed",
          text:
            "The payment could not be recorded because the interest request was not found.",
          icon: "error",
          confirmButtonColor: "#0f766e",
        });

        return;
      }

      console.log(
        "Payment recorded successfully:",
        updatedRequest
      );

      // -----------------------------------------------
      // SUCCESS MESSAGE
      // -----------------------------------------------

      await Swal.fire({
        title: "Payment Successful",

        html: `
          <div style="text-align:center">

            

            <p style="
              font-size:16px;
              margin-bottom:10px;
            ">
              Token deposit has been
              <b>paid successfully.</b>
            </p>

            <div style="
              margin-top:15px;
              padding:15px;
              background:#ecfdf5;
              border-radius:10px;
              text-align:left;
            ">

              <p>
                <b>Room:</b>
                ${request.roomTitle}
              </p>

              <p style="margin-top:8px">
                <b>Amount Paid:</b>
                ₹${amount.toLocaleString()}
              </p>

              <p style="margin-top:8px">
                <b>Payment Reference:</b>
                ${paymentReference}
              </p>

              <p style="margin-top:8px">
                <b>Status:</b>
                <span style="color:#059669">
                  PAID
                </span>
              </p>

            </div>

            
          </div>
        `,

        icon: "success",

        confirmButtonText:
          "Done",

        confirmButtonColor:
          "#0f766e",
      });

    } catch (error) {
      console.error(
        "TOKEN PAYMENT ERROR:",
        error
      );

      await Swal.fire({
        title: "Payment Error",

        text:
          "Something went wrong while recording the payment.",

        icon: "error",

        confirmButtonColor:
          "#0f766e",
      });
    }
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (request) => {
    if (
      request.paymentStatus === "paid"
    ) {
      return "Token Paid";
    }

    if (
      request.status === "pending"
    ) {
      return "Pending Approval";
    }

    if (
      request.status === "approved"
    ) {
      return "Approved";
    }

    if (
      request.status === "rejected"
    ) {
      return "Rejected";
    }

    return request.status;
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (request) => {
    if (
      request.paymentStatus === "paid"
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      request.status === "pending"
    ) {
      return "bg-amber-100 text-amber-700";
    }

    if (
      request.status === "approved"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      request.status === "rejected"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  if (!user) {
    return (
      <div className="container-page py-20 text-center">

        <h1 className="text-3xl font-black">
          Login Required
        </h1>

        <p className="mt-3 text-slate-500">
          Please login to view your rooms.
        </p>

        <button
          onClick={() =>
            navigate("/login")
          }
          className="mt-6 rounded-xl bg-teal-700 px-6 py-3 font-black text-white"
        >
          Login
        </button>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container-page py-12">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          My Space
        </p>

        <h1 className="mt-2 text-4xl font-black">
          My Rooms
        </h1>

        <p className="mt-2 text-slate-500">
          Track the rooms you are interested in and
          manage your token payment.
        </p>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Total Interests
          </p>

          <p className="mt-2 text-3xl font-black">
            {requests.length}
          </p>

        </div>

        {/* PENDING */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-black text-amber-600">
            {
              requests.filter(
                (r) =>
                  r.status ===
                  "pending"
              ).length
            }
          </p>

        </div>

        {/* APPROVED */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-black text-blue-600">
            {
              requests.filter(
                (r) =>
                  r.status ===
                    "approved" &&
                  r.paymentStatus !==
                    "paid"
              ).length
            }
          </p>

        </div>

        {/* PAID */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Token Paid
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {
              requests.filter(
                (r) =>
                  r.paymentStatus ===
                  "paid"
              ).length
            }
          </p>

        </div>

      </div>

      {/* =================================================
          REQUEST LIST
      ================================================= */}

      <div className="mt-8 space-y-5">

        {requests.length === 0 ? (

          <div className="rounded-2xl border bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">

            <div className="text-5xl">
              🏠
            </div>

            <h2 className="mt-4 text-xl font-black">
              No rooms yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              When you send interest for a room,
              it will appear here.
            </p>

            <button
              onClick={() =>
                navigate("/rooms")
              }
              className="mt-6 rounded-xl bg-teal-700 px-6 py-3 text-sm font-black text-white hover:bg-teal-800"
            >
              Find Rooms
            </button>

          </div>

        ) : (

          requests.map(
            (request) => {

              const room =
                getRoom(request);

              return (
                <div
                  key={request.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="p-6">

                    {/* HEADER */}

                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div>

                        <p className="text-xs font-black uppercase tracking-widest text-teal-700">
                          My Room Interest
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                          {request.roomTitle}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Lister:
                          {" "}
                          {request.listerName}
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-black ${getStatusClass(
                          request
                        )}`}
                      >
                        {getStatusText(
                          request
                        )}
                      </span>

                    </div>

                    {/* ROOM INFO */}

                    {room && (
                      <div className="mt-6 grid gap-4 md:grid-cols-4">

                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                          <p className="text-xs text-slate-500">
                            Location
                          </p>

                          <p className="mt-1 font-black">
                            {room.area},{" "}
                            {room.city}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                          <p className="text-xs text-slate-500">
                            Monthly Rent
                          </p>

                          <p className="mt-1 font-black">
                            ₹
                            {Number(
                              room.rent ||
                                0
                            ).toLocaleString()}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                          <p className="text-xs text-slate-500">
                            Token Amount
                          </p>

                          <p className="mt-1 font-black">
                            ₹
                            {Number(
                              request.paymentAmount ||
                                room.deposit ||
                                0
                            ).toLocaleString()}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                          <p className="text-xs text-slate-500">
                            Request Date
                          </p>

                          <p className="mt-1 text-sm font-black">
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* =================================================
                        PENDING
                    ================================================= */}

                    {request.status ===
                      "pending" && (

                      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-700">

                        ⏳ Your interest request
                        is waiting for the
                        lister's approval.

                      </div>

                    )}

                    {/* =================================================
                        APPROVED
                    ================================================= */}

                    {request.status ===
                      "approved" &&
                      request.paymentStatus !==
                        "paid" && (

                        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">

                          ✓ Your interest has
                          been approved by the
                          lister. You can now
                          pay the token deposit.

                        </div>

                    )}

                    {/* =================================================
                        PAID
                    ================================================= */}

                    {request.paymentStatus ===
                      "paid" && (

                      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <div>

                            <p className="font-black text-emerald-800">
                              ✓ Token Payment
                              Successful
                            </p>

                            <p className="mt-1 text-sm text-emerald-700">
                              Token amount has been
                              successfully recorded.
                            </p>

                          </div>

                          <span className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                            PAID
                          </span>

                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">

                          <div>

                            <p className="text-xs text-emerald-700">
                              Amount Paid
                            </p>

                            <p className="font-black text-emerald-900">
                              ₹
                              {Number(
                                request.paymentAmount ||
                                  0
                              ).toLocaleString()}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-emerald-700">
                              Payment Reference
                            </p>

                            <p className="font-black text-emerald-900">
                              {request.paymentReference}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-emerald-700">
                              Paid On
                            </p>

                            <p className="font-black text-emerald-900">
                              {request.paidAt
                                ? new Date(
                                    request.paidAt
                                  ).toLocaleString()
                                : "-"}
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        REJECTED
                    ================================================= */}

                    {request.status ===
                      "rejected" && (

                      <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">

                        ✕ Your interest request
                        was rejected by the
                        lister.

                      </div>

                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          navigate(
                            `/rooms/${request.roomId}`
                          )
                        }
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black hover:border-teal-600 hover:text-teal-700 dark:border-slate-700"
                      >
                        View Room
                      </button>

                      {/* PAY TOKEN */}

                      {request.status ===
                        "approved" &&
                        request.paymentStatus !==
                          "paid" && (

                          <button
                            type="button"
                            onClick={() =>
                              handlePayment(
                                request
                              )
                            }
                            className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
                          >
                            Pay Token ₹
                            {Number(
                              request.paymentAmount ||
                                room?.deposit ||
                                0
                            ).toLocaleString()}
                          </button>

                        )}

                    </div>

                  </div>

                </div>
              );
            }
          )

        )}

      </div>

    </div>
  );
}