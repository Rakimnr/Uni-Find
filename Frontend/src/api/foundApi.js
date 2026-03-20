import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/found-items";

export const getFoundItems = async () => {
  const response = await axios.get(API_BASE_URL);
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