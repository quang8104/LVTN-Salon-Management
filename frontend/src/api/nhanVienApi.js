import api from "./axios";

export const getAllNhanVien = () => {
    return api.get("/nhanvien");
}
