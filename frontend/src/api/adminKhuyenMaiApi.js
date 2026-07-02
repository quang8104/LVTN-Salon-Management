import api from "./axios";

export const getAllKhuyenMai = () => {
    return api.get("/khuyen-mai");
};

export const getChiTietKhuyenMai = (id) => {
    return api.get(`/khuyen-mai/${id}/chi-tiet`);
};

export const createKhuyenMai = (data) => {
    return api.post("/khuyen-mai", data);
};

export const updateKhuyenMai = (id, data) => {
    return api.put(`/khuyen-mai/${id}`, data);
};

export const deleteKhuyenMai = (id) => {
    return api.delete(`/khuyen-mai/${id}`);
};