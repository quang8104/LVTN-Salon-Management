import api from "./axios";

export const getAllNghiPhepNhanVien = () => {
    return api.get("/nghi-phep-nhan-vien");
};

export const createNghiPhepNhanVien = (data) => {
    return api.post("/nghi-phep-nhan-vien", data);
};

export const deleteNghiPhepNhanVien = (id) => {
    return api.delete(`/nghi-phep-nhan-vien/${id}`);
};