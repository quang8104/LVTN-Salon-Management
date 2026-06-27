import axios from "axios";

const API="http://localhost:8080/api/lich";

export const getLichSu = (maKhachHang) => {
    return axios.get(`${API}/khach-hang/${maKhachHang}`);
};

export const getHistoryById=(id)=>{

    return axios.get(`${API}/${id}`);

}

export const huyLich = (id) => {

    return axios.put(`${API}/${id}/huy`);

}
