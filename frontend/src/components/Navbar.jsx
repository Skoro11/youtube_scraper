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
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-red-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          YouTube video transcriptor
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
