import api from "./axios";

export const filterBooking = (data) => {
    return api.post("/booking/filter", data);
};