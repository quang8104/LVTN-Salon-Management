import api from "./axios";

export const getAll = () => api.get("/san-pham");

export const getTop = () => api.get("/san-pham/top");