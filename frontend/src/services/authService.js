import api from "./axiosInstance";

export async function registerUser(email) {
  try {
    const response = await api.post("/api/users/", {
      email: email,
    });

    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function loginUser(email) {
  try {
    const response = await api.post(`/api/users/${email}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
