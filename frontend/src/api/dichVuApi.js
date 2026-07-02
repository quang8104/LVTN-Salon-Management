import api from "./axios";

export const getAllServices = () => {
    return api.get("/dichvu");
};

export const getAllDichVuKhuyenMai = () => {
    return api.get("/dichvu/khuyen-mai");
};

export const getServiceById = (id) => {
    return api.get(`/dichvu/${id}`);
};

