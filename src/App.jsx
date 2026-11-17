import { Routes, Route } from "react-router-dom";

import UserNavbar from "./assets/User/Components/UserNavbar";
import ListerNavbar from "./assets/Lister/Components/ListerNavbar";
import AdminNavbar from "./assets/Admin/Components/AdminNavbar";

import Footer from "./assets/Components/Footer";
import ProtectedRoute from "./assets/Components/ProtectedRoute";

import { useAuth } from "./ContextAPI/AuthContext";

import Home from "./assets/User/Pages/Home";
import Login from "./assets/User/Pages/Login";
import Register from "./assets/User/Pages/Register";

import Rooms from "./assets/User/Pages/Rooms";
import RoomDetails from "./assets/User/Pages/RoomDetails";
import Roommates from "./assets/User/Pages/Roommates";

import Profile from "./assets/User/Pages/Profile";
import Notifications from "./assets/User/Pages/Notifications";
import MyRooms from "./assets/User/Pages/MyRooms";

import About from "./assets/User/Pages/About";
import Unauthorized from "./assets/User/Pages/Unauthorized";

import AdminTokenPayments from "./assets/Admin/Pages/AdminTokenPayments";

// =====================================================
// LISTER PAGES
// =====================================================

import ListerDashboard from "./assets/Lister/Pages/ListerDashboard";
import ListerRooms from "./assets/Lister/Pages/ListerRooms";
import AddRoom from "./assets/Lister/Pages/AddRoom";
import Requests from "./assets/Lister/Pages/Requests";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./assets/Admin/Pages/AdminDashboard";
import AdminRooms from "./assets/Admin/Pages/AdminRooms";
import AdminUsers from "./assets/Admin/Pages/AdminUsers";

export default function App() {
  const { user } = useAuth();

  // =====================================================
  // SELECT NAVBAR BASED ON USER ROLE
  // =====================================================

  const renderNavbar = () => {
    if (user?.role === "admin") {
      return <AdminNavbar />;
    }

    if (user?.role === "lister") {
      return <ListerNavbar />;
    }

    return <UserNavbar />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* =================================================
          ROLE-BASED NAVBAR
      ================================================= */}

      {renderNavbar()}

      <main>
        <Routes>
          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route path="/rooms/:id" element={<RoomDetails />} />

          <Route path="/roommates" element={<Roommates />} />

          <Route path="/about" element={<About />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* =================================================
              LOGGED-IN USER ROUTES
          ================================================= */}

          {/* Profile */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* My Rooms / My Interests */}

          <Route
            path="/my-rooms"
            element={
              <ProtectedRoute roles={["user"]}>
                <MyRooms />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ROOM LISTER ROUTES
          ================================================= */}

          {/* Lister Dashboard */}

          <Route
            path="/lister"
            element={
              <ProtectedRoute roles={["lister"]}>
                <ListerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Add Room */}

          <Route
            path="/lister/add-room"
            element={
              <ProtectedRoute roles={["lister"]}>
                <AddRoom />
              </ProtectedRoute>
            }
          />

          {/* My Rooms */}

          <Route
            path="/lister/rooms"
            element={
              <ProtectedRoute roles={["lister"]}>
                <ListerRooms />
              </ProtectedRoute>
            }
          />

          {/* Requests */}

          <Route
            path="/lister/requests"
            element={
              <ProtectedRoute roles={["lister"]}>
                <Requests />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ROUTES
          ================================================= */}

          {/* Admin Dashboard */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Rooms */}

          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminRooms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/token-payments"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminTokenPayments />
              </ProtectedRoute>
            }
          />

          {/* Admin Users */}

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </div>
  );
}
