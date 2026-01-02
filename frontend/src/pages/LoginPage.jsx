import { useState } from "react";
import { loginUser, registerUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("testemail@gmail.com");

  const navigate = useNavigate();

  async function handleRegister() {
    const response = await registerUser(email);

    if (response) {
      alert("Successfully registered");
    } else {
      alert("User already exists");
    }
  }
  async function handleLogin() {
    const response = await loginUser(email);

    if (response) {
      const user = {
        _id: response.data.user.id,
        email: response.data.user.email,
      };
      localStorage.setItem("user", JSON.stringify(user));
      alert("Successfully logged in");
      navigate("/");
    } else {
      alert("Problem logging in");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Github Branches
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Enter your email to access your documents
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Login
          </button>

          <button
            onClick={() => handleRegister()}
            className="w-full mt-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
