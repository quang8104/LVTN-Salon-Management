import api from "./axios";

export const getAll = () => api.get("/san-pham");

export const getTop = () => api.get("/san-pham/top");

export const getById = (id) => api.get(`/san-pham/${id}`);

export const getAllSanPhamKhuyenMai = () =>  api.get("/san-pham/khuyen-mai");
