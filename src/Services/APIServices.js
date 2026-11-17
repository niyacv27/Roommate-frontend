import {
  get,
  post,
  put,
  patch,
  del,
} from "../API/axiosServices";

// =====================================================
// ROOM APIs
// =====================================================

export const getRooms = (params) =>
  get("/rooms", { params });

export const getRoom = (id) =>
  get(`/rooms/${id}`);

export const createRoom = (data) =>
  post("/rooms", data);

export const updateRoom = (id, data) =>
  put(`/rooms/${id}`, data);

export const deleteRoom = (id) =>
  del(`/rooms/${id}`);

export const approveRoom = (id) =>
  patch(`/rooms/${id}/approve`);

export const rejectRoom = (id, data) =>
  patch(`/rooms/${id}/reject`, data);


// =====================================================
// INTEREST REQUEST APIs
// =====================================================

// These APIs will be connected later
// when the Node.js + Express backend is created.
//
// For the current frontend-only demo,
// interest requests are handled by AppContext
// and stored in localStorage.

export const createInterestRequest = (data) =>
  post("/requests", data);

export const getListerRequests = (listerId) =>
  get(`/requests/lister/${listerId}`);

export const getUserRequests = (userId) =>
  get(`/requests/user/${userId}`);

export const approveInterestRequest = (id) =>
  patch(`/requests/${id}/approve`);

export const rejectInterestRequest = (id) =>
  patch(`/requests/${id}/reject`);

export const getRoomRequest = (
  roomId,
  userId
) =>
  get(
    `/requests/room/${roomId}/user/${userId}`
  );