import api from "./axiosInstance";

export async function registerUser(email) {
  try {
    const response = await api.post("/api/users/", {
      email: email,
    });

    return response;
  } catch (error) {
    console.error("Register user error:", error.message);
    throw error;
  }
}

export async function loginUser(email) {
  try {
    const response = await api.post(`/api/users/${email}`);
    return response;
  } catch (error) {
    console.error("Login user error:", error.message);
    throw error;
  }
}
