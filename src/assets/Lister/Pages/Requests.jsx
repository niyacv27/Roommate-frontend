import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  useApp,
} from "../../../ContextAPI/AppContext";

import {
  useAuth,
} from "../../../ContextAPI/AuthContext";

export default function Requests() {

  const {
    getListerRequests,
    approveInterestRequest,
    rejectInterestRequest,
  } = useApp();

  const {
    user,
  } = useAuth();

  const requests =
    getListerRequests(
      user?.id
    );

  // ==================================================
  // APPROVE
  // ==================================================

  const handleApprove =
    (requestId) => {

      approveInterestRequest(
        requestId
      );

      Swal.fire(
        "Request Approved",
        "The user can now proceed with the token deposit.",
        "success"
      );
    };

  // ==================================================
  // REJECT
  // ==================================================

  const handleReject =
    (requestId) => {

      Swal.fire({
        title:
          "Reject request?",

        text:
          "The user will not be able to proceed with the token deposit.",

        icon:
          "warning",

        showCancelButton:
          true,

        confirmButtonText:
          "Yes, reject",

        cancelButtonText:
          "Cancel",

      }).then(
        (result) => {

          if (
            result.isConfirmed
          ) {

            rejectInterestRequest(
              requestId
            );

            Swal.fire(
              "Request Rejected",
              "The interest request has been rejected.",
              "success"
            );

          }

        }
      );
    };

  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="container-page py-12">

      {/* HEADER */}

      <div>

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          Roommate Requests
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Interest Requests
        </h1>

        <p className="mt-2 text-slate-500">
          Review users who are interested in your rooms.
        </p>

      </div>

      {/* SUMMARY */}

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Total Requests
          </p>

          <p className="mt-2 text-3xl font-black">
            {requests.length}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

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

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

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

        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

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

      {/* REQUEST LIST */}

      <div className="mt-8 space-y-4">

        {!requests.length ? (

          <div className="rounded-2xl border bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">

            <div className="text-5xl">
              📭
            </div>

            <h2 className="mt-4 text-xl font-black">
              No requests yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              When users send interest for your
              rooms, their requests will appear here.
            </p>

          </div>

        ) : (

          requests.map(
            (request) => (

              <div
                key={request.id}
                className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >

                {/* TOP */}

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <p className="text-xs font-black uppercase tracking-widest text-teal-700">
                      Roommate Interest
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {request.userName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {request.userEmail}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      request.paymentStatus ===
                      "paid"

                        ? "bg-emerald-100 text-emerald-700"

                        : request.status ===
                          "pending"

                        ? "bg-amber-50 text-amber-700"

                        : request.status ===
                          "approved"

                        ? "bg-blue-50 text-blue-700"

                        : "bg-red-50 text-red-700"
                    }`}
                  >

                    {request.paymentStatus ===
                    "paid"
                      ? "Token Paid"
                      : request.status}

                  </span>

                </div>

                {/* ROOM */}

                <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                  <p className="text-xs text-slate-500">
                    Interested Room
                  </p>

                  <p className="mt-1 font-black">
                    {request.roomTitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">

                    <span>
                      Token:
                      {" "}
                      <b>
                        ₹
                        {Number(
                          request.paymentAmount ||
                          0
                        ).toLocaleString()}
                      </b>
                    </span>

                    <span>
                      Requested:
                      {" "}
                      <b>
                        {new Date(
                          request.createdAt
                        ).toLocaleDateString()}
                      </b>
                    </span>

                  </div>

                </div>

                {/* PENDING */}

                {request.status ===
                  "pending" && (

                  <div className="mt-5 flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        handleApprove(
                          request.id
                        )
                      }
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white hover:bg-emerald-700"
                    >
                      ✓ Approve Request
                    </button>

                    <button
                      onClick={() =>
                        handleReject(
                          request.id
                        )
                      }
                      className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white hover:bg-red-700"
                    >
                      ✕ Reject Request
                    </button>

                  </div>

                )}

                {/* APPROVED */}

                {request.status ===
                  "approved" &&
                  request.paymentStatus !==
                    "paid" && (

                  <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
                    ✓ Request approved.
                    Waiting for the user to pay
                    the token deposit.
                  </div>

                )}

                {/* PAID */}

                {request.paymentStatus ===
                  "paid" && (

                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div>

                        <p className="font-black text-emerald-800">
                          ✓ Token Amount Paid
                        </p>

                        <p className="mt-1 text-sm text-emerald-700">
                          The user has successfully
                          paid the token deposit.
                        </p>

                      </div>

                      <span className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                        PAID
                      </span>

                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">

                      <div>

                        <p className="text-xs text-emerald-700">
                          Amount Received
                        </p>

                        <p className="mt-1 font-black text-emerald-900">
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

                        <p className="mt-1 font-black text-emerald-900">
                          {request.paymentReference}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-emerald-700">
                          Paid On
                        </p>

                        <p className="mt-1 font-black text-emerald-900">
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

                {/* REJECTED */}

                {request.status ===
                  "rejected" && (

                  <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                    ✕ This interest request has
                    been rejected.
                  </div>

                )}

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}