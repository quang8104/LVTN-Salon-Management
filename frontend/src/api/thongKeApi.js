import api from "./axios";

export const getTopDichVu = () => api.get("/thong-ke/top-dich-vu");