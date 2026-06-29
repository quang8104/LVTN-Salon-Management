import api from "./axios";

export const getAllDanhMuc = () => {
    return api.get("/danh-muc");
};

export const getActiveDanhMuc = () => {
    return api.get("/danh-muc/active");
};

export const createDanhMuc = (data) => {
    return api.post("/danh-muc", data);
};

export const updateDanhMuc = (id, data) => {
    return api.put(`/danh-muc/${id}`, data);
};

export const deleteDanhMuc = (id) => {
    return api.delete(`/danh-muc/${id}`);
};