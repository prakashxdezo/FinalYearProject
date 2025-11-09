import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically if it exists
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

export const createHomeCategories = async (categories) => {
  const res = await api.post("/home/categories", categories);
  return res.data;
};

export const updateHomeCategory = async (id, data) => {
  const res = await api.patch(`/home/home-category/${id}`, data);
  return res.data;
};
