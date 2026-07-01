import api from "./axios";

export const taoLich = (data) => {
    return api.post("/lich-hen", data);
};

export const getAllLichHen = () => {
    return api.get("/lich-hen");
};

export const getLichHenByKhachHang = (id) => {
    return api.get(`/lich-hen/khach-hang/${id}`);
};

export const getLichHenByNhanVien = (id) => {
    return api.get(`/lich-hen/nhan-vien/${id}`);
};

export const getChiTietLichHen = (id) => {
    return api.get(`/lich-hen/${id}/chi-tiet`);
};

export const huyLichKhachHang = (id) => {
    return api.put(`/lich-hen/${id}/huy`);
};

