import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

// ---------------------------------------------
// Predefined Admin Account
// ---------------------------------------------
const ADMIN_ACCOUNT = {
  id: "admin-001",
  name: "Platform Admin",
  email: "admin@roommateradar.com",
  password: "Admin@12345",
  role: "admin",
  status: "active",
};

// ---------------------------------------------
// Email Validation
// ---------------------------------------------
const isValidEmail = (email) => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(email);
};

// ---------------------------------------------
// Password Validation
// Minimum 6 characters
// At least one uppercase
// At least one lowercase
// At least one number
// ---------------------------------------------
const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return passwordRegex.test(password);
};

export function AuthProvider({ children }) {

  // ---------------------------------------------
  // Check whether someone is already logged in
  // ---------------------------------------------
  const [user, setUser] = useState(() => {

    const savedUser =
      sessionStorage.getItem("roommateUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // ---------------------------------------------
  // Store/remove logged-in user
  // ---------------------------------------------
  useEffect(() => {

    if (user) {
      sessionStorage.setItem(
        "roommateUser",
        JSON.stringify(user)
      );
    } else {
      sessionStorage.removeItem("roommateUser");
    }

  }, [user]);

  // ---------------------------------------------
  // Get registered users
  // ---------------------------------------------
  const getRegisteredUsers = () => {

    const savedUsers =
      localStorage.getItem("rr_users");

    return savedUsers
      ? JSON.parse(savedUsers)
      : [];
  };

  // =============================================
  // LOGIN
  // =============================================

  const login = (email, password) => {

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------
    // Validate email
    // -------------------------------------------

    if (!normalizedEmail) {
      return {
        success: false,
        message: "Please enter your email address.",
      };
    }

    if (!isValidEmail(normalizedEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    // -------------------------------------------
    // Validate password
    // -------------------------------------------

    if (!password) {
      return {
        success: false,
        message: "Please enter your password.",
      };
    }

    if (!isValidPassword(password)) {
      return {
        success: false,
        message:
          "Password must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.",
      };
    }

    // ===========================================
    // CHECK ADMIN
    // ===========================================

    if (
      normalizedEmail ===
        ADMIN_ACCOUNT.email &&
      password === ADMIN_ACCOUNT.password
    ) {

      const adminUser = {
        id: ADMIN_ACCOUNT.id,
        name: ADMIN_ACCOUNT.name,
        email: ADMIN_ACCOUNT.email,
        role: ADMIN_ACCOUNT.role,
        status: ADMIN_ACCOUNT.status,
      };

      // Only LOGIN sets the user
      setUser(adminUser);

      return {
        success: true,
        user: adminUser,
      };
    }

    // ===========================================
    // CHECK NORMAL USERS / Listers
    // ===========================================

    const users = getRegisteredUsers();

    const existingUser = users.find(
      (u) =>
        u.email.toLowerCase() ===
          normalizedEmail &&
        u.password === password
    );

    // -------------------------------------------
    // User not found
    // -------------------------------------------

    if (!existingUser) {

      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // -------------------------------------------
    // Check blocked user
    // -------------------------------------------

    if (existingUser.status === "blocked") {

      return {
        success: false,
        message:
          "Your account has been blocked by the administrator.",
      };
    }

    // -------------------------------------------
    // Create session user
    // Do NOT include password
    // -------------------------------------------

    const loggedInUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      status: existingUser.status,
    };

    // Login the user
    setUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  // =============================================
  // REGISTER
  // =============================================

  const register = (
    name,
    email,
    password,
    role = "user"
  ) => {

    const cleanName = name.trim();
    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------
    // Name validation
    // -------------------------------------------

    if (!cleanName) {

      return {
        success: false,
        message: "Please enter your full name.",
      };
    }

    if (cleanName.length < 3) {

      return {
        success: false,
        message:
          "Name must contain at least 3 characters.",
      };
    }

    // -------------------------------------------
    // Email validation
    // -------------------------------------------

    if (!normalizedEmail) {

      return {
        success: false,
        message: "Please enter your email address.",
      };
    }

    if (!isValidEmail(normalizedEmail)) {

      return {
        success: false,
        message:
          "Please enter a valid email address.",
      };
    }

    // -------------------------------------------
    // Password validation
    // -------------------------------------------

    if (!password) {

      return {
        success: false,
        message: "Please enter a password.",
      };
    }

    if (!isValidPassword(password)) {

      return {
        success: false,
        message:
          "Password must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.",
      };
    }

    // -------------------------------------------
    // Prevent admin account registration
    // -------------------------------------------

    if (
      normalizedEmail ===
      ADMIN_ACCOUNT.email
    ) {

      return {
        success: false,
        message:
          "This email is reserved for the platform administrator.",
      };
    }

    // -------------------------------------------
    // Get existing users
    // -------------------------------------------

    const users = getRegisteredUsers();

    // -------------------------------------------
    // Check duplicate email
    // -------------------------------------------

    const emailExists = users.some(
      (u) =>
        u.email.toLowerCase() ===
        normalizedEmail
    );

    if (emailExists) {

      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    // -------------------------------------------
    // Create new user
    // -------------------------------------------

    const newUser = {
      id: `user-${Date.now()}`,

      name: cleanName,

      email: normalizedEmail,

      password: password,

      role:
        role === "lister"
          ? "lister"
          : "user",

      status: "active",

      createdAt:
        new Date().toISOString(),
    };

    // -------------------------------------------
    // Save registered user
    // -------------------------------------------

    const updatedUsers = [
      ...users,
      newUser,
    ];

    localStorage.setItem(
      "rr_users",
      JSON.stringify(updatedUsers)
    );

    // IMPORTANT:
    // Do NOT call setUser() here.
    //
    // Registration creates the account only.
    // The user must login separately.
    // -------------------------------------------

    return {
      success: true,

      // Return the created user information
      // without logging them in.
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    };
  };

  // =============================================
  // LOGOUT
  // =============================================

  const logout = () => {
    setUser(null);
  };

  // =============================================
  // CONTEXT
  // =============================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,

        // Expose admin credentials for the
        // frontend prototype if needed.
        adminAccount: {
          email: ADMIN_ACCOUNT.email,
          password: ADMIN_ACCOUNT.password,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =============================================
// Custom Hook
// =============================================

export const useAuth = () =>
  useContext(AuthContext);