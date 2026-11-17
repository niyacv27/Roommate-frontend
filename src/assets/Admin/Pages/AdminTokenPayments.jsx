import { useApp } from "../../../ContextAPI/AppContext";

export default function AdminTokenPayments() {

  const {
    requests,
    rooms,
  } = useApp();

  const getRoom =
    (request) => {

      return rooms.find(
        (room) =>
          String(room.id) ===
          String(request.roomId)
      );
    };

  const paidRequests =
    requests.filter(
      (request) =>
        request.paymentStatus ===
        "paid"
    );

  const totalAmount =
    paidRequests.reduce(
      (sum, request) =>
        sum +
        Number(
          request.paymentAmount ||
          0
        ),
      0
    );

  return (

    <div className="container-page py-12">

      <div>

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Token Payments
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor token deposits made for approved room interests.
        </p>

      </div>

      {/* SUMMARY */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Total Payments
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {paidRequests.length}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Token Amount Collected
          </p>

          <p className="mt-2 text-3xl font-black text-teal-700">
            ₹
            {totalAmount.toLocaleString()}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Total Interest Requests
          </p>

          <p className="mt-2 text-3xl font-black">
            {requests.length}
          </p>

        </div>

      </div>

      {/* PAYMENT LIST */}

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {!paidRequests.length ? (

          <div className="p-12 text-center">

            <div className="text-5xl">
              💳
            </div>

            <h2 className="mt-4 text-xl font-black">
              No token payments yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Paid token deposits will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 dark:bg-slate-800">

                <tr>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Room
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Lister
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Reference
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Paid On
                  </th>

                </tr>

              </thead>

              <tbody>

                {paidRequests.map(
                  (request) => {

                    const room =
                      getRoom(
                        request
                      );

                    return (

                      <tr
                        key={request.id}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >

                        <td className="px-5 py-5">

                          <p className="font-black">
                            {request.userName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {request.userEmail}
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <p className="font-bold">
                            {request.roomTitle}
                          </p>

                          {room && (
                            <p className="text-xs text-slate-500">
                              {room.area}, {room.city}
                            </p>
                          )}

                        </td>

                        <td className="px-5 py-5 font-bold">
                          {request.listerName}
                        </td>

                        <td className="px-5 py-5">

                          <p className="font-black text-teal-700">
                            ₹
                            {Number(
                              request.paymentAmount ||
                              0
                            ).toLocaleString()}
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                            ✓ PAID
                          </span>

                        </td>

                        <td className="px-5 py-5 text-xs font-bold">
                          {request.paymentReference}
                        </td>

                        <td className="px-5 py-5 text-xs text-slate-500">
                          {request.paidAt
                            ? new Date(
                                request.paidAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}