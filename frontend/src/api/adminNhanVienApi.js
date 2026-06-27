import axios from "axios";

const API = "http://localhost:8080/api/nhanvien";

export const getAllNhanVien = () => {
    return axios.get(API);
};

export const createNhanVien = (data) => {
    return axios.post(API, data);
};

export const updateNhanVien = (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteNhanVien = (id) => {
    return axios.delete(`${API}/${id}`);
};