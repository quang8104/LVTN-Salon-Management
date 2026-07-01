import axios from "axios";

const API = "http://localhost:8080/api/lich-hen";

export const getAllLich = () => {
    return axios.get(API);
};

export const xacNhanLich = (id) => {
    return axios.put(`${API}/${id}/xac-nhan`);
};

export const hoanTatLich = (id) => {
    return axios.put(`${API}/${id}/hoan-tat`);
};

export const huyLich = (id) => {
    return axios.put(`${API}/${id}/huy`);
};

export const getChiTietLich = (id) => {
    return axios.get(`${API}/${id}/chi-tiet`);
};

export const batDauLich = (id) => {
    return axios.put(`${API}/${id}/bat-dau`);
};

export const huyLichAdmin = (id, data) => {
    return axios.put(`${API}/${id}/huy-admin`, data);
};

export const getLichSuLich = (id) => {
    return axios.get(`${API}/${id}/lich-su`);
};

export const suaLichAdmin = (id, data) => {
    return axios.put(`${API}/${id}/sua-admin`, data);
};