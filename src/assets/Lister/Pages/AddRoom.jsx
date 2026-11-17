import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function AddRoom() {
  const { user } = useAuth();

  const {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    submitRoomForApproval,
  } = useApp();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    city: "",
    area: "",
    type: "Single Room",
    rent: "",
    deposit: "",
    gender: "Any",
    amenities: "Wi-Fi, Kitchen",
    description: "",
    requirements: "",
  });

  const [outsidePhotos, setOutsidePhotos] = useState([]);
  const [insidePhotos, setInsidePhotos] = useState([]);

  const [editingRoomId, setEditingRoomId] = useState(null);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================================================
     BASE64 IMAGE CONVERSION
  ===================================================== */

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  };

  /* =====================================================
     OUTSIDE PHOTOS
  ===================================================== */

  const handleOutsidePhotos = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const images = await Promise.all(
        files.map((file) => convertToBase64(file))
      );

      setOutsidePhotos((prev) => [...prev, ...images]);
    } catch (error) {
      Swal.fire(
        "Error",
        "Unable to upload outside photos.",
        "error"
      );
    }
  };

  /* =====================================================
     INSIDE PHOTOS
  ===================================================== */

  const handleInsidePhotos = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const images = await Promise.all(
        files.map((file) => convertToBase64(file))
      );

      setInsidePhotos((prev) => [...prev, ...images]);
    } catch (error) {
      Swal.fire(
        "Error",
        "Unable to upload inside photos.",
        "error"
      );
    }
  };

  /* =====================================================
     REMOVE PHOTOS
  ===================================================== */

  const removeOutsidePhoto = (index) => {
    setOutsidePhotos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const removeInsidePhoto = (index) => {
    setInsidePhotos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setForm({
      title: "",
      city: "",
      area: "",
      type: "Single Room",
      rent: "",
      deposit: "",
      gender: "Any",
      amenities: "Wi-Fi, Kitchen",
      description: "",
      requirements: "",
    });

    setOutsidePhotos([]);
    setInsidePhotos([]);
    setEditingRoomId(null);
  };

  /* =====================================================
     CREATE / UPDATE ROOM
  ===================================================== */

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.city ||
      !form.area ||
      !form.rent ||
      !form.description ||
      !form.requirements
    ) {
      return Swal.fire(
        "Missing details",
        "Please complete all required fields.",
        "warning"
      );
    }

    if (
      outsidePhotos.length === 0 ||
      insidePhotos.length === 0
    ) {
      return Swal.fire(
        "Photos required",
        "Please upload at least one outside photo and one inside photo.",
        "warning"
      );
    }

    const roomData = {
      ...form,

      rent: Number(form.rent),

      deposit: Number(form.deposit || 0),

      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      outsidePhotos,
      insidePhotos,

      listerId: user.id,
      listerEmail: user.email,
      lister: user.name,

      /*
       * IMPORTANT:
       * A newly created room is only a DRAFT.
       * It is NOT sent to admin yet.
       */
      status: editingRoomId ? undefined : "draft",
    };

    /* =================================================
       EDIT EXISTING ROOM
    ================================================= */

    if (editingRoomId) {
      updateRoom(editingRoomId, roomData);

      Swal.fire({
        icon: "success",
        title: "Room updated",
        text: "Your room details have been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();

      return;
    }

    /* =================================================
       CREATE NEW ROOM
    ================================================= */

    const newRoom = {
      id: `room-${Date.now()}`,
      ...roomData,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    addRoom(newRoom);

    Swal.fire({
      icon: "success",
      title: "Room created",
      text: "Your room has been saved as a draft.",
      timer: 1500,
      showConfirmButton: false,
    });

    resetForm();
  };

  /* =====================================================
     EDIT ROOM
  ===================================================== */

  const handleEdit = (room) => {
    /*
     * Only draft / rejected rooms should normally
     * be editable.
     */

    if (
      room.status !== "draft" &&
      room.status !== "rejected"
    ) {
      Swal.fire(
        "Cannot edit",
        "A room that is already waiting for admin approval cannot be edited.",
        "info"
      );

      return;
    }

    setEditingRoomId(room.id);

    setForm({
      title: room.title || "",
      city: room.city || "",
      area: room.area || "",
      type: room.type || "Single Room",
      rent: room.rent || "",
      deposit: room.deposit || "",
      gender: room.gender || "Any",
      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : room.amenities || "",
      description: room.description || "",
      requirements: room.requirements || "",
    });

    setOutsidePhotos(room.outsidePhotos || []);
    setInsidePhotos(room.insidePhotos || []);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE ROOM
  ===================================================== */

  const handleDelete = async (roomId) => {
    const result = await Swal.fire({
      title: "Delete this room?",
      text: "This listing will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    deleteRoom(roomId);

    Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "The room listing has been deleted.",
      timer: 1300,
      showConfirmButton: false,
    });
  };

  /* =====================================================
     SUBMIT FOR ADMIN APPROVAL
  ===================================================== */

  const handleSubmitForApproval = async (roomId) => {
    const result = await Swal.fire({
      title: "Submit for admin approval?",
      text: "After submission, the room will be sent to the administrator for review.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0f766e",
    });

    if (!result.isConfirmed) {
      return;
    }

    submitRoomForApproval(roomId);

    Swal.fire({
      icon: "success",
      title: "Submitted",
      text: "Your room is now waiting for admin approval.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* =====================================================
     ONLY THIS LISTER'S ROOMS
  ===================================================== */

  const myRooms = rooms.filter(
    (room) =>
      String(room.listerId) === String(user?.id)
  );

  return (
    <div className="container-page py-12">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="max-w-3xl">

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          {editingRoomId ? "Edit room listing" : "New room listing"}
        </p>

        <h1 className="mt-2 text-4xl font-black">
          {editingRoomId ? "Edit your room" : "Post a room"}
        </h1>

        <p className="mt-3 text-slate-500">
          {editingRoomId
            ? "Update your room details and save the changes."
            : "Create your room listing and manage it before submitting it for admin approval."}
        </p>

      </div>

      {/* =================================================
          CREATE / EDIT FORM
      ================================================= */}

      <form
        onSubmit={submit}
        className="mt-8 max-w-4xl rounded-2xl border bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* BASIC FIELDS */}

          {[
            [
              "title",
              "Room title",
              "text",
              "e.g. Bright single room near metro",
            ],
            [
              "city",
              "City",
              "text",
              "Kochi",
            ],
            [
              "area",
              "Area / locality",
              "text",
              "Kaloor",
            ],
            [
              "rent",
              "Monthly rent",
              "number",
              "9000",
            ],
            [
              "deposit",
              "Token deposit",
              "number",
              "3000",
            ],
            [
              "amenities",
              "Amenities",
              "text",
              "Wi-Fi, Kitchen, Parking",
            ],
          ].map(
            ([name, label, type, placeholder]) => (
              <div key={name}>

                <label className="mb-1 block text-sm font-bold">
                  {label}
                </label>

                <input
                  required={[
                    "title",
                    "city",
                    "area",
                    "rent",
                  ].includes(name)}
                  name={name}
                  value={form[name]}
                  onChange={change}
                  type={type}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                />

              </div>
            )
          )}

          {/* ROOM TYPE */}

          <div>

            <label className="mb-1 block text-sm font-bold">
              Room type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Single Room</option>
              <option>Shared Room</option>
              <option>Private Room</option>
            </select>

          </div>

          {/* GENDER */}

          <div>

            <label className="mb-1 block text-sm font-bold">
              Preferred gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Any</option>
              <option>Female</option>
              <option>Male</option>
            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-bold">
              Room description
            </label>

            <textarea
              required
              name="description"
              value={form.description}
              onChange={change}
              rows="4"
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              placeholder="Describe the room, apartment and nearby facilities."
            />

          </div>

          {/* REQUIREMENTS */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-bold">
              Roommate requirements
            </label>

            <textarea
              required
              name="requirements"
              value={form.requirements}
              onChange={change}
              rows="4"
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              placeholder="What type of roommate are you looking for?"
            />

          </div>

        </div>

        {/* =================================================
            OUTSIDE PHOTOS
        ================================================= */}

        <div className="mt-7">

          <label className="mb-2 block text-sm font-bold">
            Exterior Photos
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOutsidePhotos}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          <p className="mt-2 text-xs text-slate-500">
            Upload photos of the building, apartment exterior,
            entrance, surroundings, etc.
          </p>

          {outsidePhotos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {outsidePhotos.map((photo, index) => (

                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border dark:border-slate-700"
                >

                  <img
                    src={photo}
                    alt={`Outside ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeOutsidePhoto(index)
                    }
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* =================================================
            INSIDE PHOTOS
        ================================================= */}

        <div className="mt-7">

          <label className="mb-2 block text-sm font-bold">
            Interior Photos
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInsidePhotos}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          <p className="mt-2 text-xs text-slate-500">
            Upload photos of the bedroom, kitchen, bathroom,
            living area, etc.
          </p>

          {insidePhotos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {insidePhotos.map((photo, index) => (

                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border dark:border-slate-700"
                >

                  <img
                    src={photo}
                    alt={`Inside ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeInsidePhoto(index)
                    }
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* =================================================
            REVIEW INFORMATION
        ================================================= */}

        

        {/* =================================================
            CREATE / UPDATE BUTTONS
        ================================================= */}

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            type="submit"
            className="rounded-xl bg-teal-700 px-7 py-3 font-black text-white hover:bg-teal-800"
          >
            {editingRoomId
              ? "Save Changes"
              : "Create Room"}
          </button>

          {editingRoomId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-7 py-3 font-black text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel Edit
            </button>
          )}

        </div>

      </form>

      {/* =================================================
          MY ROOM LISTINGS
      ================================================= */}

      <section className="mt-12 max-w-5xl">

        <div className="mb-5">

          <p className="text-sm font-black uppercase tracking-widest text-teal-700">
            Manage listings
          </p>

          <h2 className="mt-1 text-2xl font-black">
            My Room Listings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create, edit, delete or submit your rooms for
            administrator approval.
          </p>

        </div>

        {myRooms.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">

            <p className="text-lg font-black text-slate-700 dark:text-slate-200">
              No room listings yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Fill the form above and click "Create Room".
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {myRooms.map((room) => (

              <div
                key={room.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* ROOM INFO */}

                  <div className="flex gap-4">

                    {room.outsidePhotos?.[0] ? (

                      <img
                        src={room.outsidePhotos[0]}
                        alt={room.title}
                        className="h-24 w-32 rounded-xl object-cover"
                      />

                    ) : (

                      <div className="grid h-24 w-32 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800">
                        No Image
                      </div>

                    )}

                    <div>

                      <h3 className="text-lg font-black">
                        {room.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {room.city} · {room.area}
                      </p>

                      <p className="mt-1 text-sm font-bold text-teal-700">
                        ₹{Number(room.rent || 0).toLocaleString()} / month
                      </p>

                      {/* STATUS */}

                      <div className="mt-2">

                        {room.status === "draft" && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Draft
                          </span>
                        )}

                        {room.status === "pending" && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                            Pending Admin Approval
                          </span>
                        )}

                        {room.status === "approved" && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                            ✓ Approved
                          </span>
                        )}

                        {room.status === "rejected" && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-800">
                            Rejected
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      ACTION BUTTONS
                  ================================================= */}

                  <div className="flex flex-wrap gap-2">

                    {/* EDIT */}

                    {(room.status === "draft" ||
                      room.status === "rejected") && (

                      <button
                        type="button"
                        onClick={() => handleEdit(room)}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                    )}

                    {/* DELETE */}

                    {room.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(room.id)
                        }
                        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}

                    {/* SUBMIT */}

                    {(room.status === "draft" ||
                      room.status === "rejected") && (

                      <button
                        type="button"
                        onClick={() =>
                          handleSubmitForApproval(room.id)
                        }
                        className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-black text-white hover:bg-teal-800"
                      >
                        Submit for Admin Approval
                      </button>

                    )}

                    {/* PENDING MESSAGE */}

                    {room.status === "pending" && (

                      <span className="rounded-xl bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-700">
                        Waiting for admin review
                      </span>

                    )}

                    {/* APPROVED MESSAGE */}

                    {room.status === "approved" && (

                      <span className="rounded-xl bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700">
                        ✓ Listing is live
                      </span>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}