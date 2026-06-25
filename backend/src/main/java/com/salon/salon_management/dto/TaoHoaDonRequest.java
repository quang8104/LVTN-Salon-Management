package com.salon.salon_management.dto;

import java.util.List;

public class TaoHoaDonRequest {
    private Integer maKhachHang;

    private List<HoaDonItemRequest> items;

    public Integer getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(Integer maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public List<HoaDonItemRequest> getItems() {
        return items;
    }

    public void setItems(List<HoaDonItemRequest> items) {
        this.items = items;
    }

    
}
