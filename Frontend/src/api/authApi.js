import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const getCurrentUser = () => API.get("/auth/me");

export default API;