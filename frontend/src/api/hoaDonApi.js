import api from "./axios";

export const getHoaDon = () => api.get("/hoa-don");
export const getHoaDonById = (id) => api.get(`/hoa-don/${id}`);
export const taoHoaDon = (maLichHen) => api.post(`/hoa-don/tao/${maLichHen}`);
export const thanhToanHoaDon = (id) => api.put(`/hoa-don/${id}/thanh-toan`);
export const getHoaDonChuaThanhToan = () => api.get("/hoa-don/chua-thanh-toan");
export const getDoanhThuHoaDon = () => api.get("/hoa-don/doanh-thu");