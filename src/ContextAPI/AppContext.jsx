import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  /* =====================================================
     ROOMS
  ===================================================== */

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("rr_rooms");

    return saved ? JSON.parse(saved) : [];
  });

  /* =====================================================
     USERS
  ===================================================== */

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("rr_users");

    return saved ? JSON.parse(saved) : [];
  });

  /* =====================================================
     INTEREST REQUESTS
  ===================================================== */

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("rr_requests");

    return saved ? JSON.parse(saved) : [];
  });

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const [notifications, setNotifications] = useState(() => {
    const saved =
      localStorage.getItem("rr_notifications");

    return saved ? JSON.parse(saved) : [];
  });

  /* =====================================================
     DARK MODE
  ===================================================== */

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("rr_dark") === "true"
  );

  /* =====================================================
     SAVE ROOMS
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "rr_rooms",
      JSON.stringify(rooms)
    );
  }, [rooms]);

  /* =====================================================
     SAVE USERS
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "rr_users",
      JSON.stringify(users)
    );
  }, [users]);

  /* =====================================================
     SAVE REQUESTS
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "rr_requests",
      JSON.stringify(requests)
    );
  }, [requests]);

  /* =====================================================
     SAVE NOTIFICATIONS
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "rr_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  /* =====================================================
     DARK MODE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "rr_dark",
      String(darkMode)
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  /* =====================================================
     ADD ROOM
  ===================================================== */

  const addRoom = (roomData) => {
    const newRoom = {
      ...roomData,

      id:
        roomData.id ||
        `room-${Date.now()}`,

      /*
       * A newly created room is always
       * saved as a draft.
       */
      status: "draft",

      createdAt:
        roomData.createdAt ||
        new Date().toISOString(),
    };

    setRooms((prev) => [
      newRoom,
      ...prev,
    ]);

    return newRoom;
  };

  /* =====================================================
     UPDATE ROOM

     IMPORTANT:
     If status is undefined, we DO NOT overwrite
     the existing status.
  ===================================================== */

  const updateRoom = (
    roomId,
    updatedData
  ) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (
          String(room.id) !==
          String(roomId)
        ) {
          return room;
        }

        /*
         * Remove undefined values before
         * merging the updated data.
         */
        const cleanedData =
          Object.fromEntries(
            Object.entries(
              updatedData
            ).filter(
              ([, value]) =>
                value !== undefined
            )
          );

        return {
          ...room,
          ...cleanedData,

          /*
           * Existing status is preserved
           * unless a real status was supplied.
           */
          status:
            cleanedData.status !==
            undefined
              ? cleanedData.status
              : room.status,

          updatedAt:
            new Date().toISOString(),
        };
      })
    );
  };

  /* =====================================================
     DELETE ROOM
  ===================================================== */

  const deleteRoom = (roomId) => {
    setRooms((prev) =>
      prev.filter(
        (room) =>
          String(room.id) !==
          String(roomId)
      )
    );
  };

  /* =====================================================
     SUBMIT ROOM FOR ADMIN APPROVAL

     draft
       ↓
     pending
  ===================================================== */

  const submitRoomForApproval = (
    roomId
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        String(room.id) ===
        String(roomId)
          ? {
              ...room,
              status: "pending",
              submittedAt:
                new Date().toISOString(),
            }
          : room
      )
    );

    addNotification({
      title:
        "Room submitted for approval",
      text:
        "A room listing has been submitted for administrator review.",
    });
  };

  /* =====================================================
     ADMIN APPROVE ROOM

     pending
       ↓
     approved
  ===================================================== */

  const approveRoom = (
    roomId
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        String(room.id) ===
        String(roomId)
          ? {
              ...room,
              status: "approved",
              approvedAt:
                new Date().toISOString(),
            }
          : room
      )
    );

    addNotification({
      title:
        "Room approved",
      text:
        "A room listing has been approved and is now live.",
    });
  };

  /* =====================================================
     ADMIN REJECT ROOM

     pending
       ↓
     rejected
  ===================================================== */

  const rejectRoom = (
    roomId
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        String(room.id) ===
        String(roomId)
          ? {
              ...room,
              status: "rejected",
              rejectedAt:
                new Date().toISOString(),
            }
          : room
      )
    );

    addNotification({
      title:
        "Room rejected",
      text:
        "A room listing has been rejected by the administrator.",
    });
  };

  /* =====================================================
     BACKWARD COMPATIBILITY

     Your AdminRooms currently uses
     updateRoomStatus().
  ===================================================== */

  const updateRoomStatus = (
    roomId,
    status
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        String(room.id) ===
        String(roomId)
          ? {
              ...room,
              status,
            }
          : room
      )
    );
  };

  /* =====================================================
     USER FUNCTIONS
  ===================================================== */

  const updateUser = (
    userId,
    data
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        String(user.id) ===
        String(userId)
          ? {
              ...user,
              ...data,
            }
          : user
      )
    );
  };

  const updateProfile = (
    data
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.email === data.email
          ? {
              ...user,
              ...data,
            }
          : user
      )
    );
  };

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const addNotification = (
    notification
  ) => {
    setNotifications((prev) => [
      {
        id:
          `notification-${Date.now()}`,

        createdAt:
          new Date().toISOString(),

        read: false,

        ...notification,
      },

      ...prev,
    ]);
  };

  const markNotificationsRead =
    () => {
      setNotifications((prev) =>
        prev.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
      );
    };

  /* =====================================================
     CREATE INTEREST REQUEST
  ===================================================== */

  const createInterestRequest =
    (data) => {
      const existing =
        requests.find(
          (request) =>
            String(
              request.roomId
            ) ===
              String(
                data.roomId
              ) &&
            String(
              request.userId
            ) ===
              String(
                data.userId
              )
        );

      if (existing) {
        return existing;
      }

      const newRequest = {
        id:
          `request-${Date.now()}`,

        roomId:
          data.roomId,

        roomTitle:
          data.roomTitle,

        userId:
          data.userId,

        userName:
          data.userName,

        userEmail:
          data.userEmail,

        listerId:
          data.listerId,

        listerName:
          data.listerName,

        listerEmail:
          data.listerEmail ||
          "",

        status:
          "pending",

        createdAt:
          new Date().toISOString(),

        paymentStatus:
          "not_paid",

        paymentAmount:
          Number(
            data.paymentAmount ||
            data.deposit ||
            0
          ),

        paymentReference:
          null,

        paidAt:
          null,
      };

      setRequests((prev) => [
        newRequest,
        ...prev,
      ]);

      return newRequest;
    };

  /* =====================================================
     GET USER REQUESTS
  ===================================================== */

  const getUserRequests = (
    userId
  ) => {
    return requests.filter(
      (request) =>
        String(
          request.userId
        ) ===
        String(userId)
    );
  };

  /* =====================================================
     GET LISTER REQUESTS
  ===================================================== */

  const getListerRequests = (
    listerId
  ) => {
    return requests.filter(
      (request) =>
        String(
          request.listerId
        ) ===
        String(listerId)
    );
  };

  /* =====================================================
     GET ROOM REQUEST
  ===================================================== */

  const getRoomRequest = (
    roomId,
    userId
  ) => {
    return requests.find(
      (request) =>
        String(
          request.roomId
        ) ===
          String(roomId) &&
        String(
          request.userId
        ) ===
          String(userId)
    );
  };

  /* =====================================================
     APPROVE INTEREST
  ===================================================== */

  const approveInterestRequest =
    (requestId) => {
      setRequests((prev) =>
        prev.map(
          (request) =>
            String(
              request.id
            ) ===
            String(
              requestId
            )
              ? {
                  ...request,
                  status:
                    "approved",
                  approvedAt:
                    new Date().toISOString(),
                }
              : request
        )
      );
    };

  /* =====================================================
     REJECT INTEREST
  ===================================================== */

  const rejectInterestRequest =
    (requestId) => {
      setRequests((prev) =>
        prev.map(
          (request) =>
            String(
              request.id
            ) ===
            String(
              requestId
            )
              ? {
                  ...request,
                  status:
                    "rejected",
                  rejectedAt:
                    new Date().toISOString(),
                }
              : request
        )
      );
    };

  /* =====================================================
     MARK TOKEN AS PAID
     
     This is used by MyRooms.jsx after the user
     clicks "Proceed to Payment".

     unpaid
        ↓
      paid
  ===================================================== */

  const markTokenPaid = (
    requestId,
    amount,
    paymentReference
  ) => {
    const currentRequest =
      requests.find(
        (request) =>
          String(
            request.id
          ) ===
          String(
            requestId
          )
      );

    if (!currentRequest) {
      console.error(
        "Payment failed: request not found",
        requestId
      );

      return null;
    }

    const paidAt =
      new Date().toISOString();

    const updatedRequest = {
      ...currentRequest,

      paymentStatus:
        "paid",

      paymentAmount:
        Number(amount),

      paymentReference,

      paidAt,
    };

    /* =================================================
       UPDATE REACT STATE
    ================================================= */

    setRequests((prev) =>
      prev.map((request) =>
        String(
          request.id
        ) ===
        String(
          requestId
        )
          ? updatedRequest
          : request
      )
    );

    /* =================================================
       SAVE IMMEDIATELY TO LOCAL STORAGE

       This makes the payment available to:
       - User
       - Lister
       - Admin
       after page refresh.
    ================================================= */

    const updatedRequests =
      requests.map(
        (request) =>
          String(
            request.id
          ) ===
          String(
            requestId
          )
            ? updatedRequest
            : request
      );

    localStorage.setItem(
      "rr_requests",
      JSON.stringify(
        updatedRequests
      )
    );

    /* =================================================
       ADD PAYMENT NOTIFICATION
    ================================================= */

    addNotification({
      title:
        "Token payment successful",

      text:
        `${currentRequest.userName} paid ₹${Number(
          amount
        ).toLocaleString()} for ${currentRequest.roomTitle}.`,
    });

    return updatedRequest;
  };

  /* =====================================================
     PAY TOKEN

     Kept for backward compatibility with any
     existing component that still calls payToken().
     
     This now uses the same payment logic.
  ===================================================== */

  const payToken = (
    requestId
  ) => {
    const request =
      requests.find(
        (item) =>
          String(
            item.id
          ) ===
          String(
            requestId
          )
      );

    if (!request) {
      console.error(
        "Payment failed: request not found",
        requestId
      );

      return null;
    }

    const amount =
      Number(
        request.paymentAmount ||
        0
      );

    const paymentReference =
      `RR-${Date.now()}`;

    return markTokenPaid(
      requestId,
      amount,
      paymentReference
    );
  };

  /* =====================================================
     GET PAID REQUESTS
  ===================================================== */

  const getPaidRequests =
    () => {
      return requests.filter(
        (request) =>
          request.paymentStatus ===
          "paid"
      );
    };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  return (
    <AppContext.Provider
      value={{
        /* =================================================
           ROOMS
        ================================================= */

        rooms,
        setRooms,

        addRoom,
        updateRoom,
        deleteRoom,

        submitRoomForApproval,

        approveRoom,
        rejectRoom,

        updateRoomStatus,

        /* =================================================
           USERS
        ================================================= */

        users,
        setUsers,

        updateUser,
        updateProfile,

        /* =================================================
           REQUESTS
        ================================================= */

        requests,
        setRequests,

        createInterestRequest,
        getRoomRequest,
        getUserRequests,
        getListerRequests,

        approveInterestRequest,
        rejectInterestRequest,

        /* =================================================
           PAYMENTS
        ================================================= */

        payToken,

        markTokenPaid,

        getPaidRequests,

        /* =================================================
           NOTIFICATIONS
        ================================================= */

        notifications,
        setNotifications,

        addNotification,
        markNotificationsRead,

        /* =================================================
           DARK MODE
        ================================================= */

        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () =>
  useContext(AppContext);