import axios from "axios";

const API = "http://localhost:8080/api/san-pham";

export const getAllSanPham = () => {
    return axios.get(API);
};

export const createSanPham = (data) => {
    return axios.post(API, data);
};

export const updateSanPham = (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteSanPham = (id) => {
    return axios.delete(`${API}/${id}`);
};

export const forgotPassword = (data) => {
    return axios.post(`${API}/forgot-password`, data);
};

export const resetPassword = (data) => {
    return axios.post(`${API}/reset-password`, data);
};