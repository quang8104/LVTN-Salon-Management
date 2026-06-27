import axios from "axios";

const LICH_API = "http://localhost:8080/api/lich";
const HOA_DON_API = "http://localhost:8080/api/hoa-don";
const HOA_DON_BH_API = "http://localhost:8080/api/hoa-don-ban-hang";

export const getAllLich = () => {
    return axios.get(LICH_API);
};

export const getDoanhThuDichVu = () => {
    return axios.get(`${HOA_DON_API}/doanh-thu`);
};

export const getDoanhThuBanHang = () => {
    return axios.get(`${HOA_DON_BH_API}/doanh-thu`);
};