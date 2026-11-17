import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useApp } from "../../../ContextAPI/AppContext";

export default function AdminUsers() {
  const { users } = useApp();

  // Number of records displayed on one page
  const recordsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);

  // IDs of users hidden from this admin page only
  const [deletedUserIds, setDeletedUserIds] = useState([]);

  // IDs of users blocked from this admin page only
  const [blockedUserIds, setBlockedUserIds] = useState([]);

  /*
   * Remove deleted users from the list.
   *
   * IMPORTANT:
   * We are NOT changing the users state from AppContext.
   * Therefore localStorage is not changed.
   */
  const visibleUsers = users.filter(
    (user) => !deletedUserIds.includes(user.id)
  );

  // Pagination calculations
  const totalPages = Math.ceil(
    visibleUsers.length / recordsPerPage
  );

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const currentUsers = visibleUsers.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  /*
   * If deleting a user causes the current page
   * to become invalid, move to the previous page.
   */
  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Generate page numbers
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Block / Unblock user
  const toggleBlockUser = (user) => {
    const isBlocked = blockedUserIds.includes(user.id);

    if (isBlocked) {
      setBlockedUserIds((prev) =>
        prev.filter((id) => id !== user.id)
      );

      Swal.fire({
        icon: "success",
        title: "User unblocked",
        text: `${user.name} has been unblocked.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      setBlockedUserIds((prev) => [
        ...prev,
        user.id,
      ]);

      Swal.fire({
        icon: "success",
        title: "User blocked",
        text: `${user.name} has been blocked.`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // Delete user from THIS PAGE ONLY
  const deleteUser = (user) => {
    Swal.fire({
      title: "Delete this user from the page?",
      text: `${user.name} will be removed from the current admin view.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletedUserIds((prev) => [
          ...prev,
          user.id,
        ]);

        // If deleted user was blocked, remove that ID too
        setBlockedUserIds((prev) =>
          prev.filter((id) => id !== user.id)
        );

        Swal.fire({
          icon: "success",
          title: "User deleted",
          text: "The user was removed from this page only.",
          timer: 1300,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="container-page py-12">

      {/* Heading */}

      <p className="text-sm font-black uppercase tracking-widest text-teal-700">
        Admin · User control
      </p>

      <h1 className="mt-2 text-4xl font-black">
        Users
      </h1>

      <p className="mt-3 text-slate-500">
        Manage registered users and control their platform access.
      </p>

      {/* Users Table */}

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">

        <table className="w-full min-w-[900px] text-left text-sm">

          <thead className="bg-slate-50 dark:bg-slate-800">

            <tr>
              <th className="p-4">Name</th>

              <th className="p-4">Email</th>

              <th className="p-4">Role</th>

              <th className="p-4">Status</th>

              <th className="p-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {currentUsers.length > 0 ? (

              currentUsers.map((u) => {

                const isBlocked =
                  blockedUserIds.includes(u.id);

                return (
                  <tr
                    key={u.id}
                    className="border-t dark:border-slate-800"
                  >

                    {/* Name */}

                    <td className="p-4 font-bold">
                      {u.name}
                    </td>

                    {/* Email */}

                    <td className="p-4">
                      {u.email}
                    </td>

                    {/* Role */}

                    <td className="p-4 capitalize">
                      {u.role}
                    </td>

                    {/* Status */}

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isBlocked
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isBlocked
                          ? "blocked"
                          : "active"}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex flex-wrap gap-2">

                        {/* Block / Unblock */}

                        <button
                          onClick={() =>
                            toggleBlockUser(u)
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-bold text-white ${
                            isBlocked
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-amber-500 hover:bg-amber-600"
                          }`}
                        >
                          {isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>

                        {/* Delete */}

                        <button
                          onClick={() =>
                            deleteUser(u)
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {totalPages > 1 && (

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

          {/* Previous */}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className={`rounded-lg border px-4 py-2 text-sm font-bold ${
              currentPage === 1
                ? "cursor-not-allowed opacity-40"
                : "hover:border-teal-600 hover:text-teal-700"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}

          {pageNumbers.map((page) => (

            <button
              key={page}
              onClick={() =>
                setCurrentPage(page)
              }
              className={`h-10 w-10 rounded-lg border text-sm font-bold ${
                currentPage === page
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "hover:border-teal-600 hover:text-teal-700"
              }`}
            >
              {page}
            </button>

          ))}

          {/* Next */}

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
            className={`rounded-lg border px-4 py-2 text-sm font-bold ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-40"
                : "hover:border-teal-600 hover:text-teal-700"
            }`}
          >
            Next
          </button>

        </div>

      )}

      {/* Pagination Information */}

      {visibleUsers.length > 0 && (

        <p className="mt-4 text-center text-sm text-slate-500">

          Showing{" "}
          {startIndex + 1}-
          {Math.min(
            startIndex + recordsPerPage,
            visibleUsers.length
          )}{" "}
          of {visibleUsers.length} users

        </p>

      )}

    </div>
  );
}