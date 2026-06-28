import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = (data) => {
    return axios.post(`${API}/login`, data);
};

export const register = (data) => {
    return axios.post(`${API}/register`, data);
};

export const verifyOtp = (data) => {
    return axios.post(`${API}/verify-otp`, data);
};

export const forgotPassword = (data) => {
    return axios.post(`${API}/forgot-password`, data);
};

export const resetPassword = (data) => {
    return axios.post(`${API}/reset-password`, data);
};