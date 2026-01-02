import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export function Navbar() {
  const [user, setUser] = useState({
    id: null,
    email: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    console.log("UserInfo", userInfo);
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);

      setUser({
        _id: parsedUser._id,
        email: parsedUser.email,
      });
    } else {
      navigate("/login");
    }
  }, []);
  function logOut() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Github Branch Manager
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={() => logOut()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
