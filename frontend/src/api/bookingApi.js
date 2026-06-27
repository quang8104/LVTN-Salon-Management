import axios from "axios";
import { useSelectedService } from "../context/SelectedServiceContext";

const API = "http://localhost:8080/api/lich";

export const datLich = (data) => {
    return axios.post(`${API}/dat-lich`, data);
};