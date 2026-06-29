import api from "./axios";

export const getAllDonHang = () => {
    return api.get("/don-hang");
};

export const getDonHangById = (id) => {
    return api.get(`/don-hang/${id}`);
};

export const getChiTietDonHang = (id) => {
    return api.get(`/don-hang/${id}/chi-tiet`);
};

export const xacNhanThanhToan = (id) => {
    return api.put(`/don-hang/${id}/xac-nhan-thanh-toan`);
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

export const getDonHangChoXacNhan = () => {
    return api.get("/don-hang/cho-xac-nhan");
};