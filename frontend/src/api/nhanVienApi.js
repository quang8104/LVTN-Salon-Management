import axios from "axios";

const API = "http://localhost:8080/api/nhanvien";

export const getAllNhanVien = () => {
    return axios.get(API);
};