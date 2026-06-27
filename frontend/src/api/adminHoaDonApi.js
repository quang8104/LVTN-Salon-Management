import axios from "axios";

const API = "http://localhost:8080/api/hoa-don";

export const getAllHoaDon = () => {
    return axios.get(API);
};

export const thanhToanHoaDon = (id) => {
    return axios.put(`${API}/${id}/thanh-toan`);
};