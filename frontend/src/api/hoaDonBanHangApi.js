import api from "./axios";

export const getHoaDonBanHang = () => api.get("/hoa-don-ban-hang");
export const getHoaDonBanHangById = (id) => api.get(`/hoa-don-ban-hang/${id}`);
export const taoHoaDonBanHang = (data) => api.post("/hoa-don-ban-hang", data);
export const getChiTietHoaDonBanHang = (id) => api.get(`/hoa-don-ban-hang/${id}/chi-tiet`);
export const thanhToanHoaDonBanHang = (id) => api.put(`/hoa-don-ban-hang/${id}/thanh-toan`);
export const getHoaDonBanHangChuaThanhToan = () => api.get("/hoa-don-ban-hang/chua-thanh-toan");
export const getDoanhThuBanHang = () => api.get("/hoa-don-ban-hang/doanh-thu");
export const getTopSanPham = () => api.get("/hoa-don-ban-hang/top-san-pham");