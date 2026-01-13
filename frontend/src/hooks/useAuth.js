import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState({ id: null, email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");

    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser({
        id: parsedUser._id,
        email: parsedUser.email,
      });
    } else {
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate]);

  return { user, isLoading };
}
