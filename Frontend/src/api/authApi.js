import axiosInstance from "./axiosInstance";

export const registerUser = async (formData) => {
  const response = await axiosInstance.post("/auth/register", formData);
  return response;
};

export const loginUser = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response;
};

export const updateCurrentUser = async (formData) => {
  const response = await axiosInstance.put("/auth/me", formData);
  return response;
};