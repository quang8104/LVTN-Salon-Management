import api from "./axios";

export const getCauHinhSalon = () => {
    return api.get("/cau-hinh-salon");
};

export const updateCauHinhSalon = (data) => {
    return api.put("/cau-hinh-salon", data);
};