import axios from "axios";

const API = "http://localhost:8080/api/dichvu";

export const getAllDichVu = () => {
    return axios.get(API);
};

export const createDichVu = (data) => {
    return axios.post(API, data);
};

export const updateDichVu = (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteDichVu = (id) => {
    return axios.delete(`${API}/${id}`);
};