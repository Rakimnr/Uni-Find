import axiosInstance from "./axiosInstance";

export const createClaim = async (claimData) => {
  const response = await axiosInstance.post("/claims", claimData);
  return response.data;
};

export const getMyClaims = async () => {
  const response = await axiosInstance.get("/claims/my");
  return response.data;
};

export const getAllClaims = async () => {
  const response = await axiosInstance.get("/claims");
  return response.data;
};

export const getClaimReport = async () => {
  const response = await axiosInstance.get("/claims/report");
  return response.data;
};

export const updateClaimStatus = async (claimId, status) => {
  const response = await axiosInstance.patch(`/claims/${claimId}/status`, {
    status,
  });
  return response.data;
};