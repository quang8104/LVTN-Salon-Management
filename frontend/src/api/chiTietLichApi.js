import api from "./axios";

export const getChiTietLich = (id) => api.get(`/chi-tiet-lich/${id}`);
export const themDichVuVaoLich = (data) => api.post("/chi-tiet-lich", data);