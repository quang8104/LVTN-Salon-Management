import api from "./axios";

export const getAllNhanVien = () => api.get("/nhanvien");

export const createNhanVien = (data) => api.post("/nhanvien", data);

export const updateNhanVien = (id, data) => api.put(`/nhanvien/${id}`, data);

export const deleteNhanVien = (id) => api.delete(`/nhanvien/${id}`);