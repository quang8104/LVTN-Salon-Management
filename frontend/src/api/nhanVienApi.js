import api from "./axios";

export const getAllNhanVien = () => {
    return api.get("/nhan-vien");
};