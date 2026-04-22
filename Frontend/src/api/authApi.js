import axiosInstance from "./axiosInstance";

// REGISTER
export const registerUser = async (formData) => {
  const response = await axiosInstance.post("/auth/register", formData);
  return response;
};

// LOGIN
export const loginUser = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response;
};

// LOGOUT
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response;
};

// UPDATE PROFILE (text fields)
export const updateCurrentUser = async (formData) => {
  const response = await axiosInstance.put("/auth/me", formData);
  return response;
};

// ✅ NEW — UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await axiosInstance.put(
    "/auth/me/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};