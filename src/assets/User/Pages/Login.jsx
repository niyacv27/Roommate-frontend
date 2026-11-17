
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../ContextAPI/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------
  // Email validation
  // ---------------------------------------------
  const validateEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  // ---------------------------------------------
  // Password validation
  // ---------------------------------------------
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    return passwordRegex.test(password);
  };

  // ---------------------------------------------
  // Login submit
  // ---------------------------------------------
  const submit = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // -------------------------------------------
    // Check empty email
    // -------------------------------------------
    if (!cleanEmail) {
      Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });

      return;
    }

    // -------------------------------------------
    // Check email pattern
    // -------------------------------------------
    if (!validateEmail(cleanEmail)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid email",
        text: "Please enter a valid email address.",
      });

      return;
    }

    // -------------------------------------------
    // Check empty password
    // -------------------------------------------
    if (!password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Password required",
        text: "Please enter your password.",
      });

      return;
    }

    // -------------------------------------------
    // Check password pattern
    // -------------------------------------------
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid password",
        text:
          "Password must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.",
      });

      return;
    }

    // -------------------------------------------
    // Call login from AuthContext
    // -------------------------------------------
    const result = login(
      cleanEmail,
      password
    );

    // -------------------------------------------
    // Login failed
    // -------------------------------------------
    if (!result.success) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: result.message,
      });

      return;
    }

    // -------------------------------------------
    // Login successful
    // -------------------------------------------
    Swal.fire({
      icon: "success",
      title: "Login successful",
      text: `Welcome back, ${result.user.name}!`,
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      const role = result.user.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "lister") {
        navigate("/lister");
      } else {
        navigate("/");
      }
    });
  };

  return (
    <div className="container-page grid min-h-[75vh] place-items-center py-12">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">

        <p className="text-sm font-black uppercase tracking-widest text-teal-700">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Login to RoomMate Radar
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Access your room search, listings and account.
        </p>

        {/* Login Form */}

        <form
          onSubmit={submit}
          noValidate
          className="mt-7 space-y-4"
        >

          {/* Email */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-1 block text-sm font-bold">
              Password
            </label>

            <input
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-3 font-black text-white hover:bg-teal-800"
          >
            Login
          </button>

        </form>

        {/* Register Link */}

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}

          <Link
            className="font-bold text-teal-700"
            to="/register"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
