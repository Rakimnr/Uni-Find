import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/found-items";

export const getFoundItems = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const searchFoundItems = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/search`, { params });
  return response.data;
};

export const getFoundItemById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createFoundItem = async (itemData) => {
  const response = await axios.post(API_BASE_URL, itemData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateFoundItem = async (id, itemData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, itemData);
  return response.data;
};

export const updateFoundItemStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteFoundItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};