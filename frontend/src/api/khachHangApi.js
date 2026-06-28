import api from "./axios";

export const getKhachHangById = (id) => {
    return api.get(`/khach-hang/${id}`);
};

export const updateProfile = (id, data) => {
    return api.put(`/khach-hang/${id}/profile`, data);
};

export const changePassword = (id, data) => {
    return api.put(`/khach-hang/${id}/doi-mat-khau`, data);
};