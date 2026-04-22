const API_URL = "http://localhost:5001/api/lost-items";

export const getAllLostItems = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch lost items");
  }
  return response.json();
};

export const getLostItemById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch lost item");
  }
  return response.json();
};

export const createLostItem = async (lostItemData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lostItemData),
  });

  if (!response.ok) {
    throw new Error("Failed to create lost item");
  }

  return response.json();
};

export const updateLostItem = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update lost item");
  }

  return response.json();
};

export const deleteLostItem = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete lost item");
  }

  return response.json();
};