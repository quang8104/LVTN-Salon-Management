import api from "./axios";

export const getSlotRanh = (maNhanVien, ngayHen) => {

    return api.get("/lich/slot-ranh", {

        params: {

            maNhanVien,

            ngayHen

        }

    });

}