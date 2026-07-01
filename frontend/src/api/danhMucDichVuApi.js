import api from "./axios";

export const getAllDanhMucDichVu = () => api.get("/danh-muc-dich-vu");

export const getActiveDanhMucDichVu = () => api.get("/danh-muc-dich-vu/active");

export const createDanhMucDichVu = (data) => api.post("/danh-muc-dich-vu", data);

export const updateDanhMucDichVu = (id, data) => api.put(`/danh-muc-dich-vu/${id}`, data);

export const deleteDanhMucDichVu = (id) => api.delete(`/danh-muc-dich-vu/${id}`);