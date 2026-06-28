import api from "./axios";

export const taoDonHang = (data) => {
    return api.post("/don-hang", data);
};

export const getAllDonHang = () => {
    return api.get("/don-hang");
};

export const getDonHangById = (id) => {
    return api.get(`/don-hang/${id}`);
};

export const getChiTietDonHang = (id) => {
    return api.get(`/don-hang/${id}/chi-tiet`);
};

export const getDonHangByKhachHang = (id) => {
    return api.get(`/don-hang/khach-hang/${id}`);
};

export const xacNhanDonHang = (id) => {
    return api.put(`/don-hang/${id}/xac-nhan`);
};

export const dangGiaoDonHang = (id) => {
    return api.put(`/don-hang/${id}/dang-giao`);
};

export const hoanThanhDonHang = (id) => {
    return api.put(`/don-hang/${id}/hoan-thanh`);
};

export const huyDonHang = (id) => {
    return api.put(`/don-hang/${id}/huy`);
};