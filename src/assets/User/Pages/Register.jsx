
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../ContextAPI/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------
  // Handle input changes
  // ---------------------------------------------
  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------------------------
  // Email validation
  // ---------------------------------------------
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  // ---------------------------------------------
  // Password validation
  // ---------------------------------------------
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  };

  // ---------------------------------------------
  // Form submission
  // ---------------------------------------------
  const submit = (e) => {
    e.preventDefault();

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();

    // -------------------------------------------
    // Name validation
    // -------------------------------------------
    if (!cleanName) {
      return Swal.fire({
        icon: "warning",
        title: "Name required",
        text: "Please enter your full name.",
      });
    }

    if (cleanName.length < 2) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid name",
        text: "Name must contain at least 2 characters.",
      });
    }

    // -------------------------------------------
    // Email validation
    // -------------------------------------------
    if (!cleanEmail) {
      return Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });
    }

    if (!validateEmail(cleanEmail)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid email",
        text: "Please enter a valid email address.",
      });
    }

    // -------------------------------------------
    // Password validation
    // -------------------------------------------
    if (!form.password) {
      return Swal.fire({
        icon: "warning",
        title: "Password required",
        text: "Please enter your password.",
      });
    }

    if (!validatePassword(form.password)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid password",
        text:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
      });
    }

    // -------------------------------------------
    // Register user
    // -------------------------------------------
    const result = register(
      cleanName,
      cleanEmail,
      form.password,
      form.role
    );

    // -------------------------------------------
    // Registration failed
    // -------------------------------------------
    if (!result.success) {
      return Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: result.message,
      });
    }

    // -------------------------------------------
    // Registration successful
    // -------------------------------------------
    Swal.fire({
      icon: "success",
      title: "Account created",
      text:
        form.role === "lister"
          ? "Your room lister account has been created. Please login to continue."
          : "Your account has been created. Please login to continue.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="container-page grid min-h-[75vh] place-items-center py-12">

      <form
        onSubmit={submit}
        noValidate
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          Join RoomMate Radar
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Choose how you want to use RoomMate Radar.
        </p>

        <div className="mt-6 space-y-4">

          {/* Full Name */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Full name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={change}
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Email
            </label>

            <input
              name="email"
              type="text"
              value={form.email}
              onChange={change}
              
              className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />

            <p className="mt-1 text-xs text-slate-500">
              Enter a valid email address.
            </p>
          </div>

          {/* Password */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />

            <p className="mt-1 text-xs text-slate-500">
              8+ characters with uppercase, lowercase, number and
              special character.
            </p>
          </div>

          {/* Account Type */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Account type
            </label>

            <select
              name="role"
              value={form.role}
              onChange={change}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="user">
                Normal User
              </option>

              <option value="lister">
                Room Lister
              </option>
            </select>
          </div>

          {/* Register Button */}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-3 font-black text-white hover:bg-teal-800"
          >
            Create Account
          </button>

        </div>

        {/* Login Link */}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}

          <Link
            className="font-bold text-teal-700"
            to="/login"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}
