import { useState } from "react";
import { loginUser, registerUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const response = await registerUser(email);
      if (response) {
        alert("Successfully registered");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("User already exists or registration failed");
    }
  }

  async function handleLogin() {
    try {
      const response = await loginUser(email);
      if (response) {
        const user = {
          _id: response.data.user.id,
          email: response.data.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Successfully logged in");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("User not found. Please register first.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            YouTube Link Manager
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Enter your email to manage your YouTube links
          </p>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => handleLogin()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Login
          </button>

          <button
            onClick={() => handleRegister()}
            className="w-full mt-2 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
