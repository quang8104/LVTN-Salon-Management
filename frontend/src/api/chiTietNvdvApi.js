import api from "./axios";

export const getDichVuTheoNhanVien = (maNhanVien) => {
    return api.get(`/chi-tiet-nvdv/nhan-vien/${maNhanVien}`);
};

export const ganDichVuChoNhanVien = (data) => {
    return api.post("/chi-tiet-nvdv/gan", data);
};