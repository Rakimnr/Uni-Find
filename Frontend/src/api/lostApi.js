import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/lost-items";

export const getLostItems = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getLostItemById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createLostItem = async (itemData) => {
  const response = await axios.post(API_BASE_URL, itemData);
  return response.data;
};

export const updateLostItem = async (id, itemData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, itemData);
  return response.data;
};

export const updateLostItemStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteLostItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};